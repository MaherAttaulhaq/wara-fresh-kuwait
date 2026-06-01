import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart | WARA Fresh",
  description: "View your cart",
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
