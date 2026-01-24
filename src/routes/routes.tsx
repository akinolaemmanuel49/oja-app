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
import { AppHref } from "./constants";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicRoute />}>
        <Route path={AppHref.loginRoute} element={<Login />} />
        <Route path={AppHref.signupRoute} element={<Signup />} />
      </Route>

      {/* Protected routes with layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route
            path={AppHref.dashboardHomeRoute}
            element={<DashboardHome />}
          />
          <Route
            path={AppHref.usersRoute}
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
      <Route path={AppHref.unauthorizedRoute} element={<ErrorPage />} />
      <Route path={AppHref.forbiddenRoute} element={<ErrorPage />} />
      <Route path={AppHref.notFoundRoute} element={<ErrorPage />} />
      <Route path={AppHref.serverErrorRoute} element={<ErrorPage />} />

      {/* Catch-all */}
      <Route
        path="*"
        element={<Navigate to={AppHref.notFoundRoute} replace />}
      />
    </Routes>
  );
}
