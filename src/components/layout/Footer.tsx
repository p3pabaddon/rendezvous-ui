import { Link } from "react-router-dom";
import { t } from "@/lib/translations";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground font-heading text-lg">R</span>
              </div>
              <span className="font-heading text-xl">
                Randevu<span className="text-accent">Dunyasi</span>
              </span>
            </Link>
            <p className="text-sm opacity-70 max-w-xs leading-relaxed">
              {t("footer.desc")}
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold text-sm mb-4">{t("footer.platform")}</h4>
            <ul className="space-y-2.5 text-sm opacity-70">
              <li><Link to="/isletmeler" className="hover:opacity-100 transition-opacity">{t("nav.businesses")}</Link></li>
              <li><Link to="/hakkimizda" className="hover:opacity-100 transition-opacity">{t("nav.about")}</Link></li>
              <li><Link to="/iletisim" className="hover:opacity-100 transition-opacity">{t("nav.contact")}</Link></li>
              <li><Link to="/sss" className="hover:opacity-100 transition-opacity">{t("nav.faq")}</Link></li>
            </ul>
          </div>

          {/* For Businesses */}
          <div>
            <h4 className="font-semibold text-sm mb-4">{t("footer.business")}</h4>
            <ul className="space-y-2.5 text-sm opacity-70">
              <li><Link to="/isletme-basvuru" className="hover:opacity-100 transition-opacity">{t("nav.business_apply")}</Link></li>
              <li><Link to="/giris" className="hover:opacity-100 transition-opacity">{t("footer.business_login")}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sm mb-4">{t("footer.legal")}</h4>
            <ul className="space-y-2.5 text-sm opacity-70">
              <li><Link to="#" className="hover:opacity-100 transition-opacity">{t("footer.privacy")}</Link></li>
              <li><Link to="#" className="hover:opacity-100 transition-opacity">{t("footer.terms")}</Link></li>
              <li><Link to="#" className="hover:opacity-100 transition-opacity">{t("footer.kvkk")}</Link></li>
              <li><Link to="#" className="hover:opacity-100 transition-opacity">{t("footer.cookies")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-sm opacity-60">
          © {new Date().getFullYear()} RandevuDunyasi. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
