"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, User, Sun, Moon, LogOut, Package, LayoutDashboard } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/cart-context";
import { Logo } from "@/components/layout/Logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";


const navLinks = [
  { href: "/", labelEn: "Home", labelAr: "الرئيسية" },
  { href: "/products", labelEn: "Products", labelAr: "المنتجات" },
  { href: "/about", labelEn: "About Us", labelAr: "من نحن" },
  { href: "/recipes", labelEn: "Recipes", labelAr: "وصفات" },
  { href: "/careers", labelEn: "Careers", labelAr: "الوظائف" },
  { href: "/services", labelEn: "Services", labelAr: "خدماتنا" },
  { href: "/contact", labelEn: "Contact", labelAr: "اتصل بنا" },
];

const springDropdown = {
  initial: { opacity: 0, y: -12, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -12, scale: 0.95 },
  transition: { type: "spring" as const, stiffness: 200, damping: 20, mass: 0.7 },
};

const springNavItem = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.97 },
  transition: { type: "spring" as const, stiffness: 300, damping: 15 },
};

export function Navbar({ locale = "en", user }: { locale?: string; user?: { name?: string | null; email?: string | null; id?: string } | null }) {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { totalItems } = useCart();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Logo />

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <motion.div key={link.href} {...springNavItem}>
              <Link
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {locale === "ar" ? link.labelAr : link.labelEn}
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-7 w-7 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-7 w-7 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-7 w-7" />
                {totalItems > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <Badge className="absolute -right-2 -top-2 h-5 w-5 p-0 flex items-center justify-center text-[11px]">
                      {totalItems}
                    </Badge>
                  </motion.div>
                )}
              </Button>
            </Link>
          </motion.div>

          <div className="relative" ref={dropdownRef}>
            {user ? (
              <>
                <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">{initials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </motion.div>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      {...springDropdown}
                      className="absolute right-0 mt-2 w-52 rounded-xl border bg-background p-1.5 shadow-lg z-50"
                    >
                      <div className="px-3 py-2 border-b border-border mb-1">
                        <p className="text-sm font-medium text-foreground truncate">{user.name || "User"}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email || ""}</p>
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4" /> Dashboard
                      </Link>
                      <Link
                        href="/account/orders"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <Package className="h-4 w-4" /> Orders
                      </Link>
                      <Link
                        href="/account/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <User className="h-4 w-4" /> Profile
                      </Link>
                      <Link
                        href="/api/auth/signout"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors border-t border-border mt-1 pt-2"
                      >
                        <LogOut className="h-4 w-4" /> Logout
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
                <Link href="/account/login">
                  <Button variant="ghost" size="icon">
                    <User className="h-7 w-7" />
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>

          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-7 w-7" />
            </Button>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="fixed inset-0 z-50 bg-background md:hidden"
          >
            <div className="flex h-20 items-center justify-between px-4 border-b">
              <Logo />
              <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                  <X className="h-7 w-7" />
                </Button>
              </motion.div>
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
