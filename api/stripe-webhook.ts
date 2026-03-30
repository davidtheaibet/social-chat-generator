import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import jwt from 'jsonwebtoken';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export const config = { api: { bodyParser: false } };

async function getRawBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'] as string;
  const rawBody = await getRawBody(req);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(400).json({ error: `Webhook signature verification failed: ${message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const tier = (session.metadata?.tier ?? 'lifetime') as 'weekly' | 'lifetime';
    const expiresIn = tier === 'weekly' ? '7d' : undefined;

    const token = jwt.sign(
      { isPremium: true, tier, sessionId: session.id },
      process.env.JWT_SECRET!,
      expiresIn ? { expiresIn } : {}
    );

    // In a production app you would store this token against a user ID.
    // For this architecture we return it in the response so the frontend
    // can store it in localStorage and pass it to /api/verify-premium.
    console.log(`Premium activated: tier=${tier}, session=${session.id}, token=${token}`);
  }

  return res.status(200).json({ received: true });
}
