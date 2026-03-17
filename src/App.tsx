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
import CoachDashboard from "./pages/CoachDashboard";
import CoachClients from "./pages/CoachClients";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Landing />} />
              <Route path="client" element={<ClientDashboard />} />
              <Route path="coach" element={<CoachDashboard />} />
              <Route path="coach/clients" element={<CoachClients />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/users" element={<AdminUsers />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
