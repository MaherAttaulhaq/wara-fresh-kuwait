"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, User, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/cart-context";
import { Logo } from "@/components/layout/Logo";


const navLinks = [
  { href: "/", labelEn: "Home", labelAr: "الرئيسية" },
  { href: "/products", labelEn: "Products", labelAr: "المنتجات" },
  { href: "/about", labelEn: "About Us", labelAr: "من نحن" },
  { href: "/recipes", labelEn: "Recipes", labelAr: "وصفات" },
  { href: "/careers", labelEn: "Careers", labelAr: "الوظائف" },
  { href: "/services", labelEn: "Services", labelAr: "خدماتنا" },
  { href: "/contact", labelEn: "Contact", labelAr: "اتصل بنا" },
];

export function Navbar({ locale = "en" }: { locale?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo />

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {locale === "ar" ? link.labelAr : link.labelEn}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-6 w-6 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-6 w-6 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
          </Button>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <Badge className="absolute -right-1.5 -top-1.5 h-5 w-5 p-0 flex items-center justify-center text-[11px]">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>

          <Link href="/account">
            <Button variant="ghost" size="icon">
              <User className="h-6 w-6" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 z-50 bg-background md:hidden"
          >
            <div className="flex h-16 items-center justify-between px-4 border-b">
              <Logo />
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="flex flex-col p-4 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium py-2 border-b border-border"
                >
                  {locale === "ar" ? link.labelAr : link.labelEn}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
