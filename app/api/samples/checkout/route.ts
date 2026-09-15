import { NextResponse } from "next/server";
import { stripeClient } from "@/lib/stripe-server";

export const dynamic = "force-dynamic";

// Hosted Stripe Checkout for sample kits that don't have a Payment Link.
// GET so the samples page can link straight to it; Stripe hosts the form,
// we just redirect there and back.
const KITS: Record<string, { name: string; description: string; amount: number }> = {
  "exact-sample": {
    name: "The Exact Sample",
    description:
      "One pre-production sample of your actual bag, cut and sewn with your artwork at the factory that runs your order. Includes the Quality Kit. Fully credited toward your order.",
    amount: 30000, // cents
  },
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const kitId = url.searchParams.get("kit") ?? "";
  const kit = KITS[kitId];
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? url.origin;

  if (!kit) return NextResponse.redirect(`${site}/samples`, 303);

  const stripe = stripeClient();
  if (!stripe) {
    return NextResponse.redirect(
      `${site}/samples?error=${encodeURIComponent("Checkout is not available right now. Email hello@kingbags.co and we'll send a payment link.")}`,
      303,
    );
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: kit.amount,
            product_data: { name: kit.name, description: kit.description },
          },
        },
      ],
      custom_fields: [
        {
          key: "bag",
          label: { type: "custom", custom: "Bag and size" },
          type: "dropdown",
          dropdown: {
            options: [
              { label: "Grocery Tote · Small", value: "groceryS" },
              { label: "Grocery Tote · Medium", value: "groceryM" },
              { label: "Grocery Tote · Large", value: "groceryL" },
              { label: "Grocery Tote · X-Large", value: "groceryXL" },
              { label: "Canvas Tote · Small", value: "canvasS" },
              { label: "Canvas Tote · Medium", value: "canvasM" },
              { label: "Canvas Tote · Large", value: "canvasL" },
              { label: "Not sure yet", value: "tbd" },
            ],
          },
        },
        {
          key: "quantity",
          label: { type: "custom", custom: "Bags you plan to order" },
          type: "text",
          optional: true,
        },
      ],
      shipping_address_collection: { allowed_countries: ["US", "CA"] },
      phone_number_collection: { enabled: true },
      metadata: { kit: kitId },
      payment_intent_data: {
        description: `KINGBAGS ${kit.name}`,
        metadata: { kit: kitId },
      },
      success_url: `${site}/samples?paid=1`,
      cancel_url: `${site}/samples`,
    });
    return NextResponse.redirect(session.url ?? `${site}/samples`, 303);
  } catch (e) {
    console.error("sample checkout", e);
    return NextResponse.redirect(
      `${site}/samples?error=${encodeURIComponent("Checkout couldn't start. Email hello@kingbags.co and we'll send a payment link.")}`,
      303,
    );
  }
}
