/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import ClientDashboard from "./pages/ClientDashboard";
import ClientWorkouts from "./pages/ClientWorkouts";
import CoachDashboard from "./pages/CoachDashboard";
import CoachClients from "./pages/CoachClients";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
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

import { ErrorBoundary } from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Full-screen routes (no Layout wrapper) */}
              <Route path="/" element={<Launch />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/setup" element={<ProfileSetup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/home" element={<HomeDashboard />} />
              <Route path="/workouts" element={<Workouts />} />
              <Route path="/routine" element={<RoutineDetail />} />
              <Route path="/create-routine" element={<CreateRoutine />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/nutrition" element={<Nutrition />} />

              {/* App routes with Layout wrapper */}
              <Route path="/app" element={<Layout />}>
                <Route index element={<Landing />} />
                <Route path="client" element={<ClientDashboard />} />
                <Route path="client/workouts" element={<ClientWorkouts />} />
                <Route path="coach" element={<CoachDashboard />} />
                <Route path="coach/clients" element={<CoachClients />} />
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="admin/users" element={<AdminUsers />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
