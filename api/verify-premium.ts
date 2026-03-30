import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

interface PremiumPayload {
  isPremium: boolean;
  tier: 'weekly' | 'lifetime';
  sessionId: string;
  exp?: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.query.token as string | undefined;

  if (!token) {
    return res.status(400).json({ error: 'Missing token query parameter' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as PremiumPayload;

    return res.status(200).json({
      isPremium: payload.isPremium,
      tier: payload.tier,
      expiresAt: payload.exp ? payload.exp * 1000 : null,
    });
  } catch {
    return res.status(401).json({ isPremium: false, tier: 'free', expiresAt: null });
  }
}
