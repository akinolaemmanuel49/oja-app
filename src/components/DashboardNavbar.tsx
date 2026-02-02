import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarIcon } from "./SidebarIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks/useLogout";

type NavbarProps = {
  onToggleSidebar: () => void;
  isOpen: boolean;
};

export const Navbar = ({ onToggleSidebar, isOpen }: NavbarProps) => {
  const logoutMutation = useLogout();

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-30">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            <SidebarIcon
              isOpen={isOpen}
              className="w-6 h-6"
              aria-label="Toggle Sidebar"
            />
          </Button>

          {/* Desktop sidebar toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="hidden lg:flex"
          >
            <SidebarIcon isOpen={isOpen} />
          </Button>

          <h1 className="text-xl font-semibold text-gray-800">ọjà Dashboard</h1>
        </div>

        {/* Right side navbar */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User
                  className="h-5 w-5"
                  aria-label="Current User Management"
                />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-44 bg-white border shadow-lg"
            >
              <DropdownMenuItem className="flex items-center gap-2">
                <User className="h-4 w-4" aria-label="Profile" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="flex items-center gap-2 text-red-600 focus:text-red-600"
              >
                <LogOut className="h-4 w-4" />
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};
