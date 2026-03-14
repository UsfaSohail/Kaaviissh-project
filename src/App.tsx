import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import CookieConsent from "@/components/CookieConsent";
import ScrollToTop from "@/components/ScrollToTop";
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
import Chat from "./pages/Chat";
import LegalPage from "./pages/LegalPage";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CasesManager from "./pages/admin/CasesManager";
import BlogManager from "./pages/admin/BlogManager";
import DonationsManager from "./pages/admin/DonationsManager";
import ApplicationsManager from "./pages/admin/ApplicationsManager";
import ImpactCounterEditor from "./pages/admin/ImpactCounterEditor";
import PaymentMethodsManager from "./pages/admin/PaymentMethodsManager";
import ChatInbox from "./pages/admin/ChatInbox";
import RationBagManager from "./pages/admin/RationBagManager";
import LegalContentManager from "./pages/admin/LegalContentManager";
import AdminProfile from "./pages/admin/AdminProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <ScrollToTop />
            <Routes>
              {/* Admin routes — no Navbar/Footer */}
              <Route path="/admin" element={
                <ProtectedRoute adminOnly>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="cases" element={<CasesManager />} />
                <Route path="blogs" element={<BlogManager />} />
                <Route path="donations" element={<DonationsManager />} />
                <Route path="applications" element={<ApplicationsManager />} />
                <Route path="impact" element={<ImpactCounterEditor />} />
                <Route path="payment-methods" element={<PaymentMethodsManager />} />
                <Route path="chat" element={<ChatInbox />} />
                <Route path="ration-bag" element={<RationBagManager />} />
                <Route path="legal" element={<LegalContentManager />} />
                <Route path="profile" element={<AdminProfile />} />
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
                    <Route path="/apply" element={<ApplyForHelp />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/:slug" element={<LegalPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Footer />
                  <CookieConsent />
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
