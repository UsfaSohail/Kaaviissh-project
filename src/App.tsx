import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
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
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CasesManager from "./pages/admin/CasesManager";
import BlogManager from "./pages/admin/BlogManager";
import DonationsManager from "./pages/admin/DonationsManager";
import ApplicationsManager from "./pages/admin/ApplicationsManager";
import ImpactCounterEditor from "./pages/admin/ImpactCounterEditor";
import ZakatRatesManager from "./pages/admin/ZakatRatesManager";
import GalleryManager from "./pages/admin/GalleryManager";
import PaymentMethodsManager from "./pages/admin/PaymentMethodsManager";
import ChatInbox from "./pages/admin/ChatInbox";
import RationBagManager from "./pages/admin/RationBagManager";
import SiteContentManager from "./pages/admin/SiteContentManager";
import QuotesManager from "./pages/admin/QuotesManager";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <Routes>
              {/* Admin routes — no Navbar/Footer */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="cases" element={<CasesManager />} />
                <Route path="blogs" element={<BlogManager />} />
                <Route path="donations" element={<DonationsManager />} />
                <Route path="applications" element={<ApplicationsManager />} />
                <Route path="impact" element={<ImpactCounterEditor />} />
                <Route path="zakat-rates" element={<ZakatRatesManager />} />
                <Route path="gallery" element={<GalleryManager />} />
                <Route path="payment-methods" element={<PaymentMethodsManager />} />
                <Route path="chat" element={<ChatInbox />} />
                <Route path="ration-bag" element={<RationBagManager />} />
                <Route path="site-content" element={<SiteContentManager />} />
                <Route path="quotes" element={<QuotesManager />} />
              </Route>

              {/* Public routes */}
              <Route path="*" element={
                <>
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/drives" element={<Drives />} />
                    <Route path="/donate" element={<Donate />} />
                    <Route path="/zakat" element={<ZakatCalculator />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/apply" element={
                      <ProtectedRoute>
                        <ApplyForHelp />
                      </ProtectedRoute>
                    } />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Footer />
                </>
              } />
            </Routes>
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
