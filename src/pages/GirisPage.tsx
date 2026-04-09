import { Link, useNavigate } from "react-router-dom";
import { t } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const GirisPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast({ title: "Giriş Hatası", description: "E-posta veya şifre hatalı.", variant: "destructive" });
    } else {
      toast({ title: "Hoş geldiniz!" });
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-heading text-xl">R</span>
          </div>
          <span className="font-heading text-2xl text-foreground">
            Randevu<span className="text-accent">Dunyasi</span>
          </span>
        </Link>
        <h2 className="text-center text-2xl font-heading text-foreground">{t("auth.login_title")}</h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {t("auth.no_account")}{" "}
          <Link to="/kayit" className="text-accent hover:underline font-medium">{t("auth.register_btn")}</Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-card">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ornek@email.com" className="mt-1.5" required />
            </div>
            <div>
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="mt-1.5" required />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? t("auth.logging_in") : t("auth.login_btn")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GirisPage;
