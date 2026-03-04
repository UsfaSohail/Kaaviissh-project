import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Drives from "./pages/Drives";
import Donate from "./pages/Donate";
import ZakatCalculator from "./pages/ZakatCalculator";
import Blog from "./pages/Blog";
import ApplyForHelp from "./pages/ApplyForHelp";
import Courses from "./pages/Courses";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LanguageProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/drives" element={<Drives />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/zakat" element={<ZakatCalculator />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/apply" element={<ApplyForHelp />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
