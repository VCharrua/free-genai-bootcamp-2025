
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";

// Layout
import AppLayout from "@/components/layout/AppLayout";

// Pages
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
import StudyActivities from "@/pages/StudyActivities";
import StudyActivityShow from "@/pages/StudyActivityShow";
import StudyActivityLaunch from "@/pages/StudyActivityLaunch";
import Words from "@/pages/Words";
import WordShow from "@/pages/WordShow";
import Groups from "@/pages/Groups";
import GroupShow from "@/pages/GroupShow";
import StudySessions from "@/pages/StudySessions";
import StudySessionShow from "@/pages/StudySessionShow";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="language-portal-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/study-activities" element={<StudyActivities />} />
              <Route path="/study_activities/:id" element={<StudyActivityShow />} />
              <Route path="/study_activities/:id/launch" element={<StudyActivityLaunch />} />
              <Route path="/words" element={<Words />} />
              <Route path="/words/:id" element={<WordShow />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/groups/:id" element={<GroupShow />} />
              <Route path="/study_sessions" element={<StudySessions />} />
              <Route path="/study_sessions/:id" element={<StudySessionShow />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
