import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { DashboardLayout } from './components/DashboardLayout';
import { GuestLayout } from './components/GuestLayout';
import { RoomStatusPage } from './pages/RoomStatusPage';
import { BookingsPage } from './pages/BookingsPage';
import { HousekeepingPage } from './pages/HousekeepingPage';
import { ReceptionPage } from './pages/ReceptionPage';
import { SettingsPage } from './pages/SettingsPage';
import { AmenitiesPage } from './pages/AmenitiesPage';
import { AboutPage } from './pages/AboutPage';
import { getUser } from './lib/auth';

function RequireAuth({ children }: { children: React.ReactElement }) {
  const user = getUser();
  if (!user) {
    return <Navigate to="/dashboard/settings" replace />;
  }
  return children;
}

function RoleRoute({
  children,
  allow,
}: {
  children: React.ReactElement;
  allow: string[];
}) {
  const user = getUser();
  if (!user) {
    return <Navigate to="/dashboard/settings" replace />;
  }
  if (!allow.includes(user.role)) {
    return <Navigate to="/dashboard/status" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<GuestLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="amenities" element={<AmenitiesPage />} />
        <Route path="about" element={<AboutPage />} />
      </Route>
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/dashboard/status" replace />} />
        <Route
          path="status"
          element={
            <RequireAuth>
              <RoomStatusPage />
            </RequireAuth>
          }
        />
        <Route
          path="bookings"
          element={
            <RequireAuth>
              <BookingsPage />
            </RequireAuth>
          }
        />
        <Route
          path="housekeeping"
          element={
            <RoleRoute allow={["Housekeeping", "Admin"]}>
              <HousekeepingPage />
            </RoleRoute>
          }
        />
        <Route
          path="reception"
          element={
            <RoleRoute allow={["Reception", "Admin"]}>
              <ReceptionPage />
            </RoleRoute>
          }
        />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
