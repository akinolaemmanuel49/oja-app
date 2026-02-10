import type {
  PageSpec,
  PageComponent,
  ThemeConfig,
} from "@/types/storefront.design";
import { Package, SlidersHorizontal, ShoppingCart } from "lucide-react";

interface StorefrontRendererProps {
  spec: PageSpec;
}

/**
 * Production renderer — takes a PageSpec and turns it into HTML.
 * Used by the preview dialog and will be used by the storefront app.
 * Product data for product_grid / product_carousel / related_products etc.
 * will be injected by the storefront app at runtime; here we render placeholders.
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
      {[...spec.components]
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

// ============================================================================
// DISPATCHER
// ============================================================================

function ComponentRenderer({
  component,
  theme,
}: {
  component: PageComponent;
  theme: ThemeConfig;
}) {
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
    case "products_header":
      return <ProductsHeaderRenderer component={component} theme={theme} />;
    case "products_filter_bar":
      return <ProductsFilterBarRenderer component={component} theme={theme} />;
    case "product_images":
      return <ProductImagesRenderer component={component} theme={theme} />;
    case "product_info":
      return <ProductInfoRenderer component={component} theme={theme} />;
    case "product_tabs":
      return <ProductTabsRenderer component={component} />;
    case "related_products":
      return <RelatedProductsRenderer component={component} theme={theme} />;
    default:
      return null;
  }
}

// ============================================================================
// SHARED RENDERERS
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
  const br = getBorderRadius(theme.borderRadius);

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
      {data.overlay?.enabled && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: data.overlay.color,
            opacity: data.overlay.opacity / 100,
          }}
        />
      )}
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
              borderRadius: br,
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
  const img = data.images[0];
  return (
    <div className="relative" style={{ height: heightMap[data.height] }}>
      {img.link ? (
        <a href={img.link}>
          <img
            src={img.url}
            alt={img.alt ?? "Banner"}
            className="w-full h-full object-cover"
          />
        </a>
      ) : (
        <img
          src={img.url}
          alt={img.alt ?? "Banner"}
          className="w-full h-full object-cover"
        />
      )}
      {data.images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {data.images.map((_, i) => (
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
  const br = getBorderRadius(theme.borderRadius);
  return (
    <div
      style={{
        backgroundColor: data.backgroundColor ?? "transparent",
        padding: paddingMap[data.padding],
        borderRadius: data.backgroundColor ? br : undefined,
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
  const br = getBorderRadius(theme.borderRadius);
  return (
    <div className="px-4 md:px-8 py-8">
      {data.title && (
        <h2
          className="text-3xl font-bold mb-6"
          style={{ color: theme.colors.text, fontFamily: theme.fonts.heading }}
        >
          {data.title}
        </h2>
      )}
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${data.columns}, 1fr)`,
          gap: spacingMap[data.spacing],
        }}
      >
        {Array.from({ length: Math.min(data.limit, 8) }).map((_, i) => (
          <div
            key={i}
            className={`overflow-hidden transition-all hover:scale-105 ${data.cardStyle === "bordered" ? "border" : data.cardStyle === "shadow" ? "shadow-lg" : ""}`}
            style={{ borderRadius: br }}
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
      <p className="text-sm text-gray-400 mt-6 text-center">
        Sort: {data.sortOrder.replace(/_/g, " ")}
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
  const br = getBorderRadius(theme.borderRadius);
  return (
    <div className="px-4 md:px-8 py-8">
      {data.title && (
        <h2
          className="text-3xl font-bold mb-6"
          style={{ color: theme.colors.text, fontFamily: theme.fonts.heading }}
        >
          {data.title}
        </h2>
      )}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {Array.from({ length: Math.min(data.limit, data.itemsPerView) }).map(
          (_, i) => (
            <div
              key={i}
              className="shrink-0 shadow-lg overflow-hidden hover:scale-105 transition-all"
              style={{
                width: `${100 / data.itemsPerView - 1}%`,
                minWidth: "200px",
                borderRadius: br,
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
          ),
        )}
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
  const br = getBorderRadius(theme.borderRadius);
  if (data.images.length === 0)
    return (
      <div className="px-4 md:px-8 py-8 text-center text-gray-500">
        <p>No gallery images</p>
      </div>
    );
  return (
    <div className="px-4 md:px-8 py-8">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${data.columns}, 1fr)`,
          gap: gapMap[data.gap],
        }}
      >
        {data.images.map((img, i) => (
          <div key={i} className="overflow-hidden" style={{ borderRadius: br }}>
            <img
              src={img.url}
              alt={img.alt ?? `Gallery ${i + 1}`}
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
  const heightMap = {
    small: "1rem",
    medium: "2rem",
    large: "4rem",
    xlarge: "6rem",
  };
  return <div style={{ height: heightMap[component.data.height] }} />;
}

// ============================================================================
// PRODUCTS PAGE RENDERERS
// ============================================================================

function ProductsHeaderRenderer({
  component,
  theme,
}: {
  component: Extract<PageComponent, { type: "products_header" }>;
  theme: ThemeConfig;
}) {
  const { data } = component;
  return (
    <div className="px-4 md:px-8 py-6">
      <h1
        className="text-4xl font-bold mb-1"
        style={{ color: theme.colors.text, fontFamily: theme.fonts.heading }}
      >
        {data.title}
      </h1>
      {data.subtitle && (
        <p className="text-lg text-gray-500 mb-4">{data.subtitle}</p>
      )}
      <div className="flex items-center justify-between mt-4">
        {data.showResultCount && (
          <span className="text-sm text-gray-500">Showing 24 products</span>
        )}
        {data.showSortDropdown && (
          <div className="flex items-center gap-2 border rounded px-4 py-2 bg-white text-sm cursor-pointer hover:bg-gray-50">
            <SlidersHorizontal className="h-4 w-4 text-gray-400" />
            <span>{data.defaultSortOrder.replace(/_/g, " ")}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductsFilterBarRenderer({
  component,
  theme,
}: {
  component: Extract<PageComponent, { type: "products_filter_bar" }>;
  theme: ThemeConfig;
}) {
  const { data } = component;
  return (
    <div
      className={`px-4 md:px-8 py-4 border-y flex ${data.filterPosition === "side" ? "flex-col gap-3" : "flex-row flex-wrap gap-3 items-center"} bg-gray-50 ${data.sticky ? "sticky top-0 z-10" : ""}`}
    >
      <span className="text-sm font-medium text-gray-700">Filters:</span>
      {data.showPriceFilter && (
        <button
          className="flex items-center gap-2 px-4 py-2 border rounded bg-white text-sm hover:bg-gray-50"
          style={{ borderRadius: getBorderRadius(theme.borderRadius) }}
        >
          Price Range
        </button>
      )}
      {data.showTypeFilter && (
        <button
          className="flex items-center gap-2 px-4 py-2 border rounded bg-white text-sm hover:bg-gray-50"
          style={{ borderRadius: getBorderRadius(theme.borderRadius) }}
        >
          Product Type
        </button>
      )}
    </div>
  );
}

// ============================================================================
// PRODUCT DETAIL RENDERERS
// ============================================================================

function ProductImagesRenderer({
  component,
  theme,
}: {
  component: Extract<PageComponent, { type: "product_images" }>;
  theme: ThemeConfig;
}) {
  const { data } = component;
  const aspectMap = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    landscape: "aspect-video",
  };
  const br = getBorderRadius(theme.borderRadius);

  return (
    <div
      className={`flex ${data.thumbnailPosition === "left" && data.showThumbnails ? "flex-row gap-4" : "flex-col gap-4"} px-4 md:px-8 py-8`}
    >
      {/* Thumbnails on left */}
      {data.showThumbnails && data.thumbnailPosition === "left" && (
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-16 h-16 bg-gray-200 cursor-pointer border-2 hover:border-blue-400 transition-colors"
              style={{ borderRadius: br }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-6 w-6 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main image */}
      <div
        className={`flex-1 bg-gray-200 flex items-center justify-center ${aspectMap[data.mainImageAspect]} ${data.zoomOnHover ? "overflow-hidden group" : ""}`}
        style={{ borderRadius: br }}
      >
        <Package
          className={`h-24 w-24 text-gray-400 ${data.zoomOnHover ? "transition-transform group-hover:scale-110" : ""}`}
        />
      </div>

      {/* Thumbnails on bottom */}
      {data.showThumbnails && data.thumbnailPosition === "bottom" && (
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-16 h-16 bg-gray-200 cursor-pointer border-2 hover:border-blue-400 transition-colors flex items-center justify-center"
              style={{ borderRadius: br }}
            >
              <Package className="h-6 w-6 text-gray-400" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductInfoRenderer({
  component,
  theme,
}: {
  component: Extract<PageComponent, { type: "product_info" }>;
  theme: ThemeConfig;
}) {
  const { data } = component;
  const br = getBorderRadius(theme.borderRadius);

  return (
    <div className="px-4 md:px-8 py-8 space-y-4">
      <div>
        <h1
          className="text-3xl font-bold"
          style={{ color: theme.colors.text, fontFamily: theme.fonts.heading }}
        >
          Sample Product Name
        </h1>
        {data.showSku && (
          <p className="text-sm text-gray-400 mt-1">SKU: PROD-001</p>
        )}
        {data.pricePosition === "below_name" && (
          <p
            className="text-2xl font-bold mt-2"
            style={{ color: theme.colors.primary }}
          >
            ₦12,500
          </p>
        )}
      </div>

      {data.showStockStatus && (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
          In Stock
        </span>
      )}

      {data.showVariantSelector && (
        <div>
          <p className="text-sm font-medium mb-2">Select Variant</p>
          {data.variantSelectorStyle === "buttons" ? (
            <div className="flex gap-2 flex-wrap">
              {["Small", "Medium", "Large", "XL"].map((v) => (
                <button
                  key={v}
                  className="px-4 py-2 border-2 text-sm font-medium hover:border-blue-500 transition-colors"
                  style={{ borderRadius: br }}
                >
                  {v}
                </button>
              ))}
            </div>
          ) : (
            <select
              className="border rounded px-3 py-2 text-sm w-full"
              style={{ borderRadius: br }}
            >
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
            </select>
          )}
        </div>
      )}

      {data.showQuantitySelector && (
        <div>
          <p className="text-sm font-medium mb-2">Quantity</p>
          <div className="flex items-center gap-2">
            <button
              className="w-8 h-8 border rounded flex items-center justify-center font-bold"
              style={{ borderRadius: br }}
            >
              −
            </button>
            <span className="w-12 text-center">1</span>
            <button
              className="w-8 h-8 border rounded flex items-center justify-center font-bold"
              style={{ borderRadius: br }}
            >
              +
            </button>
          </div>
        </div>
      )}

      {data.pricePosition === "above_cart" && (
        <p
          className="text-2xl font-bold"
          style={{ color: theme.colors.primary }}
        >
          ₦12,500
        </p>
      )}

      <button
        className="w-full py-4 font-semibold text-white flex items-center justify-center gap-3 text-lg transition-all hover:opacity-90"
        style={{ backgroundColor: theme.colors.primary, borderRadius: br }}
      >
        <ShoppingCart className="h-5 w-5" />
        {data.addToCartButtonText}
      </button>
    </div>
  );
}

function ProductTabsRenderer({
  component,
}: {
  component: Extract<PageComponent, { type: "product_tabs" }>;
}) {
  const { data } = component;
  const enabledTabs = data.tabs.filter((t) => t.enabled);
  const activeTab =
    enabledTabs.find((t) => t.id === data.defaultTab) ?? enabledTabs[0];

  const tabBtnClass = (isActive: boolean) => {
    const base = "px-4 py-2.5 text-sm font-medium transition-colors ";
    if (data.tabStyle === "underline")
      return (
        base +
        `border-b-2 ${isActive ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`
      );
    if (data.tabStyle === "pills")
      return (
        base +
        `rounded-full ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:bg-gray-100"}`
      );
    return (
      base +
      `border ${isActive ? "bg-white border-b-white -mb-px z-10 relative" : "bg-gray-50 text-gray-500"}`
    );
  };

  return (
    <div className="px-4 md:px-8 py-8">
      <div
        className={`flex ${data.tabStyle === "pills" ? "gap-2 p-1 bg-gray-100 rounded-full w-fit" : "border-b"}`}
      >
        {enabledTabs.map((tab) => (
          <button
            key={tab.id}
            className={tabBtnClass(tab.id === activeTab?.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab && (
        <div
          className={`${data.tabStyle === "boxed" ? "border border-t-0 rounded-b p-6" : "pt-6"}`}
        >
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: activeTab.content }}
          />
        </div>
      )}
    </div>
  );
}

function RelatedProductsRenderer({
  component,
  theme,
}: {
  component: Extract<PageComponent, { type: "related_products" }>;
  theme: ThemeConfig;
}) {
  const { data } = component;
  const br = getBorderRadius(theme.borderRadius);
  return (
    <div className="px-4 md:px-8 py-8 border-t">
      <h2
        className="text-3xl font-bold mb-6"
        style={{ color: theme.colors.text, fontFamily: theme.fonts.heading }}
      >
        {data.title}
      </h2>
      <div
        className="grid gap-6"
        style={{ gridTemplateColumns: `repeat(${data.columns}, 1fr)` }}
      >
        {Array.from({ length: Math.min(data.limit, data.columns) }).map(
          (_, i) => (
            <div
              key={i}
              className={`overflow-hidden hover:scale-105 transition-all cursor-pointer ${data.cardStyle === "shadow" ? "shadow-lg" : data.cardStyle === "bordered" ? "border" : ""}`}
              style={{ borderRadius: br }}
            >
              <div className="aspect-square bg-gray-200 flex items-center justify-center">
                <Package className="h-14 w-14 text-gray-400" />
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-1">Related Product {i + 1}</h3>
                <p
                  className="font-bold"
                  style={{ color: theme.colors.primary }}
                >
                  ₦{((i + 1) * 2000).toLocaleString()}
                </p>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

// ============================================================================
// UTIL
// ============================================================================

function getBorderRadius(r: ThemeConfig["borderRadius"]): string {
  return { none: "0", small: "0.25rem", medium: "0.5rem", large: "1rem" }[r];
}
