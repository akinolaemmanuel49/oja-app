import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  DndContext,
  type DragEndEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Download,
  Eye,
  Plus,
  Settings,
  Smartphone,
  Monitor,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import type {
  PageSpec,
  PageComponent,
  ComponentType,
  ThemeConfig,
} from "@/types/storefront.design";
import { ComponentSidebar } from "./components/ComponentSidebar";
import { CanvasArea } from "./components/CanvasArea";
import { ComponentEditor } from "./components/ComponentEditor";
import { ThemeEditor } from "./components/ThemeEditor";
import { PreviewDialog } from "./components/PreviewDialog";
import {
  DEFAULT_THEME,
  createComponent,
} from "@/lib/storefrontComponentsRegistry";

/**
 * Main Storefront Designer Page
 *
 * Features:
 * - Drag-and-drop page builder
 * - Component editing
 * - Theme customization
 * - Live preview
 * - JSON spec download
 */
export default function StorefrontDesigner() {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();

  // ============================================================================
  // STATE
  // ============================================================================

  const [pageTitle, setPageTitle] = useState("Home Page");
  const [pageDescription, setPageDescription] = useState("");
  const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_THEME);
  const [components, setComponents] = useState<PageComponent[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [showPreview, setShowPreview] = useState(false);
  const [showThemeEditor, setShowThemeEditor] = useState(false);

  // ============================================================================
  // DRAG AND DROP SETUP
  // ============================================================================

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts
      },
    }),
  );

  // ============================================================================
  // HANDLERS
  // ============================================================================

  /**
   * Handle adding a new component from sidebar
   */
  const handleAddComponent = useCallback(
    (type: ComponentType) => {
      const newComponent = createComponent(type, components.length);
      setComponents((prev) => [...prev, newComponent]);
      setSelectedComponentId(newComponent.id);
    },
    [components.length],
  );

  /**
   * Handle drag end (reordering components)
   */
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setComponents((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const reordered = arrayMove(items, oldIndex, newIndex);

        // Update order property
        return reordered.map((item, index) => ({
          ...item,
          order: index,
        }));
      });
    }
  }, []);

  /**
   * Handle updating a component's data
   */
  function updateComponentData<C extends PageComponent>(
    component: C,
    newData: C["data"],
  ): C {
    return { ...component, data: newData };
  }

  const handleUpdateComponent = useCallback(
    (id: string, data: PageComponent["data"]) => {
      setComponents((prev) =>
        prev.map((comp) => {
          if (comp.id !== id) return comp;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return updateComponentData(comp, data as any);
        }),
      );
    },
    [],
  );

  /**
   * Handle deleting a component
   */
  const handleDeleteComponent = useCallback(
    (id: string) => {
      setComponents((prev) => {
        const filtered = prev.filter((comp) => comp.id !== id);
        // Reindex order
        return filtered.map((comp, index) => ({ ...comp, order: index }));
      });

      if (selectedComponentId === id) {
        setSelectedComponentId(null);
      }
    },
    [selectedComponentId],
  );

  /**
   * Handle duplicating a component
   */
  const handleDuplicateComponent = useCallback(
    (id: string) => {
      const componentToDuplicate = components.find((comp) => comp.id === id);
      if (!componentToDuplicate) return;

      const duplicated: PageComponent = {
        ...componentToDuplicate,
        id: uuidv4(),
        order: components.length,
      };

      setComponents((prev) => [...prev, duplicated]);
      setSelectedComponentId(duplicated.id);
    },
    [components],
  );

  /**
   * Generate the complete page spec
   */
  const generatePageSpec = useCallback((): PageSpec => {
    return {
      version: "1.0.0",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      meta: {
        title: pageTitle,
        description: pageDescription || undefined,
      },
      theme,
      components,
    };
  }, [pageTitle, pageDescription, theme, components]);

  /**
   * Download the spec as JSON
   */
  const handleDownloadSpec = useCallback(() => {
    const spec = generatePageSpec();
    const blob = new Blob([JSON.stringify(spec, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `storefront-${storeId}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [generatePageSpec, storeId]);

  /**
   * Load a spec from JSON file
   */
  const handleLoadSpec = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const spec: PageSpec = JSON.parse(e.target?.result as string);

          // Validate basic structure
          if (!spec.version || !spec.components || !spec.theme) {
            throw new Error("Invalid spec format");
          }

          // Load the spec
          setPageTitle(spec.meta.title);
          setPageDescription(spec.meta.description || "");
          setTheme(spec.theme);
          setComponents(spec.components);
          setSelectedComponentId(null);
        } catch (error) {
          alert("Failed to load spec: " + (error as Error).message);
        }
      };
      reader.readAsText(file);
    },
    [],
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  const selectedComponent = components.find(
    (c) => c.id === selectedComponentId,
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-xl font-bold">Storefront Designer</h1>
            <p className="text-sm text-gray-600">Build your storefront page</p>
          </div>
        </div>

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

          {/* Theme Editor */}
          <Button
            variant="outline"
            onClick={() => setShowThemeEditor(!showThemeEditor)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Theme
          </Button>

          {/* Preview */}
          <Button variant="outline" onClick={() => setShowPreview(true)}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>

          {/* Load Spec */}
          <label>
            <input
              type="file"
              accept=".json"
              onChange={handleLoadSpec}
              className="hidden"
            />
            <Button variant="outline" asChild>
              <span className="cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                Load
              </span>
            </Button>
          </label>

          {/* Download Spec */}
          <Button onClick={handleDownloadSpec}>
            <Download className="h-4 w-4 mr-2" />
            Download Spec
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Component Sidebar */}
        <ComponentSidebar onAddComponent={handleAddComponent} />

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto p-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={components.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <CanvasArea
                components={components}
                selectedComponentId={selectedComponentId}
                onSelectComponent={setSelectedComponentId}
                onDeleteComponent={handleDeleteComponent}
                onDuplicateComponent={handleDuplicateComponent}
                viewMode={viewMode}
                theme={theme}
              />
            </SortableContext>
          </DndContext>
        </div>

        {/* Properties Panel */}
        {selectedComponent ? (
          <div className="w-80 bg-white border-l overflow-auto">
            <ComponentEditor
              component={selectedComponent}
              onUpdate={(data) =>
                handleUpdateComponent(selectedComponent.id, data)
              }
              onClose={() => setSelectedComponentId(null)}
            />
          </div>
        ) : showThemeEditor ? (
          <div className="w-80 bg-white border-l overflow-auto">
            <ThemeEditor
              theme={theme}
              onUpdate={setTheme}
              onClose={() => setShowThemeEditor(false)}
            />
          </div>
        ) : (
          <div className="w-80 bg-white border-l flex items-center justify-center p-8">
            <div className="text-center text-gray-500">
              <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm">
                Select a component to edit its properties
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Preview Dialog */}
      <PreviewDialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
        spec={generatePageSpec()}
      />
    </div>
  );
}
