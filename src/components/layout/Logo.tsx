"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Logo({ className = "", showText = true }: { className?: string; showText?: boolean }) {
  return (
    <Link href="/" className={`flex items-center gap-3 ${className}`}>
      <motion.svg
        width="48"
        height="48"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        whileHover={{ scale: 1.08, rotate: -3 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 12 }}
      >
        <circle cx="18" cy="18" r="17" className="fill-primary" />
        <path
          d="M18 8c-4 0-7 3.5-7 8 0 3 1.5 5.5 3.5 7 .5.4 1 .8 1.5 1.2.5.4 1.2.8 2 1.2.8.3 1.5.6 2 .6s1.2-.3 2-.6c.8-.4 1.5-.8 2-1.2.5-.4 1-.8 1.5-1.2 2-1.5 3.5-4 3.5-7 0-4.5-3-8-7-8z"
          className="fill-primary-foreground"
        />
        <path
          d="M14 16h8M18 12v8"
          strokeWidth="2"
          className="stroke-primary"
        />
        <path
          d="M11 24c1 2 3.5 4 7 4s6-2 7-4"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="stroke-primary-foreground/70"
        />
      </motion.svg>
      {showText && (
        <span className="font-heading text-3xl font-bold tracking-tight text-foreground">
          WARA <span className="text-primary">Fresh</span>
        </span>
      )}
    </Link>
  );
}
