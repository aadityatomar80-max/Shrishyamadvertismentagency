import type { Order, PartnerProfile, User } from "@prisma/client";

// Central place to plug in real email/SMS providers later.
// For now these just log to stdout so you can see when they'd fire.

export async function sendPartnerApplicationEmail(params: {
  partner: PartnerProfile;
  user: User;
}) {
  // TODO: integrate with real email service (e.g. Resend, SendGrid) and SMS gateway.
  console.log("Partner application received:", params);
}

export async function sendOrderConfirmation(params: {
  order: Order;
  client?: User | null;
}) {
  console.log("Order confirmation:", params);
}

export async function sendOrderStatusUpdate(params: {
  order: Order;
  previousStatus: string;
}) {
  console.log("Order status changed:", params);
}

