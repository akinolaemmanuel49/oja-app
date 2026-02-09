import type { PageComponent, ThemeConfig } from "@/types/storefront.design";
import { Package, Image as ImageIcon } from "lucide-react";

interface ComponentPreviewProps {
  component: PageComponent;
  theme: ThemeConfig;
}

/**
 * Renders a visual preview of a component
 * (Simplified version for the builder canvas)
 */
export function ComponentPreview({ component, theme }: ComponentPreviewProps) {
  switch (component.type) {
    case "hero":
      return <HeroPreview component={component} theme={theme} />;
    case "banner":
      return <BannerPreview component={component} theme={theme} />;
    case "text":
      return <TextPreview component={component} theme={theme} />;
    case "product_grid":
      return <ProductGridPreview component={component} theme={theme} />;
    case "product_carousel":
      return <ProductCarouselPreview component={component} theme={theme} />;
    case "image_gallery":
      return <ImageGalleryPreview component={component} theme={theme} />;
    case "spacer":
      return <SpacerPreview component={component} />;
    default:
      // Exhaustive check (good practice)
      return <div>Unknown component type</div>;
  }
}

// ============================================================================
// INDIVIDUAL COMPONENT PREVIEWS
// ============================================================================

function HeroPreview({
  component,
  theme,
}: {
  component: Extract<PageComponent, { type: "hero" }>;
  theme: ThemeConfig;
}) {
  const { data } = component;
  const heightMap = {
    small: "200px",
    medium: "300px",
    large: "400px",
    full: "500px",
  };

  return (
    <div
      className="relative flex items-center justify-center rounded overflow-hidden"
      style={{
        height: heightMap[data.height],
        backgroundColor: data.backgroundColor || theme.colors.primary,
        backgroundImage: data.backgroundImage
          ? `url(${data.backgroundImage})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      {data.overlay?.enabled && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: data.overlay.color,
            opacity: data.overlay.opacity / 100,
          }}
        />
      )}

      {/* Content */}
      <div
        className="relative z-10 text-center px-8"
        style={{ color: data.textColor, textAlign: data.textAlign }}
      >
        <h1 className="text-4xl font-bold mb-2">{data.title}</h1>
        {data.subtitle && <p className="text-lg mb-4">{data.subtitle}</p>}
        {data.cta?.enabled && (
          <button
            className="px-6 py-2 rounded font-medium"
            style={{
              backgroundColor: theme.colors.primary,
              color: "#ffffff",
            }}
          >
            {data.cta.text}
          </button>
        )}
      </div>
    </div>
  );
}

function BannerPreview({
  component,
}: {
  component: Extract<PageComponent, { type: "banner" }>;
  theme: ThemeConfig;
}) {
  const { data } = component;
  const heightMap = { small: "200px", medium: "300px", large: "400px" };

  return (
    <div
      className="relative rounded overflow-hidden bg-gray-200 flex items-center justify-center"
      style={{ height: heightMap[data.height] }}
    >
      {data.images.length > 0 ? (
        <img
          src={data.images[0].url}
          alt={data.images[0].alt || "Banner"}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="text-center text-gray-500">
          <ImageIcon className="h-12 w-12 mx-auto mb-2" />
          <p className="text-sm">No images added</p>
          <p className="text-xs">Add images in the properties panel →</p>
        </div>
      )}

      {/* Image count indicator */}
      {data.images.length > 1 && (
        <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {data.images.length} images
        </div>
      )}
    </div>
  );
}

function TextPreview({
  component,
}: {
  component: Extract<PageComponent, { type: "text" }>;
  theme: ThemeConfig;
}) {
  const { data } = component;
  const maxWidthMap = {
    full: "100%",
    narrow: "640px",
    medium: "768px",
    wide: "1024px",
  };
  const paddingMap = {
    none: "0",
    small: "1rem",
    medium: "2rem",
    large: "3rem",
  };

  return (
    <div
      className="rounded"
      style={{
        backgroundColor: data.backgroundColor || "transparent",
        padding: paddingMap[data.padding],
      }}
    >
      <div
        className="mx-auto prose prose-sm"
        style={{
          maxWidth: maxWidthMap[data.maxWidth],
          textAlign: data.textAlign,
        }}
        dangerouslySetInnerHTML={{ __html: data.content }}
      />
    </div>
  );
}

function ProductGridPreview({
  component,
  theme,
}: {
  component: Extract<PageComponent, { type: "product_grid" }>;
  theme: ThemeConfig;
}) {
  const { data } = component;

  return (
    <div>
      {data.title && (
        <h2
          className="text-2xl font-bold mb-4"
          style={{ color: theme.colors.text }}
        >
          {data.title}
        </h2>
      )}

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${data.columns}, 1fr)` }}
      >
        {[...Array(Math.min(data.limit, 6))].map((_, i) => (
          <div
            key={i}
            className={`rounded overflow-hidden ${
              data.cardStyle === "bordered"
                ? "border"
                : data.cardStyle === "shadow"
                  ? "shadow"
                  : ""
            }`}
          >
            <div className="aspect-square bg-gray-200 flex items-center justify-center">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <div className="p-3">
              <div className="h-4 bg-gray-200 rounded mb-2" />
              {data.showPrice && (
                <div className="h-3 bg-gray-100 rounded w-16" />
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Showing {Math.min(data.limit, 6)} of {data.limit} products • Sort:{" "}
        {data.sortOrder.replace("_", " ")}
      </p>
    </div>
  );
}

function ProductCarouselPreview({
  component,
  theme,
}: {
  component: Extract<PageComponent, { type: "product_carousel" }>;
  theme: ThemeConfig;
}) {
  const { data } = component;

  return (
    <div>
      {data.title && (
        <h2
          className="text-2xl font-bold mb-4"
          style={{ color: theme.colors.text }}
        >
          {data.title}
        </h2>
      )}

      <div className="flex gap-4 overflow-hidden">
        {[...Array(data.itemsPerView)].map((_, i) => (
          <div
            key={i}
            className="shrink-0"
            style={{ width: `${100 / data.itemsPerView}%` }}
          >
            <div className="rounded shadow overflow-hidden">
              <div className="aspect-square bg-gray-200 flex items-center justify-center">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <div className="p-3">
                <div className="h-4 bg-gray-200 rounded mb-2" />
                {data.showPrice && (
                  <div className="h-3 bg-gray-100 rounded w-16" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-4">
        {data.itemsPerView} visible • {data.limit} total •{" "}
        {data.autoPlay ? "Auto-play" : "Manual"}
      </p>
    </div>
  );
}

function ImageGalleryPreview({
  component,
}: {
  component: Extract<PageComponent, { type: "image_gallery" }>;
  theme: ThemeConfig;
}) {
  const { data } = component;
  const gapMap = { small: "0.5rem", medium: "1rem", large: "2rem" };

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${data.columns}, 1fr)`,
        gap: gapMap[data.gap],
      }}
    >
      {data.images.length > 0
        ? data.images.slice(0, 6).map((img, i: number) => (
            <div key={i} className="aspect-square rounded overflow-hidden">
              <img
                src={img.url}
                alt={img.alt || ""}
                className="w-full h-full object-cover"
              />
            </div>
          ))
        : [...Array(data.columns)].map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-gray-200 rounded flex items-center justify-center"
            >
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>
          ))}
    </div>
  );
}

function SpacerPreview({
  component,
}: {
  component: Extract<PageComponent, { type: "spacer" }>;
}) {
  const { data } = component;
  const heightMap = {
    small: "1rem",
    medium: "2rem",
    large: "4rem",
    xlarge: "6rem",
  };

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded flex items-center justify-center"
      style={{ height: heightMap[data.height] }}
    >
      <span className="text-xs text-gray-400">Spacer ({data.height})</span>
    </div>
  );
}
