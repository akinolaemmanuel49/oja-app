import { SidebarCloseIcon, SidebarOpenIcon } from "lucide-react";

type SidebarToggleProps = {
  isOpen: boolean;
  className?: string;
};

export const SidebarIcon = ({ isOpen, className }: SidebarToggleProps) => {
  return isOpen ? (
    <SidebarCloseIcon className={className} />
  ) : (
    <SidebarOpenIcon className={className} />
  );
};
