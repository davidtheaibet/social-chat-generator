import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import jwt from 'jsonwebtoken';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stripeKey = process.env.stripesecretkey || process.env.STRIPE_SECRET_KEY;
  const jwtSecret = process.env.jwtsecret || process.env.JWT_SECRET;

  if (!stripeKey || !jwtSecret) {
    return res.status(503).json({ error: 'Server not configured — set STRIPE_SECRET_KEY and JWT_SECRET in Vercel env vars' });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: '2024-12-18.acacia' });

  const sessionId = req.query.session_id as string | undefined;

  if (!sessionId) {
    return res.status(400).json({ error: 'Missing session_id query parameter' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(402).json({ error: 'Payment not completed' });
    }

    const tier = (session.metadata?.tier ?? 'lifetime') as 'weekly' | 'lifetime';
    const expiresIn = tier === 'weekly' ? '7d' : undefined;

    const token = jwt.sign(
      { isPremium: true, tier, sessionId: session.id },
      jwtSecret,
      expiresIn ? { expiresIn } : {}
    );

    return res.status(200).json({ premium_token: token, tier });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
}
