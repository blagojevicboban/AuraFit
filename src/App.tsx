/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import PageTransition from "./components/PageTransition";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { PWAProvider } from "./contexts/PWAContext";
import Layout from "./components/Layout";
import { InstallPrompt } from "./components/ui/InstallPrompt";
import Landing from "./pages/Landing";
import ClientDashboard from "./pages/ClientDashboard";
import ClientWorkouts from "./pages/ClientWorkouts";
import CoachDashboard from "./pages/CoachDashboard";
import CoachClients from "./pages/CoachClients";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import CoachApplications from "./pages/CoachApplications";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Launch from "./pages/Launch";
import Onboarding from "./pages/Onboarding";
import ProfileSetup from "./pages/ProfileSetup";
import HomeDashboard from "./pages/HomeDashboard";
import Workouts from "./pages/Workouts";
import Progress from "./pages/Progress";
import RoutineDetail from "./pages/RoutineDetail";
import CreateRoutine from "./pages/CreateRoutine";
import Nutrition from "./pages/Nutrition";
import MealPlanList from "./pages/MealPlanList";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Community from "./pages/Community";
import Settings from "./pages/Settings";
import NotificationSettings from "./pages/NotificationSettings";
import Help from "./pages/Help";
import WorkoutPlayer from "./pages/WorkoutPlayer";
import PasswordSetting from "./pages/PasswordSetting";
import DeleteAccount from "./pages/DeleteAccount";
import Favorites from "./pages/Favorites";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RecipeDetail from "./pages/RecipeDetail";
import ArticlesList from "./pages/ArticlesList";
import ArticleDetail from "./pages/ArticleDetail";
import FoodCategories from "./pages/FoodCategories";

import { ErrorBoundary } from "./components/ErrorBoundary";

function AppContent() {
  const location = useLocation();
  
  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location}>
          {/* ... routes ... */}
          <Route path="/" element={<PageTransition><Launch /></PageTransition>} />
          <Route path="/onboarding" element={<PageTransition><Onboarding /></PageTransition>} />
          <Route path="/setup" element={<PageTransition><ProfileSetup /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/signup" element={<PageTransition><SignUp /></PageTransition>} />
          <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
          <Route path="/home" element={<PageTransition><HomeDashboard /></PageTransition>} />
          <Route path="/workouts" element={<PageTransition><Workouts /></PageTransition>} />
          <Route path="/routine" element={<PageTransition><RoutineDetail /></PageTransition>} />
          <Route path="/create-routine" element={<PageTransition><CreateRoutine /></PageTransition>} />
          <Route path="/progress" element={<PageTransition><Progress /></PageTransition>} />
          <Route path="/nutrition" element={<PageTransition><Nutrition /></PageTransition>} />
          <Route path="/meal-plan" element={<PageTransition><MealPlanList /></PageTransition>} />
          <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
          <Route path="/profile/edit" element={<PageTransition><EditProfile /></PageTransition>} />
          <Route path="/community" element={<PageTransition><Community /></PageTransition>} />
          <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
          <Route path="/settings/notifications" element={<PageTransition><NotificationSettings /></PageTransition>} />
          <Route path="/settings/password" element={<PageTransition><PasswordSetting /></PageTransition>} />
          <Route path="/settings/delete-account" element={<PageTransition><DeleteAccount /></PageTransition>} />
          <Route path="/favorites" element={<PageTransition><Favorites /></PageTransition>} />
          <Route path="/privacy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
          <Route path="/recipe" element={<PageTransition><RecipeDetail /></PageTransition>} />
          <Route path="/articles" element={<PageTransition><ArticlesList /></PageTransition>} />
          <Route path="/article" element={<PageTransition><ArticleDetail /></PageTransition>} />
          <Route path="/food-categories" element={<PageTransition><FoodCategories /></PageTransition>} />
          <Route path="/help" element={<PageTransition><Help /></PageTransition>} />
          <Route path="/workout-player/:id" element={<PageTransition><WorkoutPlayer /></PageTransition>} />

          {/* App routes with Layout wrapper */}
          <Route path="/app" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="client" element={<ClientDashboard />} />
            <Route path="client/workouts" element={<ClientWorkouts />} />
            <Route path="coach" element={<CoachDashboard />} />
            <Route path="coach/clients" element={<CoachClients />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/users" element={<AdminUsers />} />
            <Route path="admin/applications" element={<CoachApplications />} />
          </Route>
        </Routes>
      </AnimatePresence>
      <InstallPrompt />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <PWAProvider>
            <AuthProvider>
              <BrowserRouter>
                <AppContent />
              </BrowserRouter>
            </AuthProvider>
          </PWAProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
