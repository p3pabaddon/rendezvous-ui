import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import IsletmelerPage from "./pages/IsletmelerPage";
import IsletmeDetailPage from "./pages/IsletmeDetailPage";
import GirisPage from "./pages/GirisPage";
import KayitPage from "./pages/KayitPage";
import HakkimizdaPage from "./pages/HakkimizdaPage";
import IletisimPage from "./pages/IletisimPage";
import SSSPage from "./pages/SSSPage";
import IsletmeBasvuruPage from "./pages/IsletmeBasvuruPage";
import DashboardPage from "./pages/DashboardPage";
import StaffDashboardPage from "./pages/StaffDashboardPage";
import ProfilPage from "./pages/ProfilPage";
import AdminPage from "./pages/AdminPage";
import ForBusinessesPage from "./pages/ForBusinessesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/isletmeler" element={<IsletmelerPage />} />
            <Route path="/isletme/:slug" element={<IsletmeDetailPage />} />
            <Route path="/giris" element={<GirisPage />} />
            <Route path="/kayit" element={<KayitPage />} />
            <Route path="/hakkimizda" element={<HakkimizdaPage />} />
            <Route path="/iletisim" element={<IletisimPage />} />
            <Route path="/sss" element={<SSSPage />} />
            <Route path="/isletme-basvuru" element={<IsletmeBasvuruPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/personel-paneli" element={<StaffDashboardPage />} />
            <Route path="/profil" element={<ProfilPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/isletmeler-icin" element={<ForBusinessesPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;