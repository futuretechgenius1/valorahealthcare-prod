import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'valora_healthcare_jwt_secret_2026_secure';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  } catch (err) {
    return null;
  }
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    return;
  }

  // Verify that user still exists and is active in database
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, status FROM admin_users WHERE id = ?',
      [decoded.id]
    ) as any;

    if (!rows || rows.length === 0 || rows[0].status !== 'active') {
      res.status(403).json({ error: 'Forbidden: User account inactive or removed' });
      return;
    }

    req.user = {
      id: rows[0].id,
      name: rows[0].name,
      email: rows[0].email,
      role: rows[0].role,
    };
    next();
  } catch (err) {
    console.error('Auth verification error:', err);
    res.status(500).json({ error: 'Internal authentication error' });
  }
}

export async function logActivity(
  adminId: number | null,
  adminName: string | null,
  action: string,
  entityType: string,
  entityId: number | null,
  details: string | null = null
) {
  try {
    await pool.query(
      `INSERT INTO activity_logs (admin_id, admin_name, action, entity_type, entity_id, details)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [adminId, adminName || 'System', action, entityType, entityId, details]
    );
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
}

export async function createNotification(
  title: string,
  message: string,
  type: string = 'info',
  link: string | null = null
) {
  try {
    await pool.query(
      `INSERT INTO notifications (title, message, type, link)
       VALUES (?, ?, ?, ?)`,
      [title, message, type, link]
    );
  } catch (err) {
    console.error('Failed to create notification:', err);
  }
}
