import { useState, useEffect } from "react";
import { Gift, Save, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Props {
  businessId: string;
}

export const BizLoyaltySettings = ({ businessId }: Props) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [program, setProgram] = useState<any>({
    target_stamps: 10,
    reward_title: "",
    reward_type: "free_service",
    is_active: false
  });

  useEffect(() => {
    loadProgram();
  }, [businessId]);

  const loadProgram = async () => {
    try {
      const { data, error } = await supabase
        .from("loyalty_programs")
        .select("*")
        .eq("business_id", businessId)
        .single();

      if (data) setProgram(data);
    } catch (err) {
      console.error("Yükleme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("loyalty_programs")
        .upsert({
          ...program,
          business_id: businessId,
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'business_id' 
        });

      if (error) throw error;
      toast.success("Sadakat programı güncellendi");
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error(err.message || "Kaydedilemedi");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Yükleniyor...</div>;

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-6">
      <Card className="border-2 border-primary/20 shadow-xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary" />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-heading flex items-center gap-2">
                <Gift className="w-6 h-6 text-primary" /> Sadakat Programı
              </CardTitle>
              <CardDescription>
                Müşterilerinizi dijital damga kartıyla ödüllendirin ve sadakati artırın.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 bg-card p-2 rounded-lg border border-border shadow-sm">
              <Label htmlFor="active-toggle" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Aktif</Label>
              <Switch 
                id="active-toggle"
                checked={program.is_active}
                onCheckedChange={(checked) => setProgram({...program, is_active: checked})}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Hedef Damga Sayısı</Label>
              <Select 
                value={String(program.target_stamps)} 
                onValueChange={(val) => setProgram({...program, target_stamps: Number(val)})}
              >
                <SelectTrigger className="bg-muted/50 border-none">
                  <SelectValue placeholder="Seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 15, 20].map(n => (
                    <SelectItem key={n} value={String(n)}>{n} Randevu</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground italic">Müşteri kaç randevu sonunda ödül kazanacak?</p>
            </div>

            <div className="space-y-2">
              <Label>Ödül Türü</Label>
              <Select 
                value={program.reward_type} 
                onValueChange={(val) => setProgram({...program, reward_type: val})}
              >
                <SelectTrigger className="bg-muted/50 border-none">
                  <SelectValue placeholder="Seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free_service">Ücretsiz Hizmet</SelectItem>
                  <SelectItem value="discount_fixed">Sabit İndirim (₺)</SelectItem>
                  <SelectItem value="discount_percent">Yüzde İndirim (%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Ödül Açıklaması</Label>
            <Input 
              placeholder="Örn: Ücretsiz Saç Kesimi"
              value={program.reward_title}
              onChange={(e) => setProgram({...program, reward_title: e.target.value})}
              className="bg-muted/50 border-none text-lg font-medium"
            />
            <p className="text-[10px] text-muted-foreground">Müşterinin damga kartında görünecek ödül ismi.</p>
          </div>

          {program.reward_type !== "free_service" && (
            <div className="space-y-2">
              <Label>İndirim Değeri</Label>
              <Input 
                type="number"
                value={program.reward_value}
                onChange={(e) => setProgram({...program, reward_value: Number(e.target.value)})}
                className="bg-muted/50 border-none"
              />
            </div>
          )}

          <div className="pt-6 border-t border-border mt-8 flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary font-medium text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Daha fazla sadakat, daha fazla büyüme!</span>
            </div>
            <Button onClick={handleSave} disabled={saving} size="lg">
              {saving ? "Kaydediliyor..." : (
                <>
                  <Save className="w-4 h-4 mr-2" /> Kaydet
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-foreground line-clamp-1">Nasıl Çalışır?</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Müşterilerinizin randevusunu "Tamamlandı" olarak işaretlediğinizde otomatik 1 damga kazanırlar. Hedefe ulaştıklarında bir kupon kodu alırlar.
            </p>
          </div>
        </div>
        <div className="p-4 bg-accent/5 rounded-xl border border-accent/10 flex gap-3">
          <AlertCircle className="w-5 h-5 text-accent shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-foreground">Önemli Not</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Hali hazırda devam eden bir kampanyanızı değiştirmek, mevcut damgası olan müşterileri etkilemez ancak hedeflerini günceller.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
