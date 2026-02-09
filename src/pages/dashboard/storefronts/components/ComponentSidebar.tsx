import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  Image,
  Type,
  Grid3x3,
  Repeat,
  Images,
  Space,
} from "lucide-react";

import { COMPONENT_REGISTRY } from "@/lib/storefrontComponentsRegistry";
import type { ComponentType } from "@/types/storefront.design";

interface ComponentSidebarProps {
  onAddComponent: (type: ComponentType) => void;
}

// Icon mapping
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  Image,
  Type,
  Grid3x3,
  Repeat,
  Images,
  Space,
};

/**
 * Sidebar showing all available components
 * Click to add component to canvas
 */
export function ComponentSidebar({ onAddComponent }: ComponentSidebarProps) {
  const components = Object.values(COMPONENT_REGISTRY);

  return (
    <div className="w-64 bg-white border-r overflow-auto">
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">Components</h2>

        <div className="space-y-2">
          {components.map((component) => {
            const Icon = ICON_MAP[component.icon] || Sparkles;

            return (
              <Card
                key={component.type}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onAddComponent(component.type)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm">{component.label}</h3>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {component.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Tips */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-sm mb-2">💡 Quick Tips</h3>
          <ul className="text-xs text-gray-700 space-y-1">
            <li>• Click a component to add it</li>
            <li>• Drag to reorder components</li>
            <li>• Click to edit properties</li>
            <li>• Download spec when done</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
