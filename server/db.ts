import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const dbHost = process.env.DB_HOST || 'srv1786.hstgr.io';
const dbUser = process.env.DB_USER || 'u106825176_valora';
const dbPassword = process.env.DB_PASSWORD || 'U3o+Nf/f';
const dbName = process.env.DB_NAME || 'u106825176_valora';
const dbPort = parseInt(process.env.DB_PORT || '3306', 10);

export const pool = mysql.createPool({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  port: dbPort,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 20000,
  timezone: '+00:00',
  multipleStatements: true,
});

export async function initDatabase() {
  console.log(`[Database] Connecting to MySQL database ${dbName} at ${dbHost}...`);
  try {
    const connection = await pool.getConnection();
    console.log('[Database] Connected successfully!');

    // Initialize Schema Tables
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admin_roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description VARCHAR(255) NULL,
        permissions JSON NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(191) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'Super Admin',
        phone VARCHAR(50) NULL,
        status ENUM('active', 'inactive') DEFAULT 'active',
        last_login_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS employers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        organization_name VARCHAR(255) NOT NULL,
        contact_name VARCHAR(150) NOT NULL,
        email VARCHAR(191) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        facility_type VARCHAR(100) NULL,
        location VARCHAR(255) NULL,
        status ENUM('lead', 'active', 'inactive') DEFAULT 'lead',
        notes TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS candidates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(191) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        profession VARCHAR(100) NOT NULL,
        specialty VARCHAR(150) NULL,
        experience_years VARCHAR(50) NULL,
        license_state VARCHAR(100) NULL,
        preferred_location VARCHAR(255) NULL,
        availability VARCHAR(100) NULL,
        resume_url VARCHAR(500) NULL,
        resume_filename VARCHAR(255) NULL,
        status ENUM('new', 'screening', 'interviewing', 'placed', 'archived') DEFAULT 'new',
        notes TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS enquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(191) NOT NULL,
        phone VARCHAR(50) NULL,
        subject VARCHAR(255) NULL,
        inquiry_type VARCHAR(100) NULL,
        message TEXT NOT NULL,
        status ENUM('new', 'in_progress', 'resolved', 'closed') DEFAULT 'new',
        assigned_to INT NULL,
        admin_notes TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS staffing_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        organization_name VARCHAR(255) NOT NULL,
        contact_name VARCHAR(150) NOT NULL,
        email VARCHAR(191) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        facility_type VARCHAR(100) NULL,
        staffing_type VARCHAR(100) NULL,
        roles_needed VARCHAR(255) NULL,
        number_of_positions INT DEFAULT 1,
        urgency VARCHAR(50) DEFAULT 'Normal',
        start_date VARCHAR(100) NULL,
        shift_preference VARCHAR(100) NULL,
        location VARCHAR(255) NULL,
        details TEXT NULL,
        status ENUM('new', 'reviewing', 'sourcing', 'fulfilled', 'cancelled') DEFAULT 'new',
        priority ENUM('normal', 'high', 'urgent') DEFAULT 'normal',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        department VARCHAR(100) NOT NULL,
        job_type VARCHAR(100) NOT NULL,
        location VARCHAR(255) NOT NULL,
        pay_range VARCHAR(100) NULL,
        description TEXT NOT NULL,
        requirements TEXT NULL,
        benefits TEXT NULL,
        status ENUM('draft', 'published', 'closed') DEFAULT 'published',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        job_id INT NULL,
        candidate_id INT NULL,
        applicant_name VARCHAR(150) NOT NULL,
        applicant_email VARCHAR(191) NOT NULL,
        applicant_phone VARCHAR(50) NOT NULL,
        profession VARCHAR(100) NULL,
        experience VARCHAR(100) NULL,
        resume_url VARCHAR(500) NULL,
        resume_filename VARCHAR(255) NULL,
        cover_note TEXT NULL,
        status ENUM('applied', 'screening', 'interview', 'offer', 'hired', 'rejected') DEFAULT 'applied',
        admin_notes TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS chat_conversations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id VARCHAR(100) NOT NULL UNIQUE,
        visitor_name VARCHAR(150) DEFAULT 'Visitor',
        visitor_email VARCHAR(191) NULL,
        visitor_phone VARCHAR(50) NULL,
        topic VARCHAR(150) NULL DEFAULT 'General Inquiry',
        visitor_type VARCHAR(100) NULL DEFAULT 'Visitor',
        status ENUM('open', 'assigned', 'closed') DEFAULT 'open',
        assigned_to INT NULL,
        last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    try {
      await connection.query(`ALTER TABLE chat_conversations ADD COLUMN topic VARCHAR(150) NULL DEFAULT 'General Inquiry'`);
    } catch (e) {
      // Column already exists
    }
    try {
      await connection.query(`ALTER TABLE chat_conversations ADD COLUMN visitor_type VARCHAR(100) NULL DEFAULT 'Visitor'`);
    } catch (e) {
      // Column already exists
    }

    await connection.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        conversation_id INT NOT NULL,
        sender_type ENUM('visitor', 'admin', 'bot') NOT NULL,
        sender_name VARCHAR(150) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'info',
        link VARCHAR(255) NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        admin_id INT NULL,
        admin_name VARCHAR(150) NULL,
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(100) NOT NULL,
        entity_id INT NULL,
        details TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS system_settings (
        setting_key VARCHAR(100) PRIMARY KEY,
        setting_value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Seed default roles if empty
    const [roles] = await connection.query('SELECT COUNT(*) as count FROM admin_roles') as any;
    if (roles[0].count === 0) {
      await connection.query(`
        INSERT INTO admin_roles (name, description, permissions) VALUES
        ('Super Admin', 'Full unrestricted administrative access across the platform', '["all"]'),
        ('Recruiter', 'Manages candidates, job openings, and applications', '["candidates", "jobs", "applications", "chat"]'),
        ('Client Manager', 'Manages healthcare facilities, staffing requests, and enquiries', '["employers", "staffing_requests", "enquiries"]'),
        ('Support Agent', 'Live chat agent and enquiries responder', '["enquiries", "chat"]')
      `);
      console.log('[Database] Seeded default admin roles.');
    }

    // Seed default Super Admin user if not exists
    const [users] = await connection.query('SELECT COUNT(*) as count FROM admin_users WHERE email = ?', ['admin@valorahealthcare.com']) as any;
    if (users[0].count === 0) {
      const defaultPassword = 'ValoraAdmin2026!';
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(defaultPassword, salt);
      await connection.query(`
        INSERT INTO admin_users (name, email, password_hash, role, phone, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `, ['Valora Super Admin', 'admin@valorahealthcare.com', hash, 'Super Admin', '+1 (800) 555-0199', 'active']);
      console.log('[Database] Created default Super Admin user (admin@valorahealthcare.com / ValoraAdmin2026!)');
    }

    // Seed default jobs if empty so careers page & jobs module have real initial postings
    const [jobRows] = await connection.query('SELECT COUNT(*) as count FROM jobs') as any;
    if (jobRows[0].count === 0) {
      await connection.query(`
        INSERT INTO jobs (title, department, job_type, location, pay_range, description, requirements, benefits, status) VALUES
        ('Critical Care Registered Nurse (ICU)', 'Nursing', 'Travel / Contract', 'Austin, TX', '$2,400 - $3,100 / week',
         'Valora Healthcare is seeking experienced Intensive Care Unit (ICU) Registered Nurses for premium 13-week acute care contracts. Join our dedicated clinical workforce offering full support and responsive placement.',
         'Active RN license in good standing; 2+ years ICU/Critical Care experience; BLS, ACLS certifications required.',
         'Comprehensive medical/dental/vision coverage, weekly direct deposit, premium housing stipend, 24/7 clinical advocate support.',
         'published'),
        ('Emergency Department Staff RN', 'Nursing', 'Per Diem / Full-Time', 'Dallas, TX', '$48 - $62 / hour',
         'Join top-rated emergency departments providing compassionate, prompt patient care. Flexible shift scheduling with day and night rotations available.',
         'Current RN licensure; Minimum 1.5 years emergency medicine experience; TNCC or PALS preferred.',
         'Flexible scheduling, overtime differentials, 401(k) matching, ongoing CEU reimbursement.',
         'published'),
        ('Licensed Physical Therapist (PT)', 'Allied Health', 'Permanent Placement', 'San Antonio, TX', '$92,000 - $115,000 / year',
         'Direct-hire opportunity with a premier regional rehabilitation hospital. Lead patient recovery programs with multidisciplinary clinical collaboration.',
         'Master’s or Doctorate in Physical Therapy; State PT license or eligibility; 1+ year outpatient or acute rehab experience.',
         'Relocation assistance, generous PTO package, performance bonuses, health and wellness stipends.',
         'published'),
        ('Medical Laboratory Scientist (MLS)', 'Allied Health', 'Travel / Contract', 'Houston, TX', '$2,100 - $2,700 / week',
         'Fast-paced clinical laboratory setting conducting high-complexity hematology, chemistry, and blood bank testing.',
         'ASCP certification (MLS/MT); Bachelor’s degree in Medical Technology or related field; 1+ year hospital laboratory experience.',
         'Guaranteed hours, furnished private housing, license reimbursement, referral bonuses.',
         'published'),
        ('Director of Surgical Services', 'Healthcare Leadership', 'Permanent Placement', 'Phoenix, AZ', '$135,000 - $160,000 / year',
         'Executive leadership opportunity overseeing operating room suites, endoscopy, and sterile processing across a 320-bed hospital network.',
         'BSN required, MSN/MHA strongly preferred; CNOR certification; 5+ years surgical leadership experience.',
         'Executive compensation package, executive health benefits, full relocation package, retirement pension plan.',
         'published')
      `);
      console.log('[Database] Seeded initial healthcare job postings.');
    }

    // Seed default system settings
    await connection.query(`
      INSERT IGNORE INTO system_settings (setting_key, setting_value) VALUES
      ('site_name', 'Valora Healthcare'),
      ('contact_email', 'admin@valorahealthcare.com'),
      ('phone_number', '+1 (800) 555-0199'),
      ('support_hours', '24/7 Clinical & Staffing Support'),
      ('auto_chat_greeting', 'Welcome to Valora Healthcare! How can our staffing and recruitment team help you today?'),
      ('enable_chat', 'true')
    `);

    connection.release();
    console.log('[Database] Initialization completed successfully!');
  } catch (err) {
    console.error('[Database] Initialization error:', err);
  }
}
