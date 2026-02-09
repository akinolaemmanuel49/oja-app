/**
 * Component Registry
 *
 * Defines all available components for the storefront builder,
 * including their default configurations and metadata.
 */

import { v4 as uuidv4 } from "uuid";
import type {
  ComponentDefinition,
  ComponentType,
  PageComponent,
} from "../types/storefront.design";

// ============================================================================
// COMPONENT DEFINITIONS
// ============================================================================

export const COMPONENT_REGISTRY: Record<ComponentType, ComponentDefinition> = {
  hero: {
    type: "hero",
    label: "Hero Section",
    icon: "Sparkles",
    description:
      "Large header section with title, subtitle, and optional background image",
    defaultData: {
      title: "Welcome to Our Store",
      subtitle: "Discover amazing products",
      height: "large",
      textAlign: "center",
      textColor: "#ffffff",
      backgroundColor: "#1e293b",
      overlay: {
        enabled: true,
        color: "#000000",
        opacity: 40,
      },
      cta: {
        enabled: true,
        text: "Shop Now",
        url: "/products",
        style: "primary",
      },
    },
  },

  banner: {
    type: "banner",
    label: "Image Banner",
    icon: "Image",
    description: "Rotating image carousel/banner",
    defaultData: {
      images: [],
      autoPlay: true,
      interval: 5000,
      height: "medium",
      showDots: true,
      showArrows: true,
    },
  },

  text: {
    type: "text",
    label: "Text Block",
    icon: "Type",
    description: "Rich text content block",
    defaultData: {
      content: "<p>Add your content here...</p>",
      maxWidth: "medium",
      textAlign: "left",
      padding: "medium",
    },
  },

  product_grid: {
    type: "product_grid",
    label: "Product Grid",
    icon: "Grid3x3",
    description: "Grid layout of products",
    defaultData: {
      title: "Featured Products",
      columns: 4,
      limit: 12,
      sortOrder: "newest_first",
      showPrice: true,
      showSku: false,
      showAddToCart: false,
      cardStyle: "shadow",
      spacing: "normal",
    },
  },

  product_carousel: {
    type: "product_carousel",
    label: "Product Carousel",
    icon: "Repeat",
    description: "Horizontal scrolling product carousel",
    defaultData: {
      title: "New Arrivals",
      limit: 10,
      sortOrder: "newest_first",
      itemsPerView: 4,
      showPrice: true,
      showSku: false,
      autoPlay: false,
      interval: 5000,
    },
  },

  image_gallery: {
    type: "image_gallery",
    label: "Image Gallery",
    icon: "Images",
    description: "Grid or masonry layout of images",
    defaultData: {
      images: [],
      layout: "grid",
      columns: 3,
      gap: "medium",
    },
  },

  spacer: {
    type: "spacer",
    label: "Spacer",
    icon: "Space",
    description: "Vertical spacing between sections",
    defaultData: {
      height: "medium",
    },
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Create a new component with default data
 */
export function createComponent(
  type: ComponentType,
  order: number,
): PageComponent {
  const definition = COMPONENT_REGISTRY[type];

  return {
    id: uuidv4(),
    type,
    order,
    data: { ...definition.defaultData },
  } as PageComponent;
}

/**
 * Get component definition by type
 */
export function getComponentDefinition(
  type: ComponentType,
): ComponentDefinition {
  return COMPONENT_REGISTRY[type];
}

/**
 * Get all component types for the sidebar
 */
export function getAvailableComponents(): ComponentDefinition[] {
  return Object.values(COMPONENT_REGISTRY);
}

// ============================================================================
// DEFAULT THEME
// ============================================================================

export const DEFAULT_THEME = {
  colors: {
    primary: "#3b82f6",
    secondary: "#8b5cf6",
    accent: "#f59e0b",
    background: "#ffffff",
    text: "#1f2937",
    textSecondary: "#6b7280",
  },
  fonts: {
    heading: "system-ui, -apple-system, sans-serif",
    body: "system-ui, -apple-system, sans-serif",
  },
  borderRadius: "medium" as const,
};

// ============================================================================
// STARTER TEMPLATES
// ============================================================================

/**
 * Pre-built page templates for quick start
 */
export const PAGE_TEMPLATES = {
  blank: {
    name: "Blank Page",
    description: "Start from scratch",
    components: [],
  },

  ecommerce: {
    name: "E-commerce Home",
    description: "Hero + Product Grid + Text",
    components: [
      createComponent("hero", 0),
      createComponent("product_grid", 1),
      createComponent("spacer", 2),
      createComponent("text", 3),
    ],
  },

  gallery: {
    name: "Gallery Page",
    description: "Hero + Image Gallery",
    components: [
      createComponent("hero", 0),
      createComponent("spacer", 1),
      createComponent("image_gallery", 2),
    ],
  },
};
