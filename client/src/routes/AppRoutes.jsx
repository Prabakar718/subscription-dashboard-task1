import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../reusecomponents/ProtectedRoute";
import AdminRoute from "../reusecomponents/AdminRoute";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Plans from "../pages/Plans";
import Dashboard from "../pages/Dashboard";
import AdminSubscriptions from "../pages/AdminSubscriptions";
import Profile from "../pages/Profile";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/plans" element={<Plans />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute><Profile /></ProtectedRoute>}
        />
        <Route
          path="/admin/subscriptions"
          element={<AdminRoute><AdminSubscriptions /></AdminRoute>}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
