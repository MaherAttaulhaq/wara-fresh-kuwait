"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";

const springStagger = (i: number) => ({
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { type: "spring" as const, stiffness: 100, damping: 20, mass: 0.8, delay: i * 0.12 },
});

export function HomeHero({ locale }: { locale: string }) {
  const t = useTranslations("home");
  return (
    <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-cream to-background pointer-events-none" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] opacity-40">
          <Image
            src="/images/blobs/blob-1.svg"
            alt=""
            width={500}
            height={500}
            className="w-full h-full animate-float"
          />
        </div>
        <div className="absolute -bottom-32 -left-32 w-[450px] h-[450px] opacity-30">
          <Image
            src="/images/blobs/blob-2.svg"
            alt=""
            width={450}
            height={450}
            className="w-full h-full animate-float-slow"
          />
        </div>
        <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] opacity-25">
          <Image
            src="/images/blobs/blob-3.svg"
            alt=""
            width={300}
            height={300}
            className="w-full h-full animate-float-fast"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-3">
            <motion.div {...springStagger(0)}>
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                {locale === "ar" ? "منتجات ألبان كويتية" : "Kuwaiti Dairy Products"}
              </span>
            </motion.div>

            <motion.h1
              {...springStagger(1)}
              className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-[1.05] tracking-tight mb-6"
            >
              {t("heroTitle")}
            </motion.h1>

            <motion.p
              {...springStagger(2)}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl leading-relaxed"
            >
              {t("heroSubtitle")}
            </motion.p>

            <motion.div
              {...springStagger(3)}
              className="flex flex-wrap items-center gap-4"
            >
              <Link href="/products">
                <Button size="lg" className="gap-2 shadow-md hover:shadow-lg hover:shadow-primary/25 transition-shadow">
                  <ShoppingBag className="h-4 w-4" />
                  {t("shopNow")}
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="gap-2">
                  {t("learnMore")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.3 }}
            className="lg:col-span-2 relative hidden lg:block"
          >
            <div className="relative aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-[3rem] rotate-6" />
              <div className="absolute inset-0 bg-gradient-to-tl from-secondary/5 to-primary/5 rounded-[3rem] -rotate-3 scale-95" />
              <div className="relative z-10 flex items-center justify-center h-full">
                <Image
                  src="/images/products/milk.svg"
                  alt="Fresh Milk"
                  width={400}
                  height={400}
                  className="object-contain w-3/4 h-3/4 drop-shadow-xl animate-wobble"
                  unoptimized
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
