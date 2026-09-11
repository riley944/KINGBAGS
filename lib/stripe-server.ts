// Server-side Stripe client. Import only from API routes.
import Stripe from "stripe";

export function stripeClient(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}
