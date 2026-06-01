import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | WARA Fresh",
  description: "Complete your order",
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
