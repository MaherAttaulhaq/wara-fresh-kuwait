import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { socialLinks } from "@/components/layout/SocialIcons";

export function Footer({ locale = "en" }: { locale?: string }) {
  const isAr = locale === "ar";

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <Logo className="mb-4" />
            <p className="text-sm opacity-80 max-w-xs">
              {isAr
                ? "منتجات ألبان كويتية طازجة منذ 1976. من مزرعتنا إلى منزلك."
                : "Fresh Kuwaiti dairy products since 1976. From our farm to your home."}
            </p>
            <div className="flex gap-3 mt-4">
              {socialLinks.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">
              {isAr ? "روابط سريعة" : "Quick Links"}
            </h4>
            <ul className="space-y-2 text-sm opacity-80">
              {[
                { href: "/about", en: "About Us", ar: "من نحن" },
                { href: "/products", en: "Products", ar: "المنتجات" },
                { href: "/recipes", en: "Recipes", ar: "وصفات" },
                { href: "/careers", en: "Careers", ar: "الوظائف" },
                { href: "/contact", en: "Contact", ar: "اتصل بنا" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:underline underline-offset-2"
                  >
                    {isAr ? link.ar : link.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">
              {isAr ? "خدمة العملاء" : "Customer Service"}
            </h4>
            <ul className="space-y-2 text-sm opacity-80">
              {[
                { href: "/cart", en: "Cart", ar: "سلة التسوق" },
                { href: "/account", en: "My Account", ar: "حسابي" },
                { href: "/services", en: "Delivery Info", ar: "معلومات التوصيل" },
                { href: "/contact", en: "FAQ", ar: "الأسئلة الشائعة" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:underline underline-offset-2"
                  >
                    {isAr ? link.ar : link.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">
              {isAr ? "اتصل بنا" : "Contact Us"}
            </h4>
            <ul className="space-y-3 text-sm opacity-80">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Shuwaikh Industrial Area, Kuwait</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 shrink-0" />
                <span>+965 182 22 22</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 shrink-0" />
                <span>info@safatdairy.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-xs opacity-60">
          <p>
            &copy; {new Date().getFullYear()} Al Safat Fresh Dairy Co. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
