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

import { AppHref } from "./constants";

type RouteConfig = {
  path: string;
  element: React.ReactNode;
  permission?: string; // Optional: Only for protected routes
};

export const publicRoutes: RouteConfig[] = [
  { path: AppHref.loginRoute, element: <Login /> },
  { path: AppHref.signupRoute, element: <Signup /> },
];

export const protectedRoutes: RouteConfig[] = [
  { path: AppHref.dashboardHomeRoute, element: <DashboardHome /> },
  // User Management
  { path: AppHref.usersRoute, element: <UserList />, permission: "users:read" },
  {
    path: AppHref.createUserRoute,
    element: <CreateUser />,
    permission: "users:create",
  },
  {
    path: "/users/:userId/edit",
    element: <EditUser />,
    permission: "users:update",
  },
  // Group Management
  {
    path: AppHref.groupsRoute,
    element: <GroupList />,
    permission: "groups:read",
  },
  {
    path: AppHref.createGroupRoute,
    element: <CreateGroup />,
    permission: "groups:create",
  },
  {
    path: "/groups/:groupId/edit",
    element: <EditGroup />,
    permission: "groups:update",
  },
  // Storefronts
  {
    path: AppHref.storefrontsRoute,
    element: <StorefrontList />,
    permission: "storefronts:read",
  },
  {
    path: AppHref.createStorefrontRoute,
    element: <CreateStorefront />,
    permission: "storefronts:create",
  },
  {
    path: "/storefronts/:storeId/edit",
    element: <EditStorefront />,
    permission: "storefronts:update",
  },
];

export const errorRoutes: RouteConfig[] = [
  { path: AppHref.unauthorizedRoute, element: <ErrorPage /> },
  { path: AppHref.forbiddenRoute, element: <ErrorPage /> },
  { path: AppHref.notFoundRoute, element: <ErrorPage /> },
  { path: AppHref.serverErrorRoute, element: <ErrorPage /> },
];
