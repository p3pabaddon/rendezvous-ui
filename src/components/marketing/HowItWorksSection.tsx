import { Search, CalendarDays, MessageSquare, CheckCircle } from "lucide-react";
import { t } from "@/lib/translations";
import { ScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  { key: "step1", icon: Search, color: "bg-primary text-primary-foreground" },
  { key: "step2", icon: CalendarDays, color: "bg-accent text-accent-foreground" },
  { key: "step3", icon: MessageSquare, color: "bg-info text-info-foreground" },
  { key: "step4", icon: CheckCircle, color: "bg-success text-success-foreground" },
];

export function HowItWorksSection() {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest uppercase text-accent mb-3 block">
              {t("how.label")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading text-foreground mb-4">
              {t("how.title")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("how.subtitle")}
            </p>
          </div>
        </ScrollReveal>

        <div className="relative">
          {/* Animated connecting line */}
          <ScrollReveal delay={200} direction="left" distance={0} duration={1000} className="absolute top-12 left-[12%] right-[12%] hidden md:block">
            <div className="h-0.5 bg-gradient-to-r from-primary via-accent to-success" />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, i) => (
              <ScrollReveal key={step.key} delay={i * 200} distance={30}>
                <div className="relative text-center group">
                  <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 relative z-10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <step.icon className="w-7 h-7" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs font-bold z-20 hidden md:flex">
                    {i + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t(`how.${step.key}`)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`how.${step.key}_desc`)}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
