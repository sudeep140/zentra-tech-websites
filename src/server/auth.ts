import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { supabase, isSupabaseConfigured } from './supabase.js';

const JWT_SECRET = process.env.JWT_SECRET || 'zentra-agency-master-secret-2025-secure-key';
const OWNER_EMAIL = process.env.ADMIN_EMAIL || 'tharusudeep242@gmail.com';
const OWNER_PASSWORD = process.env.ADMIN_DEFAULT_PASSWORD || 'ZentraAdmin2025!';

// Active in-memory session tokens
const activeSessions = new Map<string, { email: string; expiresAt: number }>();

function generateToken(email: string): string {
  const payload = {
    email,
    timestamp: Date.now(),
    nonce: crypto.randomBytes(16).toString('hex'),
  };
  const str = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(str).digest('base64url');
  const token = `${str}.${signature}`;

  // Store 24-hour session
  activeSessions.set(token, {
    email,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  });

  return token;
}

export function verifySessionToken(token: string): { valid: boolean; email?: string } {
  if (!token) return { valid: false };

  const parts = token.split('.');
  if (parts.length !== 2) return { valid: false };

  const [payloadStr, signature] = parts;
  const expectedSignature = crypto.createHmac('sha256', JWT_SECRET).update(payloadStr).digest('base64url');

  if (signature !== expectedSignature) {
    return { valid: false };
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf-8'));
    // Check expiration (24h)
    if (Date.now() - payload.timestamp > 24 * 60 * 60 * 1000) {
      activeSessions.delete(token);
      return { valid: false };
    }
    return { valid: true, email: payload.email };
  } catch {
    return { valid: false };
  }
}

export async function loginOwner(email: string, password: string): Promise<{ success: boolean; token?: string; error?: string; user?: { email: string; role: string } }> {
  const cleanEmail = email.trim().toLowerCase();

  // Try Supabase Auth first if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (!error && data.session) {
        const token = generateToken(cleanEmail);
        return {
          success: true,
          token,
          user: { email: cleanEmail, role: 'owner' },
        };
      }
      console.warn('[Supabase Auth] Fallback to local admin verification:', error?.message);
    } catch (e) {
      console.warn('[Supabase Auth] Exception during sign in:', e);
    }
  }

  // Fallback / Standard Owner Auth verification
  if (cleanEmail === OWNER_EMAIL.toLowerCase() && password === OWNER_PASSWORD) {
    const token = generateToken(cleanEmail);
    return {
      success: true,
      token,
      user: { email: cleanEmail, role: 'owner' },
    };
  }

  return {
    success: false,
    error: 'Invalid owner credentials. Please verify your email and password.',
  };
}

export function requireOwnerAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Owner authentication required.' });
  }

  const token = authHeader.substring(7);
  const result = verifySessionToken(token);

  if (!result.valid) {
    return res.status(401).json({ error: 'Session expired or invalid token. Please log in again.' });
  }

  (req as Request & { ownerEmail?: string }).ownerEmail = result.email;
  next();
}
