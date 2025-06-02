import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserProfile from "./pages/UserProfile";
import "./index.css";
import Layout from "./common/Layout";

const PrivateRoute = ({ children, role }) => {
  const { isAuthenticated, role: userRole } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (role && role !== userRole) return <Navigate to="/dashboard" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

function AppRoutes() {
  const { role } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Layout>
              {role === "admin" ? <AdminDashboard /> : <UserProfile />}
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="*"
        element={
          <Layout>
            <Navigate to="/dashboard" />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
