// Customer-facing order lifecycle. The five visible stages map from the
// seven database statuses — needs_changes stays inside "Art Review" but
// flags the order as waiting on the customer.

export type OrderStatus =
  | "submitted"
  | "art_review"
  | "needs_changes"
  | "art_approved"
  | "awaiting_payment"
  | "in_production"
  | "shipped";

export const STAGES = [
  "Art Review",
  "Art Approved",
  "Payment",
  "In Production",
  "Shipped",
] as const;

export function stageIndex(status: OrderStatus): number {
  switch (status) {
    case "submitted":
    case "art_review":
    case "needs_changes":
      return 0;
    case "art_approved":
      return 1;
    case "awaiting_payment":
      return 2;
    case "in_production":
      return 3;
    case "shipped":
      return 4;
  }
}

export function needsAttention(status: OrderStatus): boolean {
  return status === "needs_changes";
}

// One customer-facing sentence per status — what's happening and whose move it is.
export function statusBlurb(status: OrderStatus): string {
  switch (status) {
    case "submitted":
      return "Order received. Your artwork is heading into review — we'll email you when your proof is ready.";
    case "art_review":
      return "Our team is checking your artwork against the production template and building your proof.";
    case "needs_changes":
      return "Your artwork needs a change before it can print. Check your email for the details from our team.";
    case "art_approved":
      return "Proof approved. We're preparing your order for payment and production.";
    case "awaiting_payment":
      return "Waiting on payment. Once it clears, your order goes straight to the factory.";
    case "in_production":
      return "Your bags are being cut and sewn. We'll send tracking the moment they ship.";
    case "shipped":
      return "Your bags are on the way. Tracking details are in your email.";
  }
}

export function statusLabel(status: OrderStatus): string {
  switch (status) {
    case "submitted":
      return "Order received";
    case "art_review":
      return "In art review";
    case "needs_changes":
      return "Needs your changes";
    case "art_approved":
      return "Art approved";
    case "awaiting_payment":
      return "Awaiting payment";
    case "in_production":
      return "In production";
    case "shipped":
      return "Shipped";
  }
}
