"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, Clock, ArrowRight } from "lucide-react";

interface CareerItem {
  _id: string;
  title: string;
  slug: string;
  department?: string;
  type: string;
  location?: string;
  description: string;
}

export function CareersClient({ careers }: { careers: CareerItem[] }) {
  const t = useTranslations("careers");

  if (careers.length === 0) {
    return (
      <div className="text-center py-20">
        <Briefcase className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
        <p className="text-lg text-muted-foreground">{t("noJobs")}</p>
      </div>
    );
  }

  const typeLabel = (type: string) => {
    const map: Record<string, string> = {
      full_time: "Full Time",
      part_time: "Part Time",
      contract: "Contract",
    };
    return map[type] || type;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {careers.map((c, i) => (
        <motion.div
          key={c._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
        >
          <Card>
            <CardContent className="pt-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="font-heading text-lg font-semibold text-foreground">{c.title}</h3>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    {c.department && (
                      <Badge variant="secondary">{c.department}</Badge>
                    )}
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5" /> {typeLabel(c.type)}
                    </span>
                    {c.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {c.location}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{c.description}</p>
                </div>
                <Link href={`/careers/${c.slug}`}>
                  <Button size="sm" className="gap-1 shrink-0">
                    {t("applyNow")} <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
