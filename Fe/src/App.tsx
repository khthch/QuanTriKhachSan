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
        <Route path="status" element={<RoomStatusPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="housekeeping" element={<HousekeepingPage />} />
        <Route path="reception" element={<ReceptionPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
