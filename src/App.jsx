import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import PatientDetail from "./pages/PatientDetail";
import Prescriptions from "./pages/Prescriptions";
import BirthRegistration from "./pages/BirthRegistration";
import VaccinationReminders from "./pages/VaccinationReminders";
import Alerts from "./pages/Alerts";
import AdminAnalytics from "./pages/AdminAnalytics";

function App() {
  return (
    <HashRouter>
      <Routes>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        <Route
          path="/patients"
          element={
            <Layout>
              <Patients />
            </Layout>
          }
        />

        <Route
          path="/patients/:id"
          element={
            <Layout>
              <PatientDetail />
            </Layout>
          }
        />

        <Route
          path="/prescriptions"
          element={
            <Layout>
              <Prescriptions />
            </Layout>
          }
        />

        <Route
          path="/birth-registration"
          element={
            <Layout>
              <BirthRegistration />
            </Layout>
          }
        />

        <Route
          path="/vaccination-reminders"
          element={
            <Layout>
              <VaccinationReminders />
            </Layout>
          }
        />

        <Route
          path="/alerts"
          element={
            <Layout>
              <Alerts />
            </Layout>
          }
        />

        <Route
          path="/admin-analytics"
          element={
            <Layout>
              <AdminAnalytics />
            </Layout>
          }
        />

      </Routes>
    </HashRouter>
  );
}

export default App;