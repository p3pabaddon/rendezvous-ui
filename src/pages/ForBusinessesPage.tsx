import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ForBusinessSection } from "@/components/marketing/ForBusinessSection";
import { PricingSection } from "@/components/marketing/PricingSection";
import { CTASection } from "@/components/marketing/CTASection";
import { SEOHead } from "@/components/SEOHead";
import { t } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import { DemoVideoSection } from "@/components/marketing/DemoVideoSection";

export default function ForBusinessesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead 
        title={t("nav.for_business")}
        description={t("business.landing_subtitle")}
      />
      <Header />
      <main className="flex-1">
        {/* Business Hero */}
        <section className="bg-slate-950 pt-20 pb-32 text-white relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <ScrollReveal direction="down" distance={20}>
              <span className="text-accent font-semibold tracking-wider uppercase text-sm mb-4 block">
                {t("nav.for_business")}
              </span>
              <h1 className="text-4xl md:text-6xl font-heading mb-6 max-w-4xl mx-auto leading-tight">
                {t("business.landing_title")}
              </h1>
              <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                {t("business.landing_subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white px-8" onClick={() => navigate("/isletme-basvuru")}>
                  {t("cta.apply_btn")}
                </Button>
                <Button size="lg" variant="outline" className="border-slate-800 hover:bg-slate-900 text-white px-8" onClick={() => navigate("/iletisim")}>
                  {t("nav.contact")}
                </Button>
              </div>
            </ScrollReveal>
          </div>
          
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent/10 to-transparent pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
        </section>

        {/* Reusing existing sections but with a business focus */}
        <ForBusinessSection />
        
        <DemoVideoSection />

        <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-background p-8 rounded-2xl border border-border shadow-sm">
                  <h3 className="text-xl font-bold mb-4">{t(`business.feature${i}_title`)}</h3>
                  <p className="text-muted-foreground">{t(`business.feature${i}_desc`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PricingSection />
        
        <section className="py-20 bg-primary text-primary-foreground text-center">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="text-3xl md:text-4xl font-heading mb-6">{t("business.cta_title")}</h2>
            <p className="text-lg opacity-90 mb-10">{t("business.cta_desc")}</p>
            <Button size="lg" variant="secondary" className="px-10" onClick={() => navigate("/isletme-basvuru")}>
              {t("cta.apply_btn")}
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
