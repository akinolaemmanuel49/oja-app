/**
 * Storefront Design System - Type Definitions
 *
 * This defines the complete JSON schema for storefront pages.
 * The spec can be serialized/deserialized and used to render storefronts.
 */

// ============================================================================
// COMPONENT TYPES
// ============================================================================

export type ComponentType =
  | "hero"
  | "banner"
  | "text"
  | "product_grid"
  | "product_carousel"
  | "image_gallery"
  | "spacer";

// ============================================================================
// SORT/FILTER OPTIONS
// ============================================================================

export type ProductSortOrder =
  | "newest_first" // Created date DESC
  | "oldest_first" // Created date ASC
  | "price_low_high" // Price ASC
  | "price_high_low" // Price DESC
  | "name_a_z" // Name ASC
  | "name_z_a"; // Name DESC

// ============================================================================
// BASE COMPONENT INTERFACE
// ============================================================================

interface BaseComponent {
  id: string;
  type: ComponentType;
  order: number; // Position in the page (0-indexed)
}

// ============================================================================
// HERO COMPONENT
// ============================================================================

export interface HeroComponent extends BaseComponent {
  type: "hero";
  data: {
    title: string;
    subtitle?: string;
    backgroundImage?: string; // Cloudinary URL
    backgroundColor?: string; // Hex color
    height: "small" | "medium" | "large" | "full"; // 300px, 500px, 700px, 100vh
    textAlign: "left" | "center" | "right";
    textColor: string; // Hex color
    overlay?: {
      enabled: boolean;
      color: string; // Hex color
      opacity: number; // 0-100
    };
    cta?: {
      enabled: boolean;
      text: string;
      url: string;
      style: "primary" | "secondary" | "outline";
    };
  };
}

// ============================================================================
// BANNER COMPONENT (Image carousel/slideshow)
// ============================================================================

export interface BannerComponent extends BaseComponent {
  type: "banner";
  data: {
    images: Array<{
      url: string; // Cloudinary URL
      alt?: string;
      link?: string; // Optional click-through URL
    }>;
    autoPlay: boolean;
    interval: number; // Milliseconds (e.g., 5000 for 5 seconds)
    height: "small" | "medium" | "large"; // 300px, 500px, 700px
    showDots: boolean;
    showArrows: boolean;
  };
}

// ============================================================================
// TEXT COMPONENT (Rich text block)
// ============================================================================

export interface TextComponent extends BaseComponent {
  type: "text";
  data: {
    content: string; // HTML content (from rich text editor)
    maxWidth: "full" | "narrow" | "medium" | "wide"; // 100%, 640px, 768px, 1024px
    textAlign: "left" | "center" | "right";
    backgroundColor?: string; // Hex color
    padding: "none" | "small" | "medium" | "large"; // 0, 1rem, 2rem, 3rem
  };
}

// ============================================================================
// PRODUCT GRID COMPONENT
// ============================================================================

export interface ProductGridComponent extends BaseComponent {
  type: "product_grid";
  data: {
    title?: string;
    columns: 2 | 3 | 4 | 5 | 6; // Grid columns
    limit: number; // Max products to show
    sortOrder: ProductSortOrder;
    showPrice: boolean;
    showSku: boolean;
    showAddToCart: boolean; // Future: add to cart button
    cardStyle: "minimal" | "bordered" | "shadow";
    spacing: "compact" | "normal" | "relaxed"; // Gap between cards
  };
}

// ============================================================================
// PRODUCT CAROUSEL COMPONENT
// ============================================================================

export interface ProductCarouselComponent extends BaseComponent {
  type: "product_carousel";
  data: {
    title?: string;
    limit: number; // Max products to show
    sortOrder: ProductSortOrder;
    itemsPerView: 2 | 3 | 4 | 5; // How many products visible at once
    showPrice: boolean;
    showSku: boolean;
    autoPlay: boolean;
    interval: number; // Milliseconds
  };
}

// ============================================================================
// IMAGE GALLERY COMPONENT
// ============================================================================

export interface ImageGalleryComponent extends BaseComponent {
  type: "image_gallery";
  data: {
    images: Array<{
      url: string; // Cloudinary URL
      alt?: string;
      caption?: string;
    }>;
    layout: "grid" | "masonry";
    columns: 2 | 3 | 4;
    gap: "small" | "medium" | "large"; // 0.5rem, 1rem, 2rem
  };
}

// ============================================================================
// SPACER COMPONENT
// ============================================================================

export interface SpacerComponent extends BaseComponent {
  type: "spacer";
  data: {
    height: "small" | "medium" | "large" | "xlarge"; // 1rem, 2rem, 4rem, 6rem
  };
}

// ============================================================================
// UNION TYPE FOR ALL COMPONENTS
// ============================================================================

export type PageComponent =
  | HeroComponent
  | BannerComponent
  | TextComponent
  | ProductGridComponent
  | ProductCarouselComponent
  | ImageGalleryComponent
  | SpacerComponent;

// ============================================================================
// THEME CONFIGURATION
// ============================================================================

export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    textSecondary: string;
  };
  fonts: {
    heading: string; // Font family for headings
    body: string; // Font family for body text
  };
  borderRadius: "none" | "small" | "medium" | "large"; // 0, 0.25rem, 0.5rem, 1rem
}

// ============================================================================
// PAGE SPEC (Complete page definition)
// ============================================================================

export interface PageSpec {
  version: string; // Spec version (e.g., "1.0.0")
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  meta: {
    title: string; // Page title
    description?: string; // Page description
  };
  theme: ThemeConfig;
  components: PageComponent[];
}

// ============================================================================
// STOREFRONT DESIGN (Complete storefront with multiple pages)
// ============================================================================

export interface StorefrontDesign {
  version: string; // Design system version
  storefrontId: string; // UUID of the storefront
  storefrontName: string;
  pages: {
    home: PageSpec;
    // Future: about, contact, custom pages
  };
}

// ============================================================================
// HELPER TYPES FOR BUILDER UI
// ============================================================================

export interface ComponentDefinition {
  type: ComponentType;
  label: string;
  icon: string; // Lucide icon name
  description: string;
  defaultData: PageComponent["data"];
}

export interface DragItem {
  type: ComponentType;
  index?: number; // If dragging existing component
}
