import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import AIAssistantChat from "./components/AIAssistantChat";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import OnboardingPage from "./pages/OnboardingPage";
import ProfilePage from "./pages/ProfilePage";
import Schemes from "./pages/Schemes";
import SchemeDetails from "./pages/SchemeDetails";
import SavedSchemes from "./pages/SavedSchemes";
import MyApplications from "./pages/MyApplications";
import SchemesPage from "./pages/SchemesPage";

import "./App.css";

const ProtectedLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="app-shell">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />

        <div className="app-main">
          <Header 
            onMenuClick={() => setSidebarOpen(true)} 
          />

          <main className="app-content">
            {children}
          </main>
        </div>

        <AIAssistantChat />
      </div>
    </ProtectedRoute>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            }
          />

          <Route
            path="/onboarding"
            element={
              <ProtectedLayout>
                <OnboardingPage />
              </ProtectedLayout>
            }
          />

          <Route
            path="/schemes"
            element={
              <ProtectedLayout>
                <Schemes />
              </ProtectedLayout>
            }
          />

          <Route
            path="/schemes/:slug"
            element={
              <ProtectedLayout>
                <SchemeDetails />
              </ProtectedLayout>
            }
          />

          <Route
            path="/saved"
            element={
              <ProtectedLayout>
                <SavedSchemes />
              </ProtectedLayout>
            }
          />

          <Route
            path="/applications"
            element={
              <ProtectedLayout>
                <MyApplications />
              </ProtectedLayout>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedLayout>
                <ProfilePage />
              </ProtectedLayout>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;