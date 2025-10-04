"use client";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Globe, Mail, Phone, MapPin } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

const Footer = () => {
  const t = useTranslations();
  const pathName = usePathname();
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const switchLocale = () => {
    const newLocale = locale === 'ru' ? 'tj' : 'ru';
    startTransition(() => {
      router.push(pathName, { locale: newLocale });
    });
  }

  return (
    <footer className="mt-auto bg-gray-50/50 border-t border-gray-200">
      <div className="w-[85%] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <a href="/" className="text-blue-400 font-semibold text-2xl tracking-tight mb-6 block">DarDast</a>
            <p className="mb-6 text-gray-600 text-[15px] leading-relaxed max-w-md">
              {t('footer.description') || "Ваш надежный партнер в сфере услуг и решений"}
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 text-[15px]">+992 000 00 7808</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 text-[15px]">majidzzoda@mail.ru</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 text-[15px]">{t('footer.address') || "Душанбе, Таджикистан"}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-6">{t('footer.quickLinks') || "Быстрые ссылки"}</h3>
            <ul className="space-y-4">
              <li>
                <a href="/about" className="text-gray-600 hover:text-gray-900 text-[15px] transition-colors duration-200">
                  {t('footer.about') || "О нас"}
                </a>
              </li>
              <li>
                <button
                  onClick={switchLocale}
                  disabled={isPending}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white border border-gray-200 
                           text-gray-700 hover:bg-gray-50 transition-all duration-200
                           focus:outline-none focus:ring-1 focus:ring-gray-300"
                >
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="text-[15px] font-medium">
                    {locale === "ru" ? "Тоҷикӣ" : "Русский"}
                  </span>
                  {isPending && (
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  )}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-12 pt-8">
          <p className="text-blue-400 text-[14px] text-center">
            © {new Date().getFullYear()} DarDast. {t('footer.rights') || "Все права защищены."}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;