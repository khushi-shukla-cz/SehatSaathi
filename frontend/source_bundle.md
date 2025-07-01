# SehatSaathi Source Bundle

---

## Cover Page
**Project:** SehatSaathi Health App  
**Exported:** 2025-07-01  
**Bundle:** All main source code files (React/TSX)

---

## Table of Contents
- How to Add Images, Screenshots, Diagrams, Flowcharts
- App.tsx
- SymptomScanner.tsx
- FirstAidGame.tsx
- HabitsTracker.tsx
- supabase.ts (types)

---

## How to Add Visuals

**Images & Screenshots:**
> _Paste or insert your UI screenshots here (e.g., Home page, Symptom Scanner, First Aid Game)._  

**Diagrams & Flowcharts:**
> _Add your system diagrams, flowcharts, or architecture sketches here._  

---

## App.tsx
```tsx
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
import MindfulMinutes from "./pages/MindfulMinutes";
import SymptomJournal from "./pages/SymptomJournal";
import HabitsTracker from "./pages/HabitsTracker";
import FirstAidGame from "./pages/FirstAidGame";

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
              <Route path="symptom-journal" element={
                <ProtectedRoute>
                  <SymptomJournal />
                </ProtectedRoute>
              } />
              <Route path="habits-tracker" element={
                <ProtectedRoute>
                  <HabitsTracker />
                </ProtectedRoute>
              } />
              <Route path="profile" element={<Profile />} />
              <Route path="mindful-minutes" element={
                <ProtectedRoute>
                  <MindfulMinutes />
                </ProtectedRoute>
              } />
              <Route path="first-aid-game" element={
                <ProtectedRoute>
                  <FirstAidGame />
                </ProtectedRoute>
              } />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
```

---

## SymptomScanner.tsx
```tsx
[...SymptomScanner.tsx code here...]
```

---

## FirstAidGame.tsx
```tsx
[...FirstAidGame.tsx code here...]
```

---

## HabitsTracker.tsx
```tsx
[...HabitsTracker.tsx code here...]
```

---

## supabase.ts (types)
```ts
[...supabase.ts code here...]
```

---

## End of Bundle

---

**To add images/diagrams:** Open this PDF in your favorite PDF editor and insert visuals in the marked sections.

**To regenerate or update this PDF:**
- Update your source files.
- Re-run the export process as described above.
