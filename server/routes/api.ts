import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { pool } from '../db';
import { requireAuth, generateToken, logActivity, createNotification, AuthRequest } from '../auth';
import { getIO } from '../socket';
import { getSafeAISettings, getRuntimeAISettings, updateAISettings, testOpenRouterConnection, fetchOpenRouterModels } from '../services/aiSettingsService';
import { invalidateKnowledgeCache } from '../services/knowledgeRetrievalService';
import { updateAgentHeartbeat, setAgentStatus, getAgentPresenceSummary } from '../services/presenceService';
import { shouldAIRespond, generateAIResponse } from '../services/openRouterService';

const router = Router();

// Ensure uploads directory exists
const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration for resume / document uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'resume-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx', '.rtf', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only document files (.pdf, .doc, .docx) are accepted'));
    }
  },
});

// Multer configuration for brand logo upload
const logoStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.png';
    cb(null, 'valora-brand-logo-' + Date.now() + ext);
  },
});

const uploadLogo = multer({
  storage: logoStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, cb) => {
    const allowed = ['.png', '.jpg', '.jpeg', '.svg', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (.png, .jpg, .jpeg, .svg, .webp) are accepted for brand logo'));
    }
  },
});

// ==========================================
// 1. AUTHENTICATION ROUTES
// ==========================================

router.post('/auth/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const [rows] = await pool.query(
      'SELECT id, name, email, password_hash, role, phone, status FROM admin_users WHERE email = ?',
      [email.trim().toLowerCase()]
    ) as any;

    if (!rows || rows.length === 0) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const user = rows[0];
    if (user.status !== 'active') {
      res.status(403).json({ error: 'Your account is currently inactive. Contact your administrator.' });
      return;
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Update last login timestamp
    await pool.query('UPDATE admin_users SET last_login_at = NOW() WHERE id = ?', [user.id]);

    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    await logActivity(user.id, user.name, 'Admin Login', 'admin_users', user.id, 'Logged in to admin portal');

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Authentication service error' });
  }
});

router.get('/auth/me', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, phone, status, last_login_at, created_at FROM admin_users WHERE id = ?',
      [req.user!.id]
    ) as any;

    if (!rows || rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user: rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

router.post('/auth/change-password', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 8) {
      res.status(400).json({ error: 'New password must be at least 8 characters' });
      return;
    }

    const [rows] = await pool.query('SELECT password_hash FROM admin_users WHERE id = ?', [req.user!.id]) as any;
    if (!rows || rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const match = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!match) {
      res.status(400).json({ error: 'Current password is incorrect' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);
    await pool.query('UPDATE admin_users SET password_hash = ? WHERE id = ?', [newHash, req.user!.id]);

    await logActivity(req.user!.id, req.user!.name, 'Change Password', 'admin_users', req.user!.id, 'Updated admin password');
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update password' });
  }
});

// ==========================================
// 2. DASHBOARD ANALYTICS & STATS
// ==========================================

router.get('/dashboard/stats', requireAuth, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [enquiriesCount] = await pool.query('SELECT COUNT(*) as count FROM enquiries') as any;
    const [newEnquiriesCount] = await pool.query('SELECT COUNT(*) as count FROM enquiries WHERE status = "new"') as any;

    const [employersCount] = await pool.query('SELECT COUNT(*) as count FROM employers') as any;
    const [activeEmployers] = await pool.query('SELECT COUNT(*) as count FROM employers WHERE status = "active"') as any;

    const [candidatesCount] = await pool.query('SELECT COUNT(*) as count FROM candidates') as any;
    const [placedCandidates] = await pool.query('SELECT COUNT(*) as count FROM candidates WHERE status = "placed"') as any;

    const [staffingRequestsCount] = await pool.query('SELECT COUNT(*) as count FROM staffing_requests') as any;
    const [openRequestsCount] = await pool.query('SELECT COUNT(*) as count FROM staffing_requests WHERE status IN ("new", "reviewing", "sourcing")') as any;

    const [jobsCount] = await pool.query('SELECT COUNT(*) as count FROM jobs WHERE status = "published"') as any;
    const [applicationsCount] = await pool.query('SELECT COUNT(*) as count FROM applications') as any;
    const [activeChatsCount] = await pool.query('SELECT COUNT(*) as count FROM chat_conversations WHERE status = "open"') as any;

    // Monthly breakdown (last 6 months)
    const [monthlyData] = await pool.query(`
      SELECT 
        DATE_FORMAT(created_at, '%b %Y') as month,
        COUNT(id) as total_candidates
      FROM candidates
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%b %Y'), YEAR(created_at), MONTH(created_at)
      ORDER BY YEAR(created_at) ASC, MONTH(created_at) ASC
    `) as any;

    res.json({
      stats: {
        enquiries: enquiriesCount[0].count,
        newEnquiries: newEnquiriesCount[0].count,
        employers: employersCount[0].count,
        activeEmployers: activeEmployers[0].count,
        candidates: candidatesCount[0].count,
        placedCandidates: placedCandidates[0].count,
        staffingRequests: staffingRequestsCount[0].count,
        openStaffingRequests: openRequestsCount[0].count,
        activeJobs: jobsCount[0].count,
        applications: applicationsCount[0].count,
        activeChats: activeChatsCount[0].count,
      },
      monthlyTrends: monthlyData || [],
    });
  } catch (err: any) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ error: 'Failed to retrieve dashboard statistics' });
  }
});

router.get('/dashboard/recent-activity', requireAuth, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [logs] = await pool.query(`
      SELECT id, admin_name, action, entity_type, entity_id, details, created_at
      FROM activity_logs
      ORDER BY created_at DESC
      LIMIT 15
    `) as any;

    res.json({ activity: logs });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch activity logs' });
  }
});

// ==========================================
// 3. ENQUIRIES / CONTACT FORM SUBMISSIONS
// ==========================================

// Public website submission
router.post('/enquiries/submit', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, subject, inquiry_type, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Name, email, and message are required fields' });
      return;
    }

    const [result] = await pool.query(`
      INSERT INTO enquiries (name, email, phone, subject, inquiry_type, message, status)
      VALUES (?, ?, ?, ?, ?, ?, 'new')
    `, [name, email, phone || null, subject || 'General Website Enquiry', inquiry_type || 'General', message]) as any;

    await createNotification(
      'New Website Enquiry',
      `From ${name} (${email}): "${(subject || inquiry_type || 'General').substring(0, 50)}"`,
      'enquiry',
      '/admin/enquiries'
    );

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received. Our clinical staffing team will respond promptly.',
      id: result.insertId,
    });
  } catch (err: any) {
    console.error('Error submitting enquiry:', err);
    res.status(500).json({ error: 'Failed to submit enquiry. Please try again or call us directly.' });
  }
});

// Admin list enquiries
router.get('/enquiries', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const status = req.query.status as string;
    const search = req.query.search as string;

    let query = 'SELECT * FROM enquiries WHERE 1=1';
    const params: any[] = [];

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }
    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ? OR subject LIKE ? OR message LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s, s);
    }

    query += ' ORDER BY created_at DESC';
    const [rows] = await pool.query(query, params) as any;
    res.json({ enquiries: rows });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load enquiries' });
  }
});

// Admin update enquiry status & notes
router.patch('/enquiries/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    await pool.query(
      'UPDATE enquiries SET status = COALESCE(?, status), admin_notes = COALESCE(?, admin_notes) WHERE id = ?',
      [status, admin_notes, id]
    );

    await logActivity(req.user!.id, req.user!.name, 'Update Enquiry', 'enquiries', parseInt(id), `Updated enquiry #${id} status: ${status}`);
    res.json({ success: true, message: 'Enquiry updated' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update enquiry' });
  }
});

// Admin delete enquiry
router.delete('/enquiries/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM enquiries WHERE id = ?', [id]);
    await logActivity(req.user!.id, req.user!.name, 'Delete Enquiry', 'enquiries', parseInt(id), `Deleted enquiry #${id}`);
    res.json({ success: true, message: 'Enquiry deleted' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete enquiry' });
  }
});

// ==========================================
// 4. EMPLOYERS / HEALTHCARE FACILITIES
// ==========================================

router.get('/employers', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const status = req.query.status as string;
    const search = req.query.search as string;

    let query = 'SELECT * FROM employers WHERE 1=1';
    const params: any[] = [];

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }
    if (search) {
      query += ' AND (organization_name LIKE ? OR contact_name LIKE ? OR email LIKE ? OR location LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    query += ' ORDER BY created_at DESC';
    const [rows] = await pool.query(query, params) as any;
    res.json({ employers: rows });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch employers' });
  }
});

router.post('/employers', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { organization_name, contact_name, email, phone, facility_type, location, status, notes } = req.body;
    if (!organization_name || !contact_name || !email || !phone) {
      res.status(400).json({ error: 'Organization name, contact name, email, and phone are required' });
      return;
    }

    const [result] = await pool.query(`
      INSERT INTO employers (organization_name, contact_name, email, phone, facility_type, location, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [organization_name, contact_name, email, phone, facility_type || 'Hospital', location, status || 'lead', notes]) as any;

    await logActivity(req.user!.id, req.user!.name, 'Create Employer', 'employers', result.insertId, `Added facility ${organization_name}`);
    res.status(201).json({ success: true, id: result.insertId, message: 'Employer partner created' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create employer' });
  }
});

router.put('/employers/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { organization_name, contact_name, email, phone, facility_type, location, status, notes } = req.body;

    await pool.query(`
      UPDATE employers
      SET organization_name = ?, contact_name = ?, email = ?, phone = ?, facility_type = ?, location = ?, status = ?, notes = ?
      WHERE id = ?
    `, [organization_name, contact_name, email, phone, facility_type, location, status, notes, id]);

    await logActivity(req.user!.id, req.user!.name, 'Update Employer', 'employers', parseInt(id), `Updated facility ${organization_name}`);
    res.json({ success: true, message: 'Employer updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update employer' });
  }
});

router.delete('/employers/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM employers WHERE id = ?', [id]);
    await logActivity(req.user!.id, req.user!.name, 'Delete Employer', 'employers', parseInt(id), `Deleted employer #${id}`);
    res.json({ success: true, message: 'Employer deleted' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete employer' });
  }
});

// ==========================================
// 5. CANDIDATES & HEALTHCARE TALENT
// ==========================================

// Public talent registration (Careers / Register form)
router.post('/candidates/register', upload.single('resume'), async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      profession,
      specialty,
      experience_years,
      license_state,
      preferred_location,
      availability,
      notes,
    } = req.body;

    if (!first_name || !last_name || !email || !phone || !profession) {
      res.status(400).json({ error: 'First name, last name, email, phone, and profession are required' });
      return;
    }

    let resume_url = null;
    let resume_filename = null;
    if (req.file) {
      resume_filename = req.file.originalname;
      resume_url = `/api/documents/download/${req.file.filename}`;
    }

    const [result] = await pool.query(`
      INSERT INTO candidates (
        first_name, last_name, email, phone, profession, specialty,
        experience_years, license_state, preferred_location, availability,
        resume_url, resume_filename, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?)
    `, [
      first_name, last_name, email, phone, profession, specialty || 'General',
      experience_years || '1-3 years', license_state || null, preferred_location || null, availability || 'Immediate',
      resume_url, resume_filename, notes || null,
    ]) as any;

    await createNotification(
      'New Candidate Registered',
      `${first_name} ${last_name} (${profession} - ${specialty || 'General'}) registered on Valora Careers`,
      'candidate',
      '/admin/candidates'
    );

    res.status(201).json({
      success: true,
      id: result.insertId,
      message: 'Registration successful! A Valora clinical recruitment specialist will review your profile.',
    });
  } catch (err: any) {
    console.error('Candidate registration error:', err);
    res.status(500).json({ error: 'Failed to submit candidate profile. Please check your information and try again.' });
  }
});

router.get('/candidates', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const status = req.query.status as string;
    const profession = req.query.profession as string;
    const search = req.query.search as string;

    let query = 'SELECT * FROM candidates WHERE 1=1';
    const params: any[] = [];

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }
    if (profession && profession !== 'all') {
      query += ' AND profession = ?';
      params.push(profession);
    }
    if (search) {
      query += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR specialty LIKE ? OR license_state LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s, s);
    }

    query += ' ORDER BY created_at DESC';
    const [rows] = await pool.query(query, params) as any;
    res.json({ candidates: rows });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
});

router.post('/candidates', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      first_name, last_name, email, phone, profession, specialty,
      experience_years, license_state, preferred_location, availability, status, notes
    } = req.body;

    const [result] = await pool.query(`
      INSERT INTO candidates (
        first_name, last_name, email, phone, profession, specialty,
        experience_years, license_state, preferred_location, availability, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      first_name, last_name, email, phone, profession, specialty,
      experience_years, license_state, preferred_location, availability, status || 'new', notes
    ]) as any;

    await logActivity(req.user!.id, req.user!.name, 'Create Candidate', 'candidates', result.insertId, `Added talent ${first_name} ${last_name}`);
    res.status(201).json({ success: true, id: result.insertId, message: 'Candidate created' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create candidate' });
  }
});

router.patch('/candidates/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, notes, specialty, availability } = req.body;

    await pool.query(`
      UPDATE candidates 
      SET status = COALESCE(?, status), notes = COALESCE(?, notes),
          specialty = COALESCE(?, specialty), availability = COALESCE(?, availability)
      WHERE id = ?
    `, [status, notes, specialty, availability, id]);

    await logActivity(req.user!.id, req.user!.name, 'Update Candidate', 'candidates', parseInt(id), `Updated candidate #${id} status: ${status}`);
    res.json({ success: true, message: 'Candidate updated' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update candidate' });
  }
});

router.delete('/candidates/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM candidates WHERE id = ?', [id]);
    await logActivity(req.user!.id, req.user!.name, 'Delete Candidate', 'candidates', parseInt(id), `Deleted candidate #${id}`);
    res.json({ success: true, message: 'Candidate removed' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete candidate' });
  }
});

// ==========================================
// 6. STAFFING REQUESTS (HEALTHCARE EMPLOYERS)
// ==========================================

// Public website staffing request form
router.post('/staffing-requests/submit', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      organization_name,
      contact_name,
      email,
      phone,
      facility_type,
      staffing_type,
      roles_needed,
      number_of_positions,
      urgency,
      start_date,
      shift_preference,
      location,
      details,
    } = req.body;

    if (!organization_name || !contact_name || !email || !phone) {
      res.status(400).json({ error: 'Facility name, contact person, email, and phone are required' });
      return;
    }

    const [result] = await pool.query(`
      INSERT INTO staffing_requests (
        organization_name, contact_name, email, phone, facility_type, staffing_type,
        roles_needed, number_of_positions, urgency, start_date, shift_preference, location, details, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')
    `, [
      organization_name, contact_name, email, phone, facility_type || 'Hospital',
      staffing_type || 'Travel / Contract', roles_needed || 'Nursing',
      parseInt(number_of_positions || '1', 10), urgency || 'Normal',
      start_date || 'ASAP', shift_preference || 'Flexible', location || 'Not Specified', details || null
    ]) as any;

    // Check if employer exists or add to employers table automatically
    const [existing] = await pool.query('SELECT id FROM employers WHERE email = ?', [email]) as any;
    if (!existing || existing.length === 0) {
      await pool.query(`
        INSERT INTO employers (organization_name, contact_name, email, phone, facility_type, location, status, notes)
        VALUES (?, ?, ?, ?, ?, ?, 'lead', ?)
      `, [organization_name, contact_name, email, phone, facility_type || 'Hospital', location || 'Unspecified', `Staffing request submitted for: ${roles_needed}`]);
    }

    await createNotification(
      'Urgent Staffing Request',
      `From ${organization_name} (${contact_name}): ${number_of_positions || 1}x ${roles_needed || 'Staff'}`,
      'staffing',
      '/admin/staffing-requests'
    );

    res.status(201).json({
      success: true,
      id: result.insertId,
      message: 'Staffing request logged. Our clinical staffing coordinators will reach out immediately.',
    });
  } catch (err: any) {
    console.error('Error submitting staffing request:', err);
    res.status(500).json({ error: 'Failed to submit staffing request' });
  }
});

router.get('/staffing-requests', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const status = req.query.status as string;
    const search = req.query.search as string;

    let query = 'SELECT * FROM staffing_requests WHERE 1=1';
    const params: any[] = [];

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }
    if (search) {
      query += ' AND (organization_name LIKE ? OR contact_name LIKE ? OR email LIKE ? OR roles_needed LIKE ? OR location LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s, s);
    }

    query += ' ORDER BY created_at DESC';
    const [rows] = await pool.query(query, params) as any;
    res.json({ staffing_requests: rows });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch staffing requests' });
  }
});

router.patch('/staffing-requests/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, priority } = req.body;

    await pool.query(
      'UPDATE staffing_requests SET status = COALESCE(?, status), priority = COALESCE(?, priority) WHERE id = ?',
      [status, priority, id]
    );

    await logActivity(req.user!.id, req.user!.name, 'Update Staffing Request', 'staffing_requests', parseInt(id), `Updated request #${id} status: ${status}`);
    res.json({ success: true, message: 'Staffing request updated' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update staffing request' });
  }
});

router.delete('/staffing-requests/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM staffing_requests WHERE id = ?', [id]);
    await logActivity(req.user!.id, req.user!.name, 'Delete Staffing Request', 'staffing_requests', parseInt(id), `Deleted staffing request #${id}`);
    res.json({ success: true, message: 'Staffing request removed' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete staffing request' });
  }
});

// ==========================================
// 7. JOBS & CAREER OPENINGS
// ==========================================

// Public published jobs for careers page
router.get('/jobs/published', async (_req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query(`
      SELECT id, title, department, job_type, location, pay_range, description, requirements, benefits, created_at
      FROM jobs
      WHERE status = 'published'
      ORDER BY created_at DESC
    `) as any;
    res.json({ jobs: rows });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch published jobs' });
  }
});

// Admin jobs list
router.get('/jobs', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const status = req.query.status as string;
    const department = req.query.department as string;
    const search = req.query.search as string;

    let query = 'SELECT * FROM jobs WHERE 1=1';
    const params: any[] = [];

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }
    if (department && department !== 'all') {
      query += ' AND department = ?';
      params.push(department);
    }
    if (search) {
      query += ' AND (title LIKE ? OR location LIKE ? OR description LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    query += ' ORDER BY created_at DESC';
    const [rows] = await pool.query(query, params) as any;
    res.json({ jobs: rows });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

router.post('/jobs', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, department, job_type, location, pay_range, description, requirements, benefits, status } = req.body;
    if (!title || !department || !job_type || !location || !description) {
      res.status(400).json({ error: 'Title, department, job type, location, and description are required' });
      return;
    }

    const [result] = await pool.query(`
      INSERT INTO jobs (title, department, job_type, location, pay_range, description, requirements, benefits, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [title, department, job_type, location, pay_range, description, requirements, benefits, status || 'published']) as any;

    await logActivity(req.user!.id, req.user!.name, 'Create Job', 'jobs', result.insertId, `Created opening: ${title}`);
    res.status(201).json({ success: true, id: result.insertId, message: 'Job posting created' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create job posting' });
  }
});

router.put('/jobs/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, department, job_type, location, pay_range, description, requirements, benefits, status } = req.body;

    await pool.query(`
      UPDATE jobs
      SET title = ?, department = ?, job_type = ?, location = ?, pay_range = ?,
          description = ?, requirements = ?, benefits = ?, status = ?
      WHERE id = ?
    `, [title, department, job_type, location, pay_range, description, requirements, benefits, status, id]);

    await logActivity(req.user!.id, req.user!.name, 'Update Job', 'jobs', parseInt(id), `Updated opening: ${title}`);
    res.json({ success: true, message: 'Job posting updated' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update job' });
  }
});

router.delete('/jobs/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM jobs WHERE id = ?', [id]);
    await logActivity(req.user!.id, req.user!.name, 'Delete Job', 'jobs', parseInt(id), `Deleted job #${id}`);
    res.json({ success: true, message: 'Job posting deleted' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

// ==========================================
// 8. APPLICATIONS
// ==========================================

// Public apply for job
router.post('/applications/submit', upload.single('resume'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { job_id, applicant_name, applicant_email, applicant_phone, profession, experience, cover_note } = req.body;
    if (!applicant_name || !applicant_email || !applicant_phone) {
      res.status(400).json({ error: 'Name, email, and phone number are required' });
      return;
    }

    let resume_url = null;
    let resume_filename = null;
    if (req.file) {
      resume_filename = req.file.originalname;
      resume_url = `/api/documents/download/${req.file.filename}`;
    }

    const [result] = await pool.query(`
      INSERT INTO applications (job_id, applicant_name, applicant_email, applicant_phone, profession, experience, resume_url, resume_filename, cover_note, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'applied')
    `, [
      job_id ? parseInt(job_id, 10) : null,
      applicant_name, applicant_email, applicant_phone,
      profession || 'Healthcare Professional', experience || 'Experienced',
      resume_url, resume_filename, cover_note || null
    ]) as any;

    await createNotification(
      'New Job Application Received',
      `${applicant_name} applied for position (Job ID: ${job_id || 'General Pool'})`,
      'application',
      '/admin/applications'
    );

    res.status(201).json({
      success: true,
      id: result.insertId,
      message: 'Application submitted successfully! Our recruitment team will review your qualifications.',
    });
  } catch (err: any) {
    console.error('Application submit error:', err);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

router.get('/applications', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const status = req.query.status as string;
    const search = req.query.search as string;

    let query = `
      SELECT a.*, j.title as job_title, j.department as job_department
      FROM applications a
      LEFT JOIN jobs j ON a.job_id = j.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status && status !== 'all') {
      query += ' AND a.status = ?';
      params.push(status);
    }
    if (search) {
      query += ' AND (a.applicant_name LIKE ? OR a.applicant_email LIKE ? OR a.profession LIKE ? OR j.title LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    query += ' ORDER BY a.created_at DESC';
    const [rows] = await pool.query(query, params) as any;
    res.json({ applications: rows });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

router.patch('/applications/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    await pool.query(
      'UPDATE applications SET status = COALESCE(?, status), admin_notes = COALESCE(?, admin_notes) WHERE id = ?',
      [status, admin_notes, id]
    );

    await logActivity(req.user!.id, req.user!.name, 'Update Application', 'applications', parseInt(id), `Updated application #${id} status: ${status}`);
    res.json({ success: true, message: 'Application updated' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update application' });
  }
});

// ==========================================
// 9. LIVE CHAT SYSTEM
// ==========================================

// Helper to normalize conversation record
function normalizeConversation(row: any) {
  if (!row) return null;
  return {
    id: row.id,
    session_id: row.visitorId || row.id,
    visitorId: row.visitorId || row.id,
    visitor_name: row.visitorName || 'Website Visitor',
    visitorName: row.visitorName || 'Website Visitor',
    visitor_email: row.visitorEmail || null,
    visitorEmail: row.visitorEmail || null,
    visitor_phone: row.visitorPhone || null,
    visitorPhone: row.visitorPhone || null,
    topic: row.topic || 'General Inquiry',
    visitor_type: row.visitor_type || row.visitorRole || 'Visitor',
    visitorRole: row.visitor_type || row.visitorRole || 'Visitor',
    status: row.status === 'resolved' ? 'closed' : 'open',
    raw_status: row.status,
    mode: row.mode || 'ai',
    assigned_agent_id: row.assigned_agent_id || null,
    assigned_agent_name: row.assigned_agent_name || null,
    handover_requested: Boolean(row.handover_requested),
    unread_count: row.unreadByAdmin || 0,
    unreadByAdmin: row.unreadByAdmin || 0,
    last_message: row.last_message || null,
    last_message_at: row.updatedAt || row.createdAt,
    created_at: row.createdAt,
  };
}

// Helper to normalize message record
function normalizeMessage(m: any) {
  if (!m) return null;
  const isAi = m.sender === 'ai';
  const isAdmin = m.sender === 'admin';
  return {
    id: m.id,
    conversation_id: m.conversationId,
    conversationId: m.conversationId,
    sender_type: isAi ? 'bot' : m.sender,
    sender: m.sender,
    sender_name: m.senderName || (isAdmin ? 'Clinical Coordinator' : isAi ? 'Valora Assistant' : 'Visitor'),
    senderName: m.senderName,
    sender_role: m.senderRole || null,
    senderRole: m.senderRole || null,
    message: m.content,
    content: m.content,
    model_used: m.model_used || null,
    tokens_used: m.tokens_used || null,
    created_at: m.timestamp || new Date().toISOString(),
    timestamp: m.timestamp || new Date().toISOString(),
    status: m.status || 'delivered',
  };
}

// Visitor starts or retrieves conversation
router.post('/chat/start', async (req: Request, res: Response): Promise<void> => {
  try {
    const { session_id, visitor_name, visitor_email, visitor_phone, topic, visitor_type } = req.body;
    if (!session_id) {
      res.status(400).json({ error: 'session_id is required' });
      return;
    }

    const [existing] = await pool.query(
      'SELECT * FROM chat_conversations WHERE visitorId = ? OR id = ?',
      [session_id, session_id]
    ) as any;

    if (existing && existing.length > 0) {
      const conv = existing[0];
      // Update contact details / topic if provided
      await pool.query(
        `UPDATE chat_conversations 
         SET visitorName = COALESCE(?, visitorName),
             visitorEmail = COALESCE(?, visitorEmail),
             visitorPhone = COALESCE(?, visitorPhone),
             topic = COALESCE(?, topic),
             visitor_type = COALESCE(?, visitor_type),
             updatedAt = NOW()
         WHERE id = ?`,
        [visitor_name || null, visitor_email || null, visitor_phone || null, topic || null, visitor_type || null, conv.id]
      );
      const [updated] = await pool.query('SELECT * FROM chat_conversations WHERE id = ?', [conv.id]) as any;
      res.json({ conversation: normalizeConversation(updated[0]) });
      return;
    }

    const convId = crypto.randomUUID();
    const assignedTopic = topic || 'General Clinical Inquiry';
    const assignedVisitorType = visitor_type || 'Visitor';
    const vName = visitor_name || 'Website Visitor';

    await pool.query(`
      INSERT INTO chat_conversations (id, visitorId, visitorName, visitorEmail, visitorPhone, topic, visitor_type, status, unreadByAdmin, unreadByVisitor)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'active', 1, 0)
    `, [convId, session_id, vName, visitor_email || null, visitor_phone || null, assignedTopic, assignedVisitorType]);

    // Tailored greeting based on topic
    let greeting = 'Hello! Welcome to Valora Healthcare. How can our staffing coordinators assist you today?';
    if (assignedTopic.includes('Staffing') || assignedTopic.includes('Facility') || assignedTopic === 'facility') {
      greeting = 'Hello! Welcome to Valora Healthcare Staffing. How many clinicians or specialized shifts does your facility need coverage for? You can also reach our 24/7 direct clinical dispatch line at +1 (800) 555-0199.';
    } else if (assignedTopic.includes('Nursing') || assignedTopic === 'nursing') {
      greeting = 'Hi there! Welcome to Valora Nursing Careers. Which specialty (ICU, ED, Med/Surg, etc.) and placement model (Travel 13-week contract or Per Diem shifts) are you looking for?';
    } else if (assignedTopic.includes('Allied') || assignedTopic === 'allied') {
      greeting = 'Welcome! We have immediate Allied Health placements for Physical/Occupational Therapists, Lab Scientists, and Imaging Technologists. Which discipline do you practice?';
    } else if (assignedTopic.includes('Application') || assignedTopic === 'application') {
      greeting = 'Hello! Please share your full name and the job title you applied for, and our recruitment team will check your review status right away.';
    }

    // Send automatic greeting message from system
    const greetingMsgId = crypto.randomUUID();
    await pool.query(`
      INSERT INTO chat_messages (id, conversationId, sender, senderName, senderRole, content, timestamp, status)
      VALUES (?, ?, 'ai', 'Valora Assistant', 'System Dispatch', ?, NOW(), 'delivered')
    `, [greetingMsgId, convId, greeting]);

    const [created] = await pool.query('SELECT * FROM chat_conversations WHERE id = ?', [convId]) as any;

    await createNotification(
      'Live Chat Started',
      `New chat session (${assignedTopic}) initiated by ${vName}`,
      'chat',
      '/admin/live-chat'
    );

    // Notify any active admin sockets of new conversation
    const io = getIO();
    if (io) {
      io.to('admins_room').emit('conversation_updated', {
        conversationId: convId,
        lastMessage: greeting,
        senderType: 'ai',
        senderName: 'Valora Assistant',
        timestamp: new Date().toISOString(),
      });
    }

    res.status(201).json({ conversation: normalizeConversation(created[0]) });
  } catch (err: any) {
    console.error('Chat start error:', err);
    res.status(500).json({ error: 'Failed to start chat conversation' });
  }
});

// Fetch messages for a conversation
router.get('/chat/messages/:conversationId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { conversationId } = req.params;
    const [messages] = await pool.query(
      'SELECT * FROM chat_messages WHERE conversationId = ? ORDER BY timestamp ASC',
      [conversationId]
    ) as any;
    const normalized = (messages || []).map(normalizeMessage);
    res.json({ messages: normalized });
  } catch (err) {
    console.error('Fetch messages error:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send message
router.post('/chat/send', async (req: Request, res: Response): Promise<void> => {
  try {
    const { conversation_id, sender_type, sender_name, message } = req.body;
    if (!conversation_id || !message) {
      res.status(400).json({ error: 'conversation_id and message are required' });
      return;
    }

    const msgId = crypto.randomUUID();
    const mappedSender = sender_type === 'bot' || sender_type === 'ai' ? 'ai' : sender_type === 'admin' ? 'admin' : 'visitor';
    const senderRole = sender_type === 'admin' ? 'Clinical Coordinator' : mappedSender === 'ai' ? 'System Dispatch' : 'Visitor';

    await pool.query(`
      INSERT INTO chat_messages (id, conversationId, sender, senderName, senderRole, content, timestamp, status)
      VALUES (?, ?, ?, ?, ?, ?, NOW(), 'delivered')
    `, [msgId, String(conversation_id), mappedSender, sender_name || 'User', senderRole, message]);

    // Update conversation timestamp
    await pool.query('UPDATE chat_conversations SET updatedAt = NOW() WHERE id = ?', [String(conversation_id)]);

    const [saved] = await pool.query('SELECT * FROM chat_messages WHERE id = ?', [msgId]) as any;
    const normalized = normalizeMessage(saved[0]);

    // Emit via Socket.io
    const io = getIO();
    if (io) {
      io.to(`conversation_${conversation_id}`).emit('new_message', normalized);
      io.to('admins_room').emit('conversation_updated', {
        conversationId: conversation_id,
        lastMessage: message,
        senderType: mappedSender,
        senderName: sender_name,
        timestamp: new Date().toISOString(),
      });
    }

    // Trigger AI response asynchronously if visitor and eligible
    if (mappedSender === 'visitor') {
      shouldAIRespond(String(conversation_id)).then(async (aiCheck) => {
        if (aiCheck.shouldRespond) {
          const aiResult = await generateAIResponse({
            conversationId: String(conversation_id),
            visitorMessage: message,
            visitorName: sender_name,
          });

          if (io) {
            const aiPayload = {
              id: aiResult.messageId,
              conversation_id: String(conversation_id),
              conversationId: String(conversation_id),
              sender_type: 'bot',
              sender: 'ai',
              sender_name: 'Valora AI Virtual Assistant',
              senderName: 'Valora AI Virtual Assistant',
              message: aiResult.replyText,
              content: aiResult.replyText,
              model_used: aiResult.modelUsed,
              created_at: new Date().toISOString(),
              timestamp: new Date().toISOString(),
              status: 'delivered',
            };
            io.to(`conversation_${conversation_id}`).emit('new_message', aiPayload);
            io.to('admins_room').emit('conversation_updated', {
              conversationId: String(conversation_id),
              lastMessage: aiResult.replyText,
              senderType: 'ai',
              senderName: 'Valora AI Virtual Assistant',
              timestamp: new Date().toISOString(),
            });
          }
        }
      }).catch((e) => console.error('[REST Chat] AI error:', e));
    }

    res.status(201).json({ message: normalized });
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Upload attachment in chat (e.g. resume or document)
router.post('/chat/upload', upload.single('attachment'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { conversation_id, sender_type, sender_name } = req.body;
    if (!req.file || !conversation_id) {
      res.status(400).json({ error: 'File and conversation_id are required' });
      return;
    }

    const fileUrl = `/api/documents/download/${req.file.filename}`;
    const messageText = `📎 Shared Attachment: [${req.file.originalname}](${fileUrl})`;
    const msgId = crypto.randomUUID();
    const mappedSender = sender_type === 'bot' || sender_type === 'ai' ? 'ai' : sender_type === 'admin' ? 'admin' : 'visitor';
    const senderRole = sender_type === 'admin' ? 'Clinical Coordinator' : 'Visitor';

    await pool.query(`
      INSERT INTO chat_messages (id, conversationId, sender, senderName, senderRole, content, timestamp, status)
      VALUES (?, ?, ?, ?, ?, ?, NOW(), 'delivered')
    `, [msgId, String(conversation_id), mappedSender, sender_name || 'User', senderRole, messageText]);

    await pool.query('UPDATE chat_conversations SET updatedAt = NOW() WHERE id = ?', [String(conversation_id)]);

    const [saved] = await pool.query('SELECT * FROM chat_messages WHERE id = ?', [msgId]) as any;
    const normalized = normalizeMessage(saved[0]);

    // Emit via Socket.io
    const io = getIO();
    if (io) {
      io.to(`conversation_${conversation_id}`).emit('new_message', normalized);
      io.to('admins_room').emit('conversation_updated', {
        conversationId: conversation_id,
        lastMessage: messageText,
        senderType: mappedSender,
        senderName: sender_name,
        timestamp: new Date().toISOString(),
      });
    }

    res.status(201).json({ success: true, message: normalized, fileUrl });
  } catch (err: any) {
    console.error('Upload chat error:', err);
    res.status(500).json({ error: 'Failed to upload chat attachment' });
  }
});

// Admin chat conversations list with search and filter
router.get('/chat/conversations', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const status = req.query.status as string;
    const search = req.query.search as string;
    const topic = req.query.topic as string;

    let query = `
      SELECT c.*, 
        (SELECT content FROM chat_messages WHERE conversationId = c.id ORDER BY timestamp DESC LIMIT 1) as last_message,
        c.unreadByAdmin as unread_count
      FROM chat_conversations c
      WHERE 1=1
    `;
    const params: any[] = [];
    if (status && status !== 'all') {
      if (status === 'closed') {
        query += " AND c.status = 'resolved'";
      } else {
        query += " AND c.status != 'resolved'";
      }
    }
    if (topic && topic !== 'all') {
      query += ' AND c.topic LIKE ?';
      params.push(`%${topic}%`);
    }
    if (search) {
      query += ' AND (c.visitorName LIKE ? OR c.visitorEmail LIKE ? OR c.visitorPhone LIKE ? OR c.topic LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }
    query += ' ORDER BY c.updatedAt DESC';

    const [rows] = await pool.query(query, params) as any;
    const normalized = (rows || []).map(normalizeConversation);
    res.json({ conversations: normalized });
  } catch (err) {
    console.error('Get conversations error:', err);
    res.status(500).json({ error: 'Failed to load conversations' });
  }
});

// Close or update conversation status
router.patch('/chat/conversations/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, topic } = req.body;
    const mappedStatus = status === 'closed' ? 'resolved' : status === 'open' ? 'active' : status;

    await pool.query(
      'UPDATE chat_conversations SET status = COALESCE(?, status), topic = COALESCE(?, topic), updatedAt = NOW() WHERE id = ?',
      [mappedStatus, topic || null, id]
    );

    // Notify room of status change
    const io = getIO();
    if (io) {
      io.to(`conversation_${id}`).emit('conversation_status_changed', { status });
    }

    res.json({ success: true, message: 'Chat conversation updated' });
  } catch (err) {
    console.error('Update conversation error:', err);
    res.status(500).json({ error: 'Failed to update conversation' });
  }
});

// Mark messages in conversation as read
router.post('/chat/conversations/:id/mark-read', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE chat_messages SET status = "read" WHERE conversationId = ?', [id]);
    await pool.query('UPDATE chat_conversations SET unreadByAdmin = 0 WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Mark read error:', err);
    res.status(500).json({ error: 'Failed to mark messages read' });
  }
});

// Delete conversation
router.delete('/chat/conversations/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM chat_messages WHERE conversationId = ?', [id]);
    await pool.query('DELETE FROM chat_conversations WHERE id = ?', [id]);
    await logActivity(req.user!.id, req.user!.name, 'Delete Chat Conversation', 'chat_conversations', 0, `Deleted chat session #${id}`);
    res.json({ success: true, message: 'Conversation deleted' });
  } catch (err) {
    console.error('Delete conversation error:', err);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
});

// ==========================================
// 10. NOTIFICATIONS
// ==========================================

router.get('/notifications', requireAuth, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 30') as any;
    const [unread] = await pool.query('SELECT COUNT(*) as count FROM notifications WHERE is_read = 0') as any;
    res.json({ notifications: rows, unread_count: unread[0].count });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

router.post('/notifications/mark-read', requireAuth, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    await pool.query('UPDATE notifications SET is_read = 1 WHERE is_read = 0');
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to mark notifications read' });
  }
});

// ==========================================
// 11. ADMIN USERS & ROLES MANAGEMENT
// ==========================================

router.get('/users', requireAuth, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, phone, status, last_login_at, created_at FROM admin_users ORDER BY id ASC'
    ) as any;
    res.json({ users: rows });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch admin users' });
  }
});

router.post('/users', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, phone, status } = req.body;
    if (!name || !email || !password || !role) {
      res.status(400).json({ error: 'Name, email, password, and role are required' });
      return;
    }

    const [existing] = await pool.query('SELECT id FROM admin_users WHERE email = ?', [email]) as any;
    if (existing && existing.length > 0) {
      res.status(400).json({ error: 'An admin user with this email already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const [result] = await pool.query(`
      INSERT INTO admin_users (name, email, password_hash, role, phone, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [name, email.toLowerCase(), hash, role, phone || null, status || 'active']) as any;

    await logActivity(req.user!.id, req.user!.name, 'Create Admin User', 'admin_users', result.insertId, `Created admin ${name} (${role})`);
    res.status(201).json({ success: true, id: result.insertId, message: 'Admin user created successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create admin user' });
  }
});

router.put('/users/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, role, phone, status, password } = req.body;

    if (password && password.trim().length >= 8) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      await pool.query(
        'UPDATE admin_users SET name = ?, email = ?, role = ?, phone = ?, status = ?, password_hash = ? WHERE id = ?',
        [name, email.toLowerCase(), role, phone, status, hash, id]
      );
    } else {
      await pool.query(
        'UPDATE admin_users SET name = ?, email = ?, role = ?, phone = ?, status = ? WHERE id = ?',
        [name, email.toLowerCase(), role, phone, status, id]
      );
    }

    await logActivity(req.user!.id, req.user!.name, 'Update Admin User', 'admin_users', parseInt(id), `Updated user ${name}`);
    res.json({ success: true, message: 'User updated' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/users/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (parseInt(id, 10) === req.user!.id) {
      res.status(400).json({ error: 'You cannot delete your own active account' });
      return;
    }
    await pool.query('DELETE FROM admin_users WHERE id = ?', [id]);
    await logActivity(req.user!.id, req.user!.name, 'Delete Admin User', 'admin_users', parseInt(id), `Deleted admin user #${id}`);
    res.json({ success: true, message: 'Admin user deleted' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

router.get('/roles', requireAuth, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query('SELECT * FROM admin_roles ORDER BY id ASC') as any;
    res.json({ roles: rows });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
});

// ==========================================
// Public settings endpoint (for website Navbar, Footer, and branding without auth requirement)
router.get('/settings/public', async (_req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query('SELECT setting_key, setting_value FROM system_settings') as any;
    const settings: Record<string, string> = {};
    rows.forEach((r: any) => {
      settings[r.setting_key] = r.setting_value;
    });
    res.json({
      site_name: settings.site_name || 'Valora Healthcare',
      site_logo_url: settings.site_logo_url || '',
      phone_number: settings.phone_number || '+1 (800) 555-0199',
      contact_email: settings.contact_email || 'admin@valorahealthcare.com',
      enable_chat: settings.enable_chat !== 'false',
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch public settings' });
  }
});

router.get('/settings', requireAuth, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query('SELECT * FROM system_settings') as any;
    const settings: Record<string, string> = {};
    rows.forEach((r: any) => {
      settings[r.setting_key] = r.setting_value;
    });
    res.json({ settings });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

router.post('/settings', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const settings = req.body;
    for (const [key, value] of Object.entries(settings)) {
      await pool.query(`
        INSERT INTO system_settings (setting_key, setting_value)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE setting_value = ?
      `, [key, String(value), String(value)]);
    }

    await logActivity(req.user!.id, req.user!.name, 'Update Settings', 'system_settings', null, 'Saved updated system settings');
    res.json({ success: true, message: 'Settings saved' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

// Dynamic Logo Upload (Immediate persistence & real-time broadcast)
router.post('/settings/logo', requireAuth, uploadLogo.single('logo'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'Please choose an image file to upload as the logo (.png, .jpg, .svg, .webp)' });
      return;
    }

    const logoUrl = `/api/uploads/${req.file.filename}`;

    await pool.query(`
      INSERT INTO system_settings (setting_key, setting_value)
      VALUES ('site_logo_url', ?)
      ON DUPLICATE KEY UPDATE setting_value = ?
    `, [logoUrl, logoUrl]);

    await logActivity(req.user!.id, req.user!.name, 'Upload Brand Logo', 'system_settings', null, `Uploaded new dynamic logo: ${req.file.originalname}`);

    // Real-time broadcast to all connected web clients and admins
    const io = getIO();
    if (io) {
      io.emit('logo_updated', { logoUrl });
    }

    res.json({
      success: true,
      logoUrl,
      message: 'Brand logo uploaded and applied immediately across all public and admin pages!',
    });
  } catch (err: any) {
    console.error('Logo upload error:', err);
    res.status(500).json({ error: err.message || 'Failed to upload brand logo' });
  }
});

// Remove Custom Logo (Revert to default brand mark)
router.delete('/settings/logo', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await pool.query(`
      INSERT INTO system_settings (setting_key, setting_value)
      VALUES ('site_logo_url', '')
      ON DUPLICATE KEY UPDATE setting_value = ''
    `);

    await logActivity(req.user!.id, req.user!.name, 'Remove Brand Logo', 'system_settings', null, 'Reverted to default brand SVG logo');

    const io = getIO();
    if (io) {
      io.emit('logo_updated', { logoUrl: '' });
    }

    res.json({
      success: true,
      logoUrl: '',
      message: 'Custom logo removed. Reverted to default brand emblem.',
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to remove custom logo' });
  }
});

// ==========================================
// 13. FILE DOWNLOAD & INLINE ASSET SERVING
// ==========================================

// Inline asset serving for logo images
router.get('/uploads/:filename', (req: Request, res: Response): void => {
  try {
    const filename = path.basename(req.params.filename); // Protect against path traversal
    const filePath = path.join(uploadDir, filename);

    if (!fs.existsSync(filePath)) {
      res.status(404).send('Asset not found');
      return;
    }

    res.sendFile(filePath);
  } catch (err) {
    res.status(500).send('Error retrieving asset');
  }
});

// Secure document / resume download
router.get('/documents/download/:filename', (req: Request, res: Response): void => {
  try {
    const filename = path.basename(req.params.filename); // Protect against path traversal
    const filePath = path.join(uploadDir, filename);

    if (!fs.existsSync(filePath)) {
      res.status(404).send('Document not found');
      return;
    }

    res.download(filePath, filename);
  } catch (err: any) {
    console.error('Download error:', err);
    res.status(500).send('Download error');
  }
});

// ==========================================
// 14. AI CONFIGURATION & OPENROUTER ENDPOINTS
// ==========================================

// Get safe AI settings (API key masked) & behaviour flags
router.get('/admin/ai/settings', requireAuth, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await getSafeAISettings();
    res.json(data);
  } catch (err: any) {
    console.error('Fetch AI settings error:', err);
    res.status(500).json({ error: 'Failed to fetch AI settings' });
  }
});

// Update AI settings & behaviours dynamically
router.put('/admin/ai/settings', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const updated = await updateAISettings(req.body, req.user);
    res.json({ success: true, message: 'AI configuration updated immediately', data: updated });
  } catch (err: any) {
    console.error('Update AI settings error:', err);
    res.status(500).json({ error: 'Failed to update AI settings' });
  }
});

// Test OpenRouter connection
router.post('/admin/ai/test-connection', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { api_key, model_id, api_base_url } = req.body;
    const result = await testOpenRouterConnection(api_key, model_id, api_base_url);
    res.json(result);
  } catch (err: any) {
    console.error('Test OpenRouter error:', err);
    res.status(500).json({ error: err.message || 'Connection test failed' });
  }
});

// Fetch available models from OpenRouter
router.get('/admin/ai/models', requireAuth, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const models = await fetchOpenRouterModels();
    res.json({ models });
  } catch (err: any) {
    console.error('Fetch OpenRouter models error:', err);
    res.status(500).json({ error: 'Failed to fetch OpenRouter models' });
  }
});

// ==========================================
// 15. AI KNOWLEDGE BASE MANAGEMENT
// ==========================================

// List knowledge articles
router.get('/admin/ai/knowledge', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const category = req.query.category as string;
    const search = req.query.search as string;
    const status = req.query.status as string;

    let query = 'SELECT * FROM ai_knowledge_articles WHERE 1=1';
    const params: any[] = [];

    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }
    if (status && status !== 'all') {
      if (status === 'published') query += ' AND published = 1';
      if (status === 'draft') query += ' AND published = 0';
      if (status === 'enabled') query += ' AND enabled = 1';
      if (status === 'disabled') query += ' AND enabled = 0';
    }
    if (search) {
      query += ' AND (title LIKE ? OR content LIKE ? OR category LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    query += ' ORDER BY updated_at DESC';
    const [rows] = await pool.query(query, params) as any;
    res.json({ articles: rows });
  } catch (err) {
    console.error('Fetch knowledge error:', err);
    res.status(500).json({ error: 'Failed to fetch knowledge articles' });
  }
});

// Create knowledge article
router.post('/admin/ai/knowledge', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, category, content, published, enabled } = req.body;
    if (!title || !category || !content) {
      res.status(400).json({ error: 'Title, category, and content are required' });
      return;
    }

    const [result] = await pool.query(
      `INSERT INTO ai_knowledge_articles (title, category, content, published, enabled)
       VALUES (?, ?, ?, ?, ?)`,
      [title, category, content, published !== false, enabled !== false]
    ) as any;

    invalidateKnowledgeCache();
    await logActivity(req.user!.id, req.user!.name, 'Create Knowledge Article', 'ai_knowledge', result.insertId, `Created article: ${title}`);

    res.status(201).json({ success: true, id: result.insertId, message: 'Knowledge article created' });
  } catch (err) {
    console.error('Create knowledge error:', err);
    res.status(500).json({ error: 'Failed to create knowledge article' });
  }
});

// Update knowledge article
router.put('/admin/ai/knowledge/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, category, content, published, enabled } = req.body;

    await pool.query(
      `UPDATE ai_knowledge_articles 
       SET title = COALESCE(?, title),
           category = COALESCE(?, category),
           content = COALESCE(?, content),
           published = COALESCE(?, published),
           enabled = COALESCE(?, enabled),
           updated_at = NOW()
       WHERE id = ?`,
      [title, category, content, published !== undefined ? (published ? 1 : 0) : null, enabled !== undefined ? (enabled ? 1 : 0) : null, id]
    );

    invalidateKnowledgeCache();
    await logActivity(req.user!.id, req.user!.name, 'Update Knowledge Article', 'ai_knowledge', parseInt(id), `Updated article #${id}`);

    res.json({ success: true, message: 'Knowledge article updated' });
  } catch (err) {
    console.error('Update knowledge error:', err);
    res.status(500).json({ error: 'Failed to update knowledge article' });
  }
});

// Delete knowledge article
router.delete('/admin/ai/knowledge/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM ai_knowledge_articles WHERE id = ?', [id]);
    invalidateKnowledgeCache();
    await logActivity(req.user!.id, req.user!.name, 'Delete Knowledge Article', 'ai_knowledge', parseInt(id), `Deleted article #${id}`);
    res.json({ success: true, message: 'Knowledge article deleted' });
  } catch (err) {
    console.error('Delete knowledge error:', err);
    res.status(500).json({ error: 'Failed to delete knowledge article' });
  }
});

// ==========================================
// 16. AI ANALYTICS & USAGE METRICS
// ==========================================

router.get('/admin/ai/analytics', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const range = (req.query.range as string) || '30d';
    let days = 30;
    if (range === '7d') days = 7;
    if (range === '90d') days = 90;
    if (range === 'all') days = 365;

    // Overview Stats
    const [msgCount] = await pool.query(
      'SELECT COUNT(*) as count FROM chat_messages WHERE sender = "ai" AND timestamp >= DATE_SUB(NOW(), INTERVAL ? DAY)',
      [days]
    ) as any;

    const [convCount] = await pool.query(
      'SELECT COUNT(DISTINCT conversationId) as count FROM chat_messages WHERE sender = "ai" AND timestamp >= DATE_SUB(NOW(), INTERVAL ? DAY)',
      [days]
    ) as any;

    const [handoverCount] = await pool.query(
      'SELECT COUNT(*) as count FROM chat_conversations WHERE (handover_requested = 1 OR mode = "human") AND createdAt >= DATE_SUB(NOW(), INTERVAL ? DAY)',
      [days]
    ) as any;

    const [resolvedCount] = await pool.query(
      'SELECT COUNT(*) as count FROM chat_conversations WHERE status = "resolved" AND createdAt >= DATE_SUB(NOW(), INTERVAL ? DAY)',
      [days]
    ) as any;

    const [tokensSum] = await pool.query(
      `SELECT 
         COALESCE(SUM(input_tokens), 0) as input_tokens,
         COALESCE(SUM(output_tokens), 0) as output_tokens,
         COALESCE(SUM(estimated_cost), 0) as estimated_cost,
         COUNT(CASE WHEN response_status = 'failed' THEN 1 END) as failure_count
       FROM ai_usage_logs
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)`,
      [days]
    ) as any;

    // Model breakdown
    const [modelRows] = await pool.query(
      `SELECT model, COUNT(*) as calls, COALESCE(SUM(input_tokens + output_tokens), 0) as tokens 
       FROM ai_usage_logs 
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY model 
       ORDER BY calls DESC`,
      [days]
    ) as any;

    // Daily trends
    const [trendRows] = await pool.query(
      `SELECT 
         DATE(created_at) as date,
         COUNT(*) as requests,
         COALESCE(SUM(input_tokens + output_tokens), 0) as tokens,
         COALESCE(SUM(estimated_cost), 0) as cost
       FROM ai_usage_logs
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY DATE(created_at)
       ORDER BY date ASC`,
      [days]
    ) as any;

    // Recent 15 logs
    const [recentLogs] = await pool.query(
      `SELECT * FROM ai_usage_logs ORDER BY created_at DESC LIMIT 15`
    ) as any;

    const totalInTokens = Number(tokensSum[0]?.input_tokens || 0);
    const totalOutTokens = Number(tokensSum[0]?.output_tokens || 0);

    res.json({
      summary: {
        total_conversations: Number(convCount[0]?.count || 0),
        total_ai_messages: Number(msgCount[0]?.count || 0),
        human_handovers: Number(handoverCount[0]?.count || 0),
        ai_resolved: Number(resolvedCount[0]?.count || 0),
        input_tokens: totalInTokens,
        output_tokens: totalOutTokens,
        total_tokens: totalInTokens + totalOutTokens,
        estimated_cost: Number(tokensSum[0]?.estimated_cost || 0),
        failure_count: Number(tokensSum[0]?.failure_count || 0),
      },
      models: modelRows || [],
      trends: trendRows || [],
      recent_logs: recentLogs || [],
    });
  } catch (err: any) {
    console.error('Fetch AI analytics error:', err);
    res.status(500).json({ error: 'Failed to fetch AI analytics' });
  }
});

// ==========================================
// 17. AGENT PRESENCE & HUMAN HANDOVER ENDPOINTS
// ==========================================

// Get current agent presence summary
router.get('/admin/presence', requireAuth, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const summary = getAgentPresenceSummary();
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get presence summary' });
  }
});

// Agent presence heartbeat
router.post('/admin/presence/heartbeat', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const status = (req.body.status as 'online' | 'busy' | 'offline') || 'online';
    await updateAgentHeartbeat(user.id, user.name, user.role || 'Admin', status);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record heartbeat' });
  }
});

// Agent sets status explicitly
router.post('/admin/presence/status', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const { status } = req.body;
    if (!['online', 'busy', 'offline'].includes(status)) {
      res.status(400).json({ error: 'Status must be online, busy, or offline' });
      return;
    }
    await setAgentStatus(user.id, status);
    const io = getIO();
    if (io) {
      io.to('admins_room').emit('presence_updated', getAgentPresenceSummary());
    }
    res.json({ success: true, status });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update presence status' });
  }
});

// Visitor requests human handover
router.post('/chat/conversations/:id/request-human', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await pool.query(
      `UPDATE chat_conversations 
       SET mode = 'waiting_agent', handover_requested = TRUE, updatedAt = NOW() 
       WHERE id = ?`,
      [id]
    );

    const noticeText = "You have requested to speak with a human clinical coordinator. Our placement team has been alerted and will join this session shortly. You can also reach our 24/7 Clinical Placement Hotline directly at +1 (800) 555-0199.";
    const noticeMsgId = crypto.randomUUID();

    await pool.query(`
      INSERT INTO chat_messages (id, conversationId, sender, senderName, senderRole, content, timestamp, status)
      VALUES (?, ?, 'ai', 'Valora Assistant', 'System Notice', ?, NOW(), 'delivered')
    `, [noticeMsgId, id, noticeText]);

    const io = getIO();
    if (io) {
      io.to(`conversation_${id}`).emit('mode_changed', { mode: 'waiting_agent', handoverRequested: true });
      io.to(`conversation_${id}`).emit('new_message', {
        id: noticeMsgId,
        conversation_id: id,
        conversationId: id,
        sender_type: 'bot',
        sender: 'ai',
        sender_name: 'Valora Assistant',
        senderName: 'Valora Assistant',
        message: noticeText,
        content: noticeText,
        created_at: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        status: 'delivered',
      });
      io.to('admins_room').emit('handover_alert', { conversationId: id, timestamp: new Date().toISOString() });
    }

    res.json({ success: true, message: 'Handover requested' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to request human handover' });
  }
});

// Admin takes over chat
router.post('/chat/conversations/:id/takeover', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const admin = req.user!;

    await pool.query(
      `UPDATE chat_conversations 
       SET mode = 'human', assigned_agent_id = ?, assigned_agent_name = ?, handover_requested = FALSE, updatedAt = NOW() 
       WHERE id = ?`,
      [admin.id, admin.name, id]
    );

    const noticeText = `Clinical Coordinator ${admin.name} has joined the conversation. How can we assist your clinical staffing needs?`;
    const noticeMsgId = crypto.randomUUID();

    await pool.query(`
      INSERT INTO chat_messages (id, conversationId, sender, senderName, senderRole, content, timestamp, status)
      VALUES (?, ?, 'admin', ?, 'Clinical Coordinator', ?, NOW(), 'delivered')
    `, [noticeMsgId, id, admin.name, noticeText]);

    const io = getIO();
    if (io) {
      io.to(`conversation_${id}`).emit('mode_changed', { mode: 'human', agentName: admin.name });
      io.to(`conversation_${id}`).emit('new_message', {
        id: noticeMsgId,
        conversation_id: id,
        conversationId: id,
        sender_type: 'admin',
        sender: 'admin',
        sender_name: admin.name,
        senderName: admin.name,
        message: noticeText,
        content: noticeText,
        created_at: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        status: 'delivered',
      });
    }

    res.json({ success: true, message: 'Conversation takeover successful' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to take over conversation' });
  }
});

// Admin returns chat to AI
router.post('/chat/conversations/:id/return-to-ai', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await pool.query(
      `UPDATE chat_conversations 
       SET mode = 'ai', assigned_agent_id = NULL, assigned_agent_name = NULL, handover_requested = FALSE, updatedAt = NOW() 
       WHERE id = ?`,
      [id]
    );

    const { behaviours } = await getRuntimeAISettings();
    const noticeText = `Conversation returned to ${behaviours.ai_assistant_name}. Feel free to ask any clinical staffing, recruitment, or career questions!`;
    const noticeMsgId = crypto.randomUUID();

    await pool.query(`
      INSERT INTO chat_messages (id, conversationId, sender, senderName, senderRole, content, timestamp, status)
      VALUES (?, ?, 'ai', ?, 'System Dispatch', ?, NOW(), 'delivered')
    `, [noticeMsgId, id, behaviours.ai_assistant_name, noticeText]);

    const io = getIO();
    if (io) {
      io.to(`conversation_${id}`).emit('mode_changed', { mode: 'ai' });
      io.to(`conversation_${id}`).emit('new_message', {
        id: noticeMsgId,
        conversation_id: id,
        conversationId: id,
        sender_type: 'bot',
        sender: 'ai',
        sender_name: behaviours.ai_assistant_name,
        senderName: behaviours.ai_assistant_name,
        message: noticeText,
        content: noticeText,
        created_at: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        status: 'delivered',
      });
    }

    res.json({ success: true, message: 'Returned conversation to AI' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to return conversation to AI' });
  }
});

export default router;

