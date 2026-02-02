import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppHref } from "./constants";
import { errorRoutes, protectedRoutes, publicRoutes } from "./config";
import { PermissionRoute } from "@/components/guards/PermissionRoute";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { PublicRoute } from "@/components/guards/PublicRoute";
import { getRouteLabel } from "@/lib/getRouteLabel";
import { Suspense } from "react";
import { AppLoader } from "@/components/loaders/AppLoader";
import { AppMeta } from "@/components/meta/AppMeta";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function AppRoutes() {
  const meta = usePageMeta();
  const location = useLocation();

  const label = getRouteLabel(location.pathname);

  return (
    <>
      {meta && <AppMeta {...meta} />}

      <Suspense fallback={<AppLoader path={label} />}>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicRoute />}>
            {publicRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>

          {/* Protected routes */}
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

          {/* Error routes */}
          {errorRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Catch all */}
          <Route
            path="*"
            element={<Navigate to={AppHref.notFoundRoute} replace />}
          />
        </Routes>
      </Suspense>
    </>
  );
}
