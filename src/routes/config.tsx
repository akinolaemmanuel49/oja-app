import { AppHref } from "./constants";

import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import DashboardHome from "@/pages/dashboard/Home";
import ErrorPage from "@/components/ErrorPage";
import UserList from "@/pages/dashboard/users/UserList";
import GroupList from "@/pages/dashboard/groups/GroupList";
import CreateUser from "@/pages/dashboard/users/CreateUser";
import EditUser from "@/pages/dashboard/users/EditUser";
import CreateGroup from "@/pages/dashboard/groups/CreateGroup";
import EditGroup from "@/pages/dashboard/groups/EditGroup";
import StorefrontList from "@/pages/dashboard/storefronts/StorefrontList";
import CreateStorefront from "@/pages/dashboard/storefronts/CreateStorefront";
import EditStorefront from "@/pages/dashboard/storefronts/EditStorefront";
import GroupDetail from "@/pages/dashboard/groups/GroupDetail";
import ManageGroupPermissions from "@/pages/dashboard/groups/ManageGroupPermissions";
import ManageGroupMembership from "@/pages/dashboard/groups/ManageGroupMembership";
import ManageUserPermissions from "@/pages/dashboard/users/ManageUserPermissions";
import UserDetail from "@/pages/dashboard/users/UserDetail";

type RouteConfig = {
  path: string;
  element: React.ReactNode;
  permissions?: string[]; // Optional: Only for protected routes
};

export const publicRoutes: RouteConfig[] = [
  { path: AppHref.loginRoute, element: <Login /> },
  { path: AppHref.signupRoute, element: <Signup /> },
];

export const protectedRoutes: RouteConfig[] = [
  { path: AppHref.dashboardHomeRoute, element: <DashboardHome /> },
  // User Management
  {
    path: AppHref.usersRoute,
    element: <UserList />,
    permissions: ["users:read"],
  },
  {
    path: AppHref.createUserRoute,
    element: <CreateUser />,
    permissions: ["users:create"],
  },
  {
    path: "/users/:userId/edit",
    element: <EditUser />,
    permissions: ["users:update"],
  },
  {
    path: "/users/:userId",
    element: <UserDetail />,
    permissions: ["users:read"],
  },
  {
    path: "/users/:userId/permissions",
    element: <ManageUserPermissions />,
    permissions: ["permissions:grant", "permissions:revoke"],
  },
  // Group Management
  {
    path: AppHref.groupsRoute,
    element: <GroupList />,
    permissions: ["groups:read"],
  },
  {
    path: "/groups/:groupId",
    element: <GroupDetail />,
    permissions: ["groups:read"],
  },
  {
    path: "/groups/:groupId/membership",
    element: <ManageGroupMembership />,
    permissions: ["groups:update"],
  },
  {
    path: "/groups/:groupId/permissions",
    element: <ManageGroupPermissions />,
    permissions: ["permissions:grant", "permissions:revoke"],
  },
  {
    path: AppHref.createGroupRoute,
    element: <CreateGroup />,
    permissions: ["groups:create"],
  },
  {
    path: "/groups/:groupId/edit",
    element: <EditGroup />,
    permissions: ["groups:update"],
  },
  // Storefronts
  {
    path: AppHref.storefrontsRoute,
    element: <StorefrontList />,
    permissions: ["storefronts:read"],
  },
  {
    path: AppHref.createStorefrontRoute,
    element: <CreateStorefront />,
    permissions: ["storefronts:create"],
  },
  {
    path: "/storefronts/:storeId/edit",
    element: <EditStorefront />,
    permissions: ["storefronts:update"],
  },
];

export const errorRoutes: RouteConfig[] = [
  { path: AppHref.unauthorizedRoute, element: <ErrorPage /> },
  { path: AppHref.forbiddenRoute, element: <ErrorPage /> },
  { path: AppHref.notFoundRoute, element: <ErrorPage /> },
  { path: AppHref.serverErrorRoute, element: <ErrorPage /> },
];
