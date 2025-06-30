
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Telemedicine from "./pages/Telemedicine";
import Records from "./pages/Records";
import Medications from "./pages/Medications";
import Messages from "./pages/Messages";
import HealthTracking from "./pages/HealthTracking";
import Profile from "./pages/Profile";
import AIHealthCoach from "./pages/AIHealthCoach";
import HealthAvatar from "./pages/HealthAvatar";
import SymptomScanner from "./pages/SymptomScanner";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";

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
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="telemedicine" element={<Telemedicine />} />
              <Route path="records" element={<Records />} />
              <Route path="medications" element={<Medications />} />
              <Route path="messages" element={<Messages />} />
              <Route path="health-tracking" element={<HealthTracking />} />
              <Route path="ai-coach" element={<AIHealthCoach />} />
              <Route path="health-avatar" element={<HealthAvatar />} />
              <Route path="symptom-scanner" element={<SymptomScanner />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
