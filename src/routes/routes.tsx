import { Routes, Route, Navigate } from "react-router-dom";
import { AppHref } from "./constants";
import { errorRoutes, protectedRoutes, publicRoutes } from "./config";
import { PermissionRoute } from "@/components/guards/PermissionRoute";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { PublicRoute } from "@/components/guards/PublicRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicRoute />}>
        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>

      {/* Protected routes with layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {protectedRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.permissions ? (
                  <PermissionRoute permissions={route.permissions}>
                    {route.element}
                  </PermissionRoute>
                ) : (
                  route.element
                )
              }
            />
          ))}
        </Route>
      </Route>

      {/* Error pages */}
      {errorRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}

      {/* Catch-all */}
      <Route
        path="*"
        element={<Navigate to={AppHref.notFoundRoute} replace />}
      />
    </Routes>
  );
}
