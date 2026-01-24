import { useAuth } from "@/hooks/useAuth";
import { DashboardHomeRoute } from "@/routes/constants";
import { Navigate, Outlet } from "react-router-dom";

export function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  return isAuthenticated ? (
    <Navigate to={DashboardHomeRoute} replace />
  ) : (
    <Outlet />
  );
}
