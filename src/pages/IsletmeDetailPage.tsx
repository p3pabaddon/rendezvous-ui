import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { t } from "@/lib/translations";
import { Star, MapPin, Clock, CheckCircle, Phone, Calendar } from "lucide-react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { BookingModal } from "@/components/BookingModal";
import { ReviewModal } from "@/components/ReviewModal";
import { ShareButtons } from "@/components/ShareButtons";
import { FavoriteButton } from "@/components/FavoriteButton";
import { getBusinessBySlug } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { MessageSquare } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";

const IsletmeDetailPage = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [biz, setBiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  const reloadBusiness = () => {
    if (slug) getBusinessBySlug(slug).then(setBiz).catch(() => {});
  };

  useEffect(() => {
    if (slug) {
      getBusinessBySlug(slug)
        .then(setBiz)
        .catch(() => setBiz(null))
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-surface">
          <p className="text-muted-foreground">Yükleniyor...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!biz) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-surface">
          <div className="text-center">
            <h2 className="text-xl font-heading text-foreground mb-2">İşletme bulunamadı</h2>
            <p className="text-muted-foreground">Bu işletme mevcut değil veya kaldırılmış olabilir.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const workingHours = typeof biz.working_hours === "string" 
    ? JSON.parse(biz.working_hours) 
    : (biz.working_hours || {});

  const seoTitle = `${biz.name} - ${biz.category} | ${biz.city}`;
  const seoDesc = `${biz.city} konumundaki ${biz.name} için randevunuzu hemen alın. ${biz.category} alanında uzman kadrosuyla hizmetinizde.`;

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead 
        title={seoTitle}
        description={seoDesc}
        url={window.location.href}
        image={biz.image_url || "/placeholder.jpg"}
      />
      <Header />
      <main className="flex-1 bg-surface">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{biz.category}</Badge>
                  {biz.is_verified && (
                    <Badge className="bg-accent/10 text-accent border-accent/20">
                      <CheckCircle className="w-3 h-3 mr-1" /> Onaylı
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl font-heading text-foreground mb-2">{biz.name}</h1>
                <p className="text-muted-foreground mb-3">{biz.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-warning fill-warning" />
                    <span className="font-medium text-foreground">{biz.rating}</span>
                    <span>({biz.review_count} yorum)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{biz.district}, {biz.city}</span>
                  </div>
                  {biz.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      <span>{biz.phone}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FavoriteButton businessId={biz.id} size="sm" />
                <ShareButtons title={biz.name} />
                <Button size="lg" onClick={() => setBookingOpen(true)}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Randevu Al
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery */}
        {biz.gallery_urls && biz.gallery_urls.length > 0 && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {biz.gallery_urls.map((url: string, i: number) => (
                <div key={i} className="aspect-video rounded-xl overflow-hidden border border-border bg-card">
                  <img src={url} alt={`${biz.name} galeri ${i+1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Services */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-xl font-heading text-foreground mb-4">Hizmetler</h2>
                <div className="space-y-3">
                  {(biz.services || []).map((service: any) => (
                    <div
                      key={service.id}
                      className="bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:border-accent/30 transition-colors"
                    >
                      <div>
                        <h3 className="font-medium text-foreground">{service.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {service.duration} dk
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-foreground">₺{service.price}</span>
                      </div>
                    </div>
                  ))}
                  {(!biz.services || biz.services.length === 0) && (
                    <p className="text-muted-foreground text-sm">Henüz hizmet eklenmemiş.</p>
                  )}
                </div>
              </div>

              {/* Staff */}
              {biz.staff && biz.staff.length > 0 && (
                <div>
                  <h2 className="text-xl font-heading text-foreground mb-4">Ekip</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {biz.staff.map((member: any) => (
                      <div key={member.id} className="bg-card border border-border rounded-xl p-4 text-center">
                        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-accent font-heading text-xl">
                            {member.name.split(" ").map((n: string) => n[0]).join("")}
                          </span>
                        </div>
                        <h3 className="font-medium text-foreground text-sm">{member.name}</h3>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                        <div className="flex items-center justify-center gap-1 mt-2 text-xs">
                          <Star className="w-3 h-3 text-warning fill-warning" />
                          <span className="text-foreground">{member.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-heading text-foreground mb-6">{t("common.reviews")}</h2>
                  {user && (
                    <Button variant="outline" size="sm" onClick={() => setReviewOpen(true)}>
                      <MessageSquare className="w-4 h-4 mr-1" /> Yorum Yap
                    </Button>
                  )}
                </div>
                {biz.reviews && biz.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {biz.reviews.map((review: any) => (
                      <div key={review.id} className="bg-card border border-border rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-primary text-xs font-semibold">{review.customer_name[0]}</span>
                            </div>
                            <span className="font-medium text-sm text-foreground">{review.customer_name}</span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 text-warning fill-warning" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">{t("common.no_reviews")}</p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6 shadow-card sticky top-20">
                <h3 className="font-semibold text-foreground mb-4">{t("common.working_hours")}</h3>
                <div className="space-y-2">
                {Object.entries(workingHours).map(([day, hours]) => {
                    const displayHours = typeof hours === 'object' && hours !== null
                      ? `${(hours as any).start || ''}-${(hours as any).end || ''}`
                      : String(hours);
                    return (
                      <div key={day} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground capitalize">{t(`day.${day.toLowerCase()}`)}</span>
                        <span className={`font-medium ${displayHours.toLowerCase().includes("kapal") ? "text-destructive" : "text-foreground"}`}>
                          {displayHours}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <Button className="w-full mt-6" size="lg" onClick={() => setBookingOpen(true)}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Randevu Al
                </Button>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 shadow-card">
                <h3 className="font-semibold text-foreground mb-3">{t("common.address")}</h3>
                <p className="text-sm text-muted-foreground">{biz.address}</p>
                <p className="text-sm text-muted-foreground mb-4">{biz.district}, {biz.city}</p>
                {biz.city && (
                  <iframe
                    title="İşletme Konumu"
                    className="w-full h-48 rounded-lg border border-border"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(`${biz.name} ${biz.district} ${biz.city} Türkiye`)}`}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {biz.services && biz.services.length > 0 && (
        <BookingModal
          open={bookingOpen}
          onOpenChange={setBookingOpen}
          businessId={biz.id}
          businessName={biz.name}
          services={biz.services}
          staff={biz.staff || []}
          workingHours={workingHours}
        />
      )}

      <ReviewModal
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        businessId={biz.id}
        businessName={biz.name}
        onReviewSubmitted={reloadBusiness}
      />
    </div>
  );
};

export default IsletmeDetailPage;
