import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import DashboardHome from "@/pages/dashboard/Home";
import { PublicRoute } from "@/components/guards/PublicRoute";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import ErrorPage from "@/components/ErrorPage";
import UserList from "@/pages/dashboard/users/UserList";
import { PermissionRoute } from "@/components/guards/PermissionRoute";
import { AppHref } from "./constants";
import GroupList from "@/pages/dashboard/groups/GroupList";
import CreateUser from "@/pages/dashboard/users/CreateUser";
import EditUser from "@/pages/dashboard/users/EditUser";
import CreateGroup from "@/pages/dashboard/groups/CreateGroup";
import EditGroup from "@/pages/dashboard/groups/EditGroup";
// import StorefrontList from "@/pages/dashboard/storefronts/StorefrontList";
// import CreateStorefront from "@/pages/dashboard/storefronts/CreateStorefront";
// import EditStorefront from "@/pages/dashboard/storefronts/EditStorefront";

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
          <Route
            path={AppHref.createUserRoute}
            element={
              <PermissionRoute permission="users:create">
                <CreateUser />
              </PermissionRoute>
            }
          />
          <Route
            path="/users/:userId/edit"
            element={
              <PermissionRoute permission="users:update">
                <EditUser />
              </PermissionRoute>
            }
          />
          <Route
            path={AppHref.groupsRoute}
            element={
              <PermissionRoute permission="groups:read">
                <GroupList />
              </PermissionRoute>
            }
          />
          <Route
            path={AppHref.createGroupRoute}
            element={
              <PermissionRoute permission="groups:create">
                <CreateGroup />
              </PermissionRoute>
            }
          />
          <Route
            path="/groups/:groupId/edit"
            element={
              <PermissionRoute permission="groups:update">
                <EditGroup />
              </PermissionRoute>
            }
          />
          {/*<Route
            path={AppHref.storefrontsRoute}
            element={
              <PermissionRoute permission="storefronts:read">
                <StorefrontList />
              </PermissionRoute>
            }
          />
          <Route
            path={AppHref.createStorefrontRoute}
            element={
              <PermissionRoute permission="storefronts:create">
                <CreateStorefront />
              </PermissionRoute>
            }
          />
          <Route
            path="/storefronts/:storeId/edit"
            element={
              <PermissionRoute permission="storefronts:update">
                <EditStorefront />
              </PermissionRoute>
            }
          />*/}
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
