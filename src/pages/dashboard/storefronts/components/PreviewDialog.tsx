import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Monitor, Smartphone } from "lucide-react";
import { useState } from "react";

import type { PageSpec } from "@/types/storefront.design";
import { StorefrontRenderer } from "./StorefrontRenderer";

interface PreviewDialogProps {
  open: boolean;
  onClose: () => void;
  spec: PageSpec;
}

/**
 * Full-screen preview dialog
 * Shows how the storefront will look when rendered
 */
export function PreviewDialog({ open, onClose, spec }: PreviewDialogProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] h-[95vh] p-0 bg-gray-100">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <DialogTitle>Preview</DialogTitle>
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded p-1">
              <Button
                variant={viewMode === "desktop" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("desktop")}
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "mobile" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("mobile")}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="flex justify-center">
            <div
              className="bg-white shadow-2xl transition-all duration-300"
              style={{
                maxWidth: viewMode === "desktop" ? "100%" : "375px",
                width: "100%",
              }}
            >
              <StorefrontRenderer spec={spec} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
