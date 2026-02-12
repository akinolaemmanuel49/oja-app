import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import type {
  PageSpec,
  PageComponent,
  ThemeConfig,
} from "@/types/storefront.design";
import type { StorefrontProduct } from "@/types/storefront.product";
import {
  Package,
  SlidersHorizontal,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_PRODUCTS } from "@/mocks/storefront.products";

// ============================================================================
// PROPS INTERFACE
// ============================================================================

interface StorefrontRendererProps {
  spec: PageSpec;
  /** Actual storefront products from API */
  storefrontProducts?: StorefrontProduct[];
  /** Storefront ID for navigation */
  storefrontId?: string;
}

/**
 * Production renderer with mock/real data toggle, navigation, pagination, and filters.
 */
export function StorefrontRenderer({
  spec,
  storefrontProducts = [],
  storefrontId,
}: StorefrontRendererProps) {
  const [useMockData, setUseMockData] = useState(
    storefrontProducts.length === 0,
  );

  // Switch to real data automatically when products are available
  const products = useMockData ? MOCK_PRODUCTS : storefrontProducts;

  return (
    <div
      style={{
        fontFamily: spec.theme.fonts.body,
        color: spec.theme.colors.text,
        backgroundColor: spec.theme.colors.background,
      }}
    >
      {/* Mock data toggle - only show if we have real data available */}
      {storefrontProducts.length > 0 && (
        <div className="px-4 py-3 bg-yellow-50 border-b border-yellow-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium text-yellow-900">
              Data Source:
            </Label>
            <Switch
              checked={useMockData}
              onCheckedChange={setUseMockData}
              className="bg-yellow-300 data-[state=checked]:bg-yellow-600"
            />
            <span className="text-sm text-yellow-900">
              {useMockData ? "Mock Data" : "Real Data"} ({products.length}{" "}
              products)
            </span>
          </div>
        </div>
      )}

      {[...spec.components]
        .sort((a, b) => a.order - b.order)
        .map((component) => (
          <ComponentRenderer
            key={component.id}
            component={component}
            theme={spec.theme}
            products={products}
            storefrontId={storefrontId}
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
  products,
  storefrontId,
}: {
  component: PageComponent;
  theme: ThemeConfig;
  products: StorefrontProduct[];
  storefrontId?: string;
}) {
  switch (component.type) {
    case "hero":
      return <HeroRenderer component={component} theme={theme} />;
    case "banner":
      return <BannerRenderer component={component} />;
    case "text":
      return <TextRenderer component={component} theme={theme} />;
    case "product_grid":
      return (
        <ProductGridRenderer
          component={component}
          theme={theme}
          products={products}
          storefrontId={storefrontId}
        />
      );
    case "product_carousel":
      return (
        <ProductCarouselRenderer
          component={component}
          theme={theme}
          products={products}
          storefrontId={storefrontId}
        />
      );
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
      return (
        <RelatedProductsRenderer
          component={component}
          theme={theme}
          products={products}
          storefrontId={storefrontId}
        />
      );
    default:
      return null;
  }
}

// ============================================================================
// SHARED RENDERERS (unchanged)
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
// PRODUCT COMPONENTS WITH REAL LOGIC
// ============================================================================

function ProductGridRenderer({
  component,
  theme,
  products,
  storefrontId,
}: {
  component: Extract<PageComponent, { type: "product_grid" }>;
  theme: ThemeConfig;
  products: StorefrontProduct[];
  storefrontId?: string;
}) {
  const { data } = component;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = data.limit;

  // Apply sorting
  const sortedProducts = useMemo(() => {
    const sorted = [...products].filter((p) => p.is_visible);

    switch (data.sortOrder) {
      case "newest_first":
        return sorted.sort(
          (a, b) => (b.display_order ?? 0) - (a.display_order ?? 0),
        );
      case "oldest_first":
        return sorted.sort(
          (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
        );
      case "price_low_high":
        return sorted.sort((a, b) => {
          const priceA =
            a.product_type === "simple"
              ? (a.base_price ?? 0)
              : Math.min(...(a.variants?.map((v) => v.price ?? 0) ?? [0]));
          const priceB =
            b.product_type === "simple"
              ? (b.base_price ?? 0)
              : Math.min(...(b.variants?.map((v) => v.price ?? 0) ?? [0]));
          return priceA - priceB;
        });
      case "price_high_low":
        return sorted.sort((a, b) => {
          const priceA =
            a.product_type === "simple"
              ? (a.base_price ?? 0)
              : Math.max(...(a.variants?.map((v) => v.price ?? 0) ?? [0]));
          const priceB =
            b.product_type === "simple"
              ? (b.base_price ?? 0)
              : Math.max(...(b.variants?.map((v) => v.price ?? 0) ?? [0]));
          return priceB - priceA;
        });
      case "name_a_z":
        return sorted.sort((a, b) =>
          a.product_name.localeCompare(b.product_name),
        );
      case "name_z_a":
        return sorted.sort((a, b) =>
          b.product_name.localeCompare(a.product_name),
        );
      default:
        return sorted;
    }
  }, [products, data.sortOrder]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const spacing = { compact: "gap-4", normal: "gap-6", relaxed: "gap-8" }[
    data.spacing
  ];
  const br = getBorderRadius(theme.borderRadius);

  return (
    <div className="px-4 md:px-8 py-10 md:py-12">
      {data.title && (
        <h2
          className="text-2xl md:text-3xl font-bold mb-6 md:mb-8"
          style={{ color: theme.colors.text, fontFamily: theme.fonts.heading }}
        >
          {data.title}
        </h2>
      )}

      <div
        className={`grid ${spacing}`}
        style={{
          gridTemplateColumns: `repeat(${data.columns}, minmax(0, 1fr))`,
        }}
      >
        {paginatedProducts.map((product) => (
          <ProductCard
            key={product.product_id}
            product={product}
            showPrice={data.showPrice}
            showSku={data.showSku}
            cardStyle={data.cardStyle}
            theme={theme}
            borderRadius={br}
            storefrontId={storefrontId}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="text-center mt-6 text-sm text-gray-500">
        Showing {paginatedProducts.length} of {sortedProducts.length} products •
        Sort: {data.sortOrder.replace(/_/g, " ")}
      </div>
    </div>
  );
}

function ProductCarouselRenderer({
  component,
  theme,
  products,
  storefrontId,
}: {
  component: Extract<PageComponent, { type: "product_carousel" }>;
  theme: ThemeConfig;
  products: StorefrontProduct[];
  storefrontId?: string;
}) {
  const { data } = component;
  const br = getBorderRadius(theme.borderRadius);

  const visibleProducts = products
    .filter((p) => p.is_visible)
    .slice(0, data.limit);

  return (
    <div className="px-4 md:px-8 py-10 md:py-12">
      {data.title && (
        <h2
          className="text-2xl md:text-3xl font-bold mb-6 md:mb-8"
          style={{ color: theme.colors.text, fontFamily: theme.fonts.heading }}
        >
          {data.title}
        </h2>
      )}

      <div className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory">
        {visibleProducts.map((product) => (
          <div
            key={product.product_id}
            className="shrink-0 w-[85%] sm:w-[45%] md:w-[32%] lg:w-[24%] snap-start"
          >
            <ProductCard
              product={product}
              showPrice={data.showPrice}
              showSku={data.showSku}
              cardStyle="shadow"
              theme={theme}
              borderRadius={br}
              storefrontId={storefrontId}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function RelatedProductsRenderer({
  component,
  theme,
  products,
  storefrontId,
}: {
  component: Extract<PageComponent, { type: "related_products" }>;
  theme: ThemeConfig;
  products: StorefrontProduct[];
  storefrontId?: string;
}) {
  const { data } = component;
  const br = getBorderRadius(theme.borderRadius);

  const visibleProducts = products
    .filter((p) => p.is_visible)
    .slice(0, data.limit);

  return (
    <div className="px-4 md:px-8 py-10 md:py-12 border-t">
      <h2
        className="text-2xl md:text-3xl font-bold mb-6 md:mb-8"
        style={{ color: theme.colors.text, fontFamily: theme.fonts.heading }}
      >
        {data.title}
      </h2>

      <div
        className="grid gap-6"
        style={{
          gridTemplateColumns: `repeat(${data.columns}, minmax(0, 1fr))`,
        }}
      >
        {visibleProducts.map((product) => (
          <ProductCard
            key={product.product_id}
            product={product}
            showPrice={true}
            showSku={false}
            cardStyle={data.cardStyle}
            theme={theme}
            borderRadius={br}
            storefrontId={storefrontId}
          />
        ))}
      </div>
    </div>
  );
}

function ProductCard({
  product,
  showPrice,
  showSku,
  cardStyle,
  theme,
  borderRadius,
  storefrontId,
}: {
  product: StorefrontProduct;
  showPrice: boolean;
  showSku: boolean;
  cardStyle: "minimal" | "bordered" | "shadow";
  theme: ThemeConfig;
  borderRadius: string;
  storefrontId?: string;
}) {
  const navigate = useNavigate();
  const hasVariants =
    product.product_type === "variable" &&
    product.variants &&
    product.variants.length > 0;
  const firstVariant = hasVariants ? product.variants![0] : null;

  const displayPrice = hasVariants ? firstVariant?.price : product.base_price;
  const displayImageUrl = hasVariants
    ? firstVariant?.main_image_url
    : product.main_image_url;

  const handleClick = () => {
    if (storefrontId) {
      navigate(`/storefronts/${storefrontId}/products/${product.product_id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "group block overflow-hidden transition-all duration-200 hover:-translate-y-1 bg-white cursor-pointer",
        cardStyle === "bordered" && "border border-gray-200",
        cardStyle === "shadow" && "shadow-md hover:shadow-xl",
      )}
      style={{ borderRadius }}
    >
      <div className="aspect-square relative bg-gray-50 overflow-hidden">
        {displayImageUrl ? (
          <img
            src={displayImageUrl}
            alt={product.product_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-16 w-16 text-gray-300" />
          </div>
        )}
      </div>

      <div className="p-4">
        <h3
          className="font-medium text-base md:text-lg mb-1.5 line-clamp-2 min-h-11"
          style={{ color: theme.colors.text }}
        >
          {product.product_name}
        </h3>

        {showPrice && displayPrice != null && (
          <p
            className="font-bold text-lg md:text-xl"
            style={{ color: theme.colors.primary }}
          >
            ₦{displayPrice.toLocaleString()}
          </p>
        )}

        {showSku && (product.sku || firstVariant?.sku) && (
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            SKU: {product.sku || firstVariant?.sku}
          </p>
        )}

        {hasVariants && (
          <p className="text-xs text-gray-500 mt-1 italic">
            Available in {product.variants!.length} variant
            {product.variants!.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// PRODUCTS PAGE RENDERERS WITH FILTERS
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
  const [priceRange, setPriceRange] = useState<string>("all");
  const [productType, setProductType] = useState<string>("all");

  return (
    <div
      className={`px-4 md:px-8 py-4 border-y flex ${data.filterPosition === "side" ? "flex-col gap-3" : "flex-row flex-wrap gap-3 items-center"} bg-gray-50 ${data.sticky ? "sticky top-0 z-10" : ""}`}
    >
      <span className="text-sm font-medium text-gray-700">Filters:</span>

      {data.showPriceFilter && (
        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger
            className="w-45 bg-white"
            style={{ borderRadius: getBorderRadius(theme.borderRadius) }}
          >
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="0-10000">₦0 - ₦10,000</SelectItem>
            <SelectItem value="10000-50000">₦10,000 - ₦50,000</SelectItem>
            <SelectItem value="50000-100000">₦50,000 - ₦100,000</SelectItem>
            <SelectItem value="100000+">₦100,000+</SelectItem>
          </SelectContent>
        </Select>
      )}

      {data.showTypeFilter && (
        <Select value={productType} onValueChange={setProductType}>
          <SelectTrigger
            className="w-45 bg-white"
            style={{ borderRadius: getBorderRadius(theme.borderRadius) }}
          >
            <SelectValue placeholder="Product Type" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="simple">Simple</SelectItem>
            <SelectItem value="variable">Variable</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

// ============================================================================
// PRODUCT DETAIL RENDERERS WITH VARIANT SELECTION
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

      <div
        className={`flex-1 bg-gray-200 flex items-center justify-center ${aspectMap[data.mainImageAspect]} ${data.zoomOnHover ? "overflow-hidden group" : ""}`}
        style={{ borderRadius: br }}
      >
        <Package
          className={`h-24 w-24 text-gray-400 ${data.zoomOnHover ? "transition-transform group-hover:scale-110" : ""}`}
        />
      </div>

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
  const [selectedVariant, setSelectedVariant] = useState("Small");
  const [quantity, setQuantity] = useState(1);
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
                  onClick={() => setSelectedVariant(v)}
                  className={cn(
                    "px-4 py-2 border-2 text-sm font-medium transition-colors",
                    selectedVariant === v
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 hover:border-blue-300",
                  )}
                  style={{ borderRadius: br }}
                >
                  {v}
                </button>
              ))}
            </div>
          ) : (
            <Select value={selectedVariant} onValueChange={setSelectedVariant}>
              <SelectTrigger className="w-full" style={{ borderRadius: br }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Small">Small</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Large">Large</SelectItem>
                <SelectItem value="XL">XL</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {data.showQuantitySelector && (
        <div>
          <p className="text-sm font-medium mb-2">Quantity</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 border rounded flex items-center justify-center font-bold hover:bg-gray-50"
              style={{ borderRadius: br }}
            >
              −
            </button>
            <span className="w-12 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 border rounded flex items-center justify-center font-bold hover:bg-gray-50"
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
  const [activeTabId, setActiveTabId] = useState(data.defaultTab);
  const enabledTabs = data.tabs.filter((t) => t.enabled);
  const activeTab =
    enabledTabs.find((t) => t.id === activeTabId) ?? enabledTabs[0];

  const tabBtnClass = (isActive: boolean) => {
    const base =
      "px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ";
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
            onClick={() => setActiveTabId(tab.id)}
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

// ============================================================================
// UTIL
// ============================================================================

function getBorderRadius(r: ThemeConfig["borderRadius"]): string {
  return { none: "0", small: "0.25rem", medium: "0.5rem", large: "1rem" }[r];
}
