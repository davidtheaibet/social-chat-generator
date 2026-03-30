import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const PRICE_IDS: Record<string, string> = {
  weekly: process.env.STRIPE_WEEKLY_PRICE_ID!,
  lifetime: process.env.STRIPE_LIFETIME_PRICE_ID!,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { priceId } = req.body as { priceId: 'weekly' | 'lifetime' };

  if (!priceId || !PRICE_IDS[priceId]) {
    return res.status(400).json({ error: 'Invalid priceId. Must be "weekly" or "lifetime".' });
  }

  const appUrl = process.env.VITE_APP_URL || 'http://localhost:5173';

  try {
    const session = await stripe.checkout.sessions.create({
      mode: priceId === 'weekly' ? 'subscription' : 'payment',
      line_items: [{ price: PRICE_IDS[priceId], quantity: 1 }],
      success_url: `${appUrl}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/?payment=cancelled`,
      metadata: { tier: priceId },
    });

    return res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
}
