import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// 1. Import your pages// 
import Login from "./Components/LogIn/LogIn.jsx";
import Layout from "./Components/Layout.jsx";
import Dashboard from "./Components/Dashboard/Dashboard.jsx";
import UserDashboard from "./Components/Users/UserDashboard.jsx";
import ManageBooks from "./Components/Books/ManageBooks.jsx";
import ManageTranslations from "./Components/Translations/ManageTranslations.jsx";
import ManageAudio from "./Components/Audio/ManageAudio.jsx";
import ManageQuiz from "./Components/Quiz/ManageQuiz.jsx";
import ManageSettings from "./Components/Settings/ManageSettings.jsx";
import Documentation from "./Components/Documentation/Documentation.jsx";
import ManageSummary from "./Components/Summary/ManageSummary.jsx";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const loginTime = localStorage.getItem("loginTime");
  const twelveHours = 12 * 60 * 60 * 1000;

  // Check if session has expired
  if (isAuthenticated && loginTime) {
    if (Date.now() - parseInt(loginTime, 10) >= twelveHours) {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("token");
      localStorage.removeItem("loginTime");
      return <Navigate to="/" />;
    }
  }

  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <div className="font-['Inter'] antialiased">
        <Routes>
          {/* Standalone Login Page */}
          <Route path="/" element={<Login />} />
          <Route path="/documentation" element={<Documentation />} />

          {/* Protected Routes - Rendered Inside Layout */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UserDashboard />} />
            <Route path="/books" element={<ManageBooks />} />
            <Route path="/translations" element={<ManageTranslations />} />
            <Route path="/audio" element={<ManageAudio />} />
            <Route path="/quiz" element={<ManageQuiz />} />
            <Route path="/summary" element={<ManageSummary />} />
            <Route path="/settings" element={<ManageSettings />} />
          </Route>

          {/* Catch-all: Redirect to login */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;