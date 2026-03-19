/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import PageTransition from "./components/PageTransition";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { PWAProvider } from "./contexts/PWAContext";
import Layout from "./components/Layout";
import { InstallPrompt } from "./components/ui/InstallPrompt";

const Landing = lazy(() => import("./pages/Landing"));
const ClientDashboard = lazy(() => import("./pages/ClientDashboard"));
const ClientWorkouts = lazy(() => import("./pages/ClientWorkouts"));
const CoachDashboard = lazy(() => import("./pages/CoachDashboard"));
const CoachClients = lazy(() => import("./pages/CoachClients"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const CoachApplications = lazy(() => import("./pages/CoachApplications"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Launch = lazy(() => import("./pages/Launch"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const ProfileSetup = lazy(() => import("./pages/ProfileSetup"));
const HomeDashboard = lazy(() => import("./pages/HomeDashboard"));
const Workouts = lazy(() => import("./pages/Workouts"));
const Progress = lazy(() => import("./pages/Progress"));
const RoutineDetail = lazy(() => import("./pages/RoutineDetail"));
const CreateRoutine = lazy(() => import("./pages/CreateRoutine"));
const Nutrition = lazy(() => import("./pages/Nutrition"));
const MealPlanList = lazy(() => import("./pages/MealPlanList"));
const Profile = lazy(() => import("./pages/Profile"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const Community = lazy(() => import("./pages/Community"));
const Settings = lazy(() => import("./pages/Settings"));
const NotificationSettings = lazy(() => import("./pages/NotificationSettings"));
const Help = lazy(() => import("./pages/Help"));
const WorkoutPlayer = lazy(() => import("./pages/WorkoutPlayer"));
const PasswordSetting = lazy(() => import("./pages/PasswordSetting"));
const DeleteAccount = lazy(() => import("./pages/DeleteAccount"));
const Favorites = lazy(() => import("./pages/Favorites"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const RecipeDetail = lazy(() => import("./pages/RecipeDetail"));
const ArticlesList = lazy(() => import("./pages/ArticlesList"));
const ArticleDetail = lazy(() => import("./pages/ArticleDetail"));
const FoodCategories = lazy(() => import("./pages/FoodCategories"));
const CoachSelection = lazy(() => import("./pages/CoachSelection"));

import { ErrorBoundary } from "./components/ErrorBoundary";

function AppContent() {
  const location = useLocation();
  
  return (
    <>
      <AnimatePresence mode="wait">
        <Suspense fallback={<div className="min-h-screen bg-[#1c1c1c] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>}>
          <Routes location={location}>
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
            <Route path="/coaches" element={<PageTransition><CoachSelection /></PageTransition>} />
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
        </Suspense>
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
