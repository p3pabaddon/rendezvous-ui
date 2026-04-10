import { useState } from "react";
import { Share2, Copy, Check, Gift, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

interface ReferralWidgetProps {
  referralCode: string;
  className?: string;
}

export const ReferralWidget = ({ referralCode, className }: ReferralWidgetProps) => {
  const [copied, setCopied] = useState(false);
  const referralLink = `${window.location.origin}/register?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referans linki kopyalandı!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareData = {
    title: "Randevu Platformu",
    text: "En iyi işletmelerden randevu almak için bu linki kullan, sen de 50 TL indirim kazan!",
    url: referralLink,
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Paylaşım hatası:", err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-6 h-6" />
        </div>
        <CardTitle className="text-xl">Arkadaşlarını Davet Et</CardTitle>
        <CardDescription>
          Hem sen hem arkadaşın <span className="font-bold text-foreground">₺50</span> cüzdan indirimi kazanın.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input 
            value={referralLink} 
            readOnly 
            className="bg-muted/50 font-mono text-xs focus-visible:ring-0"
          />
          <Button variant="secondary" size="icon" onClick={handleCopy}>
            {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
        
        <Button className="w-full" onClick={handleShare}>
          <Share2 className="w-4 h-4 mr-2" />
          Hemen Paylaş
        </Button>

        <div className="pt-4 border-t border-border flex items-center justify-around text-center">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Davetlerin</p>
            <p className="text-xl font-heading">0</p>
          </div>
          <div className="w-[1px] h-8 bg-border" />
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Toplam Kazanç</p>
            <p className="text-xl font-heading text-accent">₺0</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
