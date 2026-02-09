import type {
  PageSpec,
  PageComponent,
  ThemeConfig,
} from "@/types/storefront.design";
import { Package } from "lucide-react";

interface StorefrontRendererProps {
  spec: PageSpec;
}

/**
 * Renders a complete page from a spec
 * This is the production renderer that the actual storefront will use
 */
export function StorefrontRenderer({ spec }: StorefrontRendererProps) {
  return (
    <div
      style={{
        fontFamily: spec.theme.fonts.body,
        color: spec.theme.colors.text,
        backgroundColor: spec.theme.colors.background,
      }}
    >
      {spec.components
        .sort((a, b) => a.order - b.order)
        .map((component) => (
          <ComponentRenderer
            key={component.id}
            component={component}
            theme={spec.theme}
          />
        ))}
    </div>
  );
}

interface ComponentRendererProps {
  component: PageComponent;
  theme: ThemeConfig;
}

function ComponentRenderer({ component, theme }: ComponentRendererProps) {
  switch (component.type) {
    case "hero":
      return <HeroRenderer component={component} theme={theme} />;
    case "banner":
      return <BannerRenderer component={component} />;
    case "text":
      return <TextRenderer component={component} theme={theme} />;
    case "product_grid":
      return <ProductGridRenderer component={component} theme={theme} />;
    case "product_carousel":
      return <ProductCarouselRenderer component={component} theme={theme} />;
    case "image_gallery":
      return <ImageGalleryRenderer component={component} theme={theme} />;
    case "spacer":
      return <SpacerRenderer component={component} />;
    default:
      return null;
  }
}

// ============================================================================
// COMPONENT RENDERERS
// ============================================================================

function HeroRenderer({
  component,
  theme,
}: {
  component: Extract<PageComponent, { type: "hero" }>;
  theme: ThemeConfig;
}) {
  const { data } = component;
  const heightMap = {
    small: "300px",
    medium: "500px",
    large: "700px",
    full: "100vh",
  };
  const borderRadius = getBorderRadius(theme.borderRadius);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        height: heightMap[data.height],
        backgroundColor: data.backgroundColor,
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
        className="relative z-10 px-8 max-w-4xl mx-auto"
        style={{
          color: data.textColor,
          textAlign: data.textAlign,
          fontFamily: theme.fonts.heading,
        }}
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-4">{data.title}</h1>
        {data.subtitle && (
          <p className="text-xl md:text-2xl mb-8 opacity-90">{data.subtitle}</p>
        )}
        {data.cta?.enabled && (
          <a
            href={data.cta.url}
            className="inline-block px-8 py-4 font-medium text-lg transition-all hover:scale-105"
            style={{
              backgroundColor: theme.colors.primary,
              color: "#ffffff",
              borderRadius,
            }}
          >
            {data.cta.text}
          </a>
        )}
      </div>
    </div>
  );
}

function BannerRenderer({
  component,
}: {
  component: Extract<PageComponent, { type: "banner" }>;
}) {
  const { data } = component;
  const heightMap = { small: "300px", medium: "500px", large: "700px" };

  if (data.images.length === 0) {
    return (
      <div
        className="bg-gray-200 flex items-center justify-center"
        style={{ height: heightMap[data.height] }}
      >
        <p className="text-gray-500">No banner images</p>
      </div>
    );
  }

  // Simple implementation: just show first image
  // In production, you'd use a carousel library
  const firstImage = data.images[0];

  return (
    <div className="relative" style={{ height: heightMap[data.height] }}>
      {firstImage.link ? (
        <a href={firstImage.link}>
          <img
            src={firstImage.url}
            alt={firstImage.alt || "Banner"}
            className="w-full h-full object-cover"
          />
        </a>
      ) : (
        <img
          src={firstImage.url}
          alt={firstImage.alt || "Banner"}
          className="w-full h-full object-cover"
        />
      )}

      {/* Indicator if multiple images */}
      {data.images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {data.images.map((_, i: number) => (
            <div key={i} className="w-2 h-2 rounded-full bg-white opacity-50" />
          ))}
        </div>
      )}
    </div>
  );
}

function TextRenderer({
  component,
  theme,
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
  const borderRadius = getBorderRadius(theme.borderRadius);

  return (
    <div
      style={{
        backgroundColor: data.backgroundColor || "transparent",
        padding: paddingMap[data.padding],
        borderRadius: data.backgroundColor ? borderRadius : undefined,
      }}
    >
      <div
        className="mx-auto prose prose-lg"
        style={{
          maxWidth: maxWidthMap[data.maxWidth],
          textAlign: data.textAlign,
        }}
        dangerouslySetInnerHTML={{ __html: data.content }}
      />
    </div>
  );
}

function ProductGridRenderer({
  component,
  theme,
}: {
  component: Extract<PageComponent, { type: "product_grid" }>;
  theme: ThemeConfig;
}) {
  const { data } = component;
  const spacingMap = { compact: "1rem", normal: "1.5rem", relaxed: "2rem" };
  const borderRadius = getBorderRadius(theme.borderRadius);

  return (
    <div className="px-4 md:px-8 py-8">
      {data.title && (
        <h2
          className="text-3xl font-bold mb-6"
          style={{
            color: theme.colors.text,
            fontFamily: theme.fonts.heading,
          }}
        >
          {data.title}
        </h2>
      )}

      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(auto-fill, minmax(${100 / data.columns}%, 1fr))`,
          gap: spacingMap[data.spacing],
        }}
      >
        {[...Array(Math.min(data.limit, 8))].map((_, i) => (
          <div
            key={i}
            className={`overflow-hidden transition-all hover:scale-105 ${
              data.cardStyle === "bordered"
                ? "border"
                : data.cardStyle === "shadow"
                  ? "shadow-lg"
                  : ""
            }`}
            style={{ borderRadius }}
          >
            <div className="aspect-square bg-gray-200 flex items-center justify-center">
              <Package className="h-16 w-16 text-gray-400" />
            </div>
            <div className="p-4">
              <h3 className="font-medium mb-1">Sample Product {i + 1}</h3>
              {data.showPrice && (
                <p
                  className="text-lg font-bold"
                  style={{ color: theme.colors.primary }}
                >
                  ₦{((i + 1) * 1000).toLocaleString()}
                </p>
              )}
              {data.showSku && (
                <p className="text-sm text-gray-500">
                  SKU: PROD-{String(i + 1).padStart(3, "0")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-500 mt-6 text-center">
        Showing sample products • Sort: {data.sortOrder.replace("_", " ")}
      </p>
    </div>
  );
}

function ProductCarouselRenderer({
  component,
  theme,
}: {
  component: Extract<PageComponent, { type: "product_carousel" }>;
  theme: ThemeConfig;
}) {
  const { data } = component;
  const borderRadius = getBorderRadius(theme.borderRadius);

  return (
    <div className="px-4 md:px-8 py-8">
      {data.title && (
        <h2
          className="text-3xl font-bold mb-6"
          style={{
            color: theme.colors.text,
            fontFamily: theme.fonts.heading,
          }}
        >
          {data.title}
        </h2>
      )}

      <div className="flex gap-4 overflow-x-auto pb-4">
        {[...Array(Math.min(data.limit, data.itemsPerView))].map((_, i) => (
          <div
            key={i}
            className="shrink-0 shadow-lg overflow-hidden transition-all hover:scale-105"
            style={{
              width: `${100 / data.itemsPerView - 1}%`,
              minWidth: "200px",
              borderRadius,
            }}
          >
            <div className="aspect-square bg-gray-200 flex items-center justify-center">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
            <div className="p-3">
              <h3 className="font-medium text-sm mb-1">Product {i + 1}</h3>
              {data.showPrice && (
                <p
                  className="font-bold"
                  style={{ color: theme.colors.primary }}
                >
                  ₦{((i + 1) * 1500).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImageGalleryRenderer({
  component,
  theme,
}: {
  component: Extract<PageComponent, { type: "image_gallery" }>;
  theme: ThemeConfig;
}) {
  const { data } = component;
  const gapMap = { small: "0.5rem", medium: "1rem", large: "2rem" };
  const borderRadius = getBorderRadius(theme.borderRadius);

  if (data.images.length === 0) {
    return (
      <div className="px-4 md:px-8 py-8 text-center text-gray-500">
        <p>No images in gallery</p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-8">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${data.columns}, 1fr)`,
          gap: gapMap[data.gap],
        }}
      >
        {data.images.map((img, i: number) => (
          <div key={i} className="overflow-hidden" style={{ borderRadius }}>
            <img
              src={img.url}
              alt={img.alt || `Gallery image ${i + 1}`}
              className="w-full h-full object-cover hover:scale-110 transition-transform"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function SpacerRenderer({
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

  return <div style={{ height: heightMap[data.height] }} />;
}

// ============================================================================
// UTILITIES
// ============================================================================

function getBorderRadius(radius: ThemeConfig["borderRadius"]): string {
  const map = { none: "0", small: "0.25rem", medium: "0.5rem", large: "1rem" };
  return map[radius];
}
