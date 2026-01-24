import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import DashboardHome from "@/pages/dashboard/Home";
import { PublicRoute } from "@/components/guards/PublicRoute";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import ErrorPage from "@/components/ErrorPage";
import UserList from "@/pages/dashboard/user/UserList";
import { PermissionRoute } from "@/components/guards/PermissionRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* Protected routes with layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardHome />} />
          <Route
            path="/users"
            element={
              <PermissionRoute permission="users:read">
                <UserList />
              </PermissionRoute>
            }
          />
          {/* Add more nested routes here */}
          {/* <Route path="/storefronts/*" element={<StorefrontsPage />} /> */}
          {/* <Route path="/products/*" element={<ProductsPage />} /> */}
        </Route>
      </Route>

      {/* Error pages */}
      <Route path="/401" element={<ErrorPage />} />
      <Route path="/403" element={<ErrorPage />} />
      <Route path="/404" element={<ErrorPage />} />
      <Route path="/500" element={<ErrorPage />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
