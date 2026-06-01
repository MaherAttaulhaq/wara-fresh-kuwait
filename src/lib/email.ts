import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendOrderConfirmation(order: {
  orderNumber: string;
  totalAmount: number;
  deliveryInfo: { email?: string; name: string };
}) {
  if (!resend || !order.deliveryInfo.email) return;

  await resend.emails.send({
    from: "WARA Fresh <orders@warafresh.com>",
    to: order.deliveryInfo.email,
    subject: `Order Confirmed - ${order.orderNumber}`,
    html: `
      <h1>Thank you for your order!</h1>
      <p>Hi ${order.deliveryInfo.name},</p>
      <p>Your order <strong>#${order.orderNumber}</strong> has been confirmed.</p>
      <p>Total: ${order.totalAmount} KWD</p>
      <p>We'll deliver your order to your doorstep. You will pay upon delivery.</p>
      <p>Thank you for choosing WARA Fresh!</p>
    `,
  });
}

export async function sendAdminNotification(order: {
  orderNumber: string;
  totalAmount: number;
  deliveryInfo: { name: string; phone?: string; address?: string };
}) {
  if (!resend) return;

  await resend.emails.send({
    from: "WARA Fresh <system@warafresh.com>",
    to: "orders@safatdairy.com",
    subject: `New Order - ${order.orderNumber}`,
    html: `
      <h1>New order received</h1>
      <p>Order #${order.orderNumber}</p>
      <p>Customer: ${order.deliveryInfo.name}</p>
      <p>Phone: ${order.deliveryInfo.phone}</p>
      <p>Address: ${order.deliveryInfo.address}</p>
      <p>Total: ${order.totalAmount} KWD</p>
    `,
  });
}

export async function sendContactNotification(contact: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  if (!resend) return;

  await resend.emails.send({
    from: "WARA Fresh <noreply@warafresh.com>",
    to: "info@safatdairy.com",
    subject: `New Contact: ${contact.subject || "No Subject"}`,
    html: `
      <h1>New contact message</h1>
      <p>From: ${contact.name} (${contact.email})</p>
      <p>Subject: ${contact.subject}</p>
      <p>Message: ${contact.message}</p>
    `,
  });
}
