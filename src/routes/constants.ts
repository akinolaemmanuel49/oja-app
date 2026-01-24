export const PublicHref = {
  loginRoute: "/login",
  signupRoute: "/signup",
};

export const SystemHref = {
  unauthorizedRoute: "/401",
  forbiddenRoute: "/403",
  notFoundRoute: "/404",
  serverErrorRoute: "/500",
};

export const ProtectedHref = {
  dashboardHomeRoute: "/",
  usersRoute: "/users",
  groupsRoute: "/groups",
  storefrontsRoute: "/storefronts",
  productsRoute: "/products",
  settingsRoute: "/settings",
};

export const AppHref = {
  ...PublicHref,
  ...ProtectedHref,
  ...SystemHref,
};
