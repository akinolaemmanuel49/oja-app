import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  X,
  Monitor,
  Smartphone,
  Home,
  ShoppingBag,
  Package,
} from "lucide-react";
import { useState } from "react";

import type {
  StorefrontDesign,
  PageType,
  PageSpec,
} from "@/types/storefront.design";
import { PAGE_TYPE_LABELS } from "@/types/storefront.design";
import { StorefrontRenderer } from "./StorefrontRenderer";

interface PreviewDialogProps {
  open: boolean;
  onClose: () => void;
  design: StorefrontDesign;
  /** Which page tab was active in the designer when preview was opened */
  activePage: PageType;
  /** Lets the designer sync its active tab when the user switches pages inside preview */
  onPageChange: (page: PageType) => void;
}

const PAGE_TABS: Array<{ type: PageType; icon: React.ReactNode }> = [
  { type: "home", icon: <Home className="h-4 w-4" /> },
  { type: "products", icon: <ShoppingBag className="h-4 w-4" /> },
  { type: "product_detail", icon: <Package className="h-4 w-4" /> },
];

/**
 * Full-screen preview dialog showing rendered pages.
 * Includes its own page switcher so the user can walk through all three pages
 * without closing the dialog.
 */
export function PreviewDialog({
  open,
  onClose,
  design,
  activePage,
  onPageChange,
}: PreviewDialogProps) {
  const [localPage, setLocalPage] = useState<PageType>(activePage);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

  const handlePageChange = (page: PageType) => {
    setLocalPage(page);
    onPageChange(page); // keep designer tab in sync
  };

  // Build a full PageSpec for the renderer (inject shared theme)
  const buildSpec = (page: PageType): PageSpec => {
    const pageData = design.pages[page];
    return {
      ...pageData,
      theme: design.theme,
    };
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] h-[95vh] p-0 bg-gray-100 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b px-6 py-3 flex items-center justify-between shrink-0">
          <DialogTitle className="text-base">
            Preview — {PAGE_TYPE_LABELS[localPage]}
          </DialogTitle>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 bg-gray-100 rounded-md p-0.5">
              <Button
                variant={viewMode === "desktop" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("desktop")}
                className="h-7 w-7 p-0"
              >
                <Monitor className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={viewMode === "mobile" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("mobile")}
                className="h-7 w-7 p-0"
              >
                <Smartphone className="h-3.5 w-3.5" />
              </Button>
            </div>

            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Page switcher tabs */}
        <div className="bg-white border-b px-4 shrink-0">
          <nav className="flex gap-1">
            {PAGE_TABS.map((tab) => (
              <button
                key={tab.type}
                onClick={() => handlePageChange(tab.type)}
                className={[
                  "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors",
                  localPage === tab.type
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                ].join(" ")}
              >
                {tab.icon}
                {PAGE_TYPE_LABELS[tab.type]}
              </button>
            ))}
          </nav>
        </div>

        {/* Preview content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="flex justify-center">
            <div
              className="bg-white shadow-2xl transition-all duration-300"
              style={{
                maxWidth: viewMode === "desktop" ? "100%" : "375px",
                width: "100%",
              }}
            >
              <StorefrontRenderer spec={buildSpec(localPage)} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
