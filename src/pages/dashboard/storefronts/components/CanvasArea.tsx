import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, Trash2, Copy, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

import type { PageComponent, ThemeConfig } from "@/types/storefront.design";
import { ComponentPreview } from "./ComponentPreview";

interface CanvasAreaProps {
  components: PageComponent[];
  selectedComponentId: string | null;
  onSelectComponent: (id: string) => void;
  onDeleteComponent: (id: string) => void;
  onDuplicateComponent: (id: string) => void;
  viewMode: "desktop" | "mobile";
  theme: ThemeConfig;
}

/**
 * Main canvas area where components are displayed and edited
 */
export function CanvasArea({
  components,
  selectedComponentId,
  onSelectComponent,
  onDeleteComponent,
  onDuplicateComponent,
  viewMode,
  theme,
}: CanvasAreaProps) {
  // Calculate canvas width based on view mode
  const canvasMaxWidth = viewMode === "desktop" ? "100%" : "375px";

  return (
    <div className="flex justify-center">
      <div
        style={{ maxWidth: canvasMaxWidth }}
        className="w-full transition-all duration-300"
      >
        {components.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <p className="text-gray-500 mb-2">Your canvas is empty</p>
            <p className="text-sm text-gray-400">
              Click on a component from the left sidebar to add it to your page
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {components.map((component) => (
              <SortableComponent
                key={component.id}
                component={component}
                isSelected={component.id === selectedComponentId}
                onSelect={() => onSelectComponent(component.id)}
                onDelete={() => onDeleteComponent(component.id)}
                onDuplicate={() => onDuplicateComponent(component.id)}
                theme={theme}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Individual sortable component wrapper
 */
interface SortableComponentProps {
  component: PageComponent;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  theme: ThemeConfig;
}

function SortableComponent({
  component,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  theme,
}: SortableComponentProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group",
        isDragging && "opacity-50",
        isSelected && "ring-2 ring-blue-500 ring-offset-2",
      )}
    >
      {/* Component Card */}
      <Card
        className={cn(
          "cursor-pointer transition-all",
          isSelected && "shadow-lg",
          !isSelected && "hover:shadow-md",
        )}
        onClick={onSelect}
      >
        {/* Toolbar - shows on hover or when selected */}
        <div
          className={cn(
            "absolute -top-10 left-0 right-0 flex items-center gap-2 bg-white border rounded-t px-2 py-1 shadow-sm z-10",
            !isSelected && "opacity-0 group-hover:opacity-100",
            "transition-opacity",
          )}
        >
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
          </button>

          <span className="text-xs text-gray-600 font-medium flex-1">
            {component.type.replace("_", " ").toUpperCase()}
          </span>

          {/* Actions */}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="h-7 w-7 p-0"
          >
            <Copy className="h-3 w-3" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        {/* Component Preview */}
        <div className="p-4 bg-gray-50 rounded">
          <ComponentPreview component={component} theme={theme} />
        </div>
      </Card>

      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 bg-blue-500 text-white p-1 rounded-full">
          <Settings className="h-3 w-3" />
        </div>
      )}
    </div>
  );
}
