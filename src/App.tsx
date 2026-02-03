import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import Home from "./pages/Home";
import CharacterPage from "./pages/CharacterPage";
import Depoimentos from "./pages/Depoimentos";
import Contato from "./pages/Contato";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Admin routes without header/footer */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Public routes with header/footer */}
            <Route
              path="*"
              element={
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <div className="flex-1">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/personagem/:slug" element={<CharacterPage />} />
                      <Route path="/depoimentos" element={<Depoimentos />} />
                      <Route path="/contato" element={<Contato />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                  <Footer />
                  <WhatsAppButton />
                </div>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
