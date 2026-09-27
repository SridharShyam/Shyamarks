import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/Home/HomePage';
import { AchievementsPage } from './pages/Achievements/AchievementsPage';
import { AchievementDetailPage } from './pages/AchievementDetail/AchievementDetailPage';
import { SkillsPage } from './pages/Skills/SkillsPage';
import { ProjectsPage } from './pages/Projects/ProjectsPage';
import { TimelinePage } from './pages/Timeline/TimelinePage';

// Studio Pages (formerly Admin)
import { AdminLoginPage } from './pages/Admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/Admin/AdminDashboardPage';
import { AdminAchievementsPage } from './pages/Admin/AdminAchievementsPage';
import { AdminAchievementFormPage } from './pages/Admin/AdminAchievementFormPage';
import { AdminSkillsPage } from './pages/Admin/AdminSkillsPage';
import { AdminProjectsPage } from './pages/Admin/AdminProjectsPage';
import { AdminExperiencesPage } from './pages/Admin/AdminExperiencesPage';
import { AdminIssuersPage } from './pages/Admin/AdminIssuersPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 mins
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/achievements/:slug" element={<AchievementDetailPage />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/timeline" element={<TimelinePage />} />
            </Route>

            {/* Studio Console Authentication Route */}
            <Route path="/studio/login" element={<AdminLoginPage />} />
            <Route path="/admin/login" element={<Navigate to="/studio/login" replace />} />

            {/* Protected Studio Console Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/studio" element={<AdminDashboardPage />} />
                <Route path="/admin" element={<Navigate to="/studio" replace />} />

                <Route path="/studio/achievements" element={<AdminAchievementsPage />} />
                <Route path="/admin/achievements" element={<Navigate to="/studio/achievements" replace />} />

                <Route path="/studio/achievements/new" element={<AdminAchievementFormPage />} />
                <Route path="/admin/achievements/new" element={<Navigate to="/studio/achievements/new" replace />} />

                <Route path="/studio/achievements/:id/edit" element={<AdminAchievementFormPage />} />
                <Route path="/admin/achievements/:id/edit" element={<Navigate to="/studio/achievements/:id/edit" replace />} />

                <Route path="/studio/skills" element={<AdminSkillsPage />} />
                <Route path="/admin/skills" element={<Navigate to="/studio/skills" replace />} />

                <Route path="/studio/projects" element={<AdminProjectsPage />} />
                <Route path="/admin/projects" element={<Navigate to="/studio/projects" replace />} />

                <Route path="/studio/experiences" element={<AdminExperiencesPage />} />
                <Route path="/admin/experiences" element={<Navigate to="/studio/experiences" replace />} />

                <Route path="/studio/issuers" element={<AdminIssuersPage />} />
                <Route path="/admin/issuers" element={<Navigate to="/studio/issuers" replace />} />
              </Route>
            </Route>

            {/* Fallback wildcard redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};
