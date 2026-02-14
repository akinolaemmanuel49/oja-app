import { Home, Users, Package, Store, Group } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { PermissionGuard } from "@/components/guards/PermissionGuard";
import { AppHref } from "@/routes/constants";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

type NavItem = {
  icon: typeof Home;
  label: string;
  href: string;
  ariaLabel: string;
  /** Permission required to see this nav item (optional) */
  permission?: string;
};

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();

  // Define navigation items with their required permissions
  // Items without permission are visible to everyone
  const navItems: NavItem[] = [
    {
      icon: Home,
      label: "Dashboard",
      href: AppHref.dashboardHomeRoute,
      ariaLabel: "Dashboard",
    },
    {
      icon: Store,
      label: "Storefronts",
      href: AppHref.storefrontsRoute,
      permission: "storefronts:read", // Only show if user can read storefronts
      ariaLabel: "Storefronts",
    },
    {
      icon: Package,
      label: "Products",
      href: AppHref.productsRoute,
      permission: "products:read", // Only show if user can read products
      ariaLabel: "Products",
    },
    {
      icon: Users,
      label: "Users",
      href: AppHref.usersRoute,
      permission: "users:read", // Only show if user can read users
      ariaLabel: "Users",
    },
    {
      icon: Group,
      label: "Groups",
      href: AppHref.groupsRoute,
      permission: "groups:read", // Only show if user can read groups
      ariaLabel: "Groups",
    },
  ];

  /**
   * Helper to determine if a nav item is currently active.
   * Exact match for home, prefix match for others.
   */
  const isActive = (href: string) => {
    if (href === AppHref.dashboardHomeRoute) {
      return location.pathname === AppHref.dashboardHomeRoute;
    }
    return location.pathname.startsWith(href);
  };

  /**
   * Render a single nav item, wrapped in PermissionGuard if needed.
   */
  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const active = isActive(item.href);
    const ariaLabel = item.ariaLabel;

    const navLink = (
      <Link
        aria-label={ariaLabel}
        to={item.href}
        className={`
          flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
          ${
            active
              ? "bg-blue-50 text-blue-600"
              : "hover:bg-gray-100 text-gray-700"
          }
        `}
        onClick={onClose} // Close sidebar on mobile after click
      >
        <Icon
          className={`h-5 w-5 shrink-0 ${active ? "text-blue-600" : "text-gray-600"}`}
        />
        <span
          className={`
            whitespace-nowrap transition-opacity duration-300
            ${isOpen ? "opacity-100" : "opacity-0 invisible"}
          `}
        >
          {item.label}
        </span>
      </Link>
    );

    // If item has permission requirement, wrap in PermissionGuard
    if (item.permission) {
      return (
        <PermissionGuard key={item.href} permission={item.permission}>
          {navLink}
        </PermissionGuard>
      );
    }

    // Otherwise, render directly
    return <div key={item.href}>{navLink}</div>;
  };

  return (
    <>
      {/* Desktop sidebar - collapsible */}
      <aside
        className={`
          hidden lg:block
          fixed left-0 top-16 bottom-0
          bg-white border-r border-gray-200
          transition-all duration-300
          z-20
          ${isOpen ? "w-64" : "w-18"}
        `}
      >
        <nav className="p-4 space-y-2">{navItems.map(renderNavItem)}</nav>
      </aside>

      {/* Mobile sidebar - slides in from left */}
      <aside
        className={`
          lg:hidden
          fixed left-0 top-16 bottom-0 w-64
          bg-white border-r border-gray-200
          transition-transform duration-300
          z-30
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <nav className="p-4 space-y-2">{navItems.map(renderNavItem)}</nav>
      </aside>
    </>
  );
};
