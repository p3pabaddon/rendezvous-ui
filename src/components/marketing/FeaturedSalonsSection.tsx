import { Star, MapPin, Clock } from "lucide-react";
import { t } from "@/lib/translations";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import { Button } from "@/components/ui/button";

const salons = [
  {
    id: 1,
    name: "L'Opera Hair Design",
    category: "Berber / Erkek Kuaförü",
    location: "Nişantaşı, İstanbul",
    rating: 4.9,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    name: "Aura Beauty & Wellness",
    category: "Güzellik Salonu",
    location: "Bebek, İstanbul",
    rating: 4.8,
    reviews: 256,
    image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    name: "Zen Spa Center",
    category: "Spa & Masaj",
    location: "Karsıyaka, Izmir",
    rating: 5.0,
    reviews: 84,
    image: "https://images.unsplash.com/photo-1544161515-4af6b1d4640b?auto=format&fit=crop&q=80&w=800",
  },
];

export function FeaturedSalonsSection() {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <ScrollReveal direction="left">
            <h2 className="text-4xl md:text-5xl font-heading mb-4 tracking-tight">
              {t("featured_salons.title")}
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {t("featured_salons.subtitle")}
            </p>
          </ScrollReveal>
          <ScrollReveal direction="right">
            <Button variant="outline" size="lg" className="rounded-full px-8 hover:bg-slate-100 dark:hover:bg-slate-800">
              {t("hero.popular")}
            </Button>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {salons.map((salon, i) => (
            <ScrollReveal key={salon.id} delay={i * 200} distance={40}>
              <div className="group bg-background rounded-[2rem] border border-border overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img 
                    src={salon.image} 
                    alt={salon.name}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-1.5 shadow-lg">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-sm">{salon.rating}</span>
                    <span className="text-muted-foreground text-xs">({salon.reviews}+)</span>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="text-xs font-bold text-accent uppercase tracking-widest mb-3">
                    {salon.category}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                    {salon.name}
                  </h3>
                  
                  <div className="flex flex-col gap-3 mb-8">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{salon.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">En yakın: Bugün 14:30</span>
                    </div>
                  </div>
                  
                  <Button className="w-full rounded-xl py-6 text-lg font-semibold group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                    Randevu Al
                  </Button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
