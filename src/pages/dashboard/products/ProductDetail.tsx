import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Edit, Package, Loader2 } from "lucide-react";
import { PermissionGuard } from "@/components/guards/PermissionGuard";
import { usePermissions } from "@/hooks/usePermissions";
import { fetchProduct } from "@/api/products/fetchProduct";

/**
 * Product Detail View Component
 * Displays comprehensive information about a single product
 */
export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { can } = usePermissions();

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", productId!],
    queryFn: fetchProduct,
    enabled: !!productId && can("products:read"),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Product not found or access denied"}
          </AlertDescription>
        </Alert>
        <Button
          variant="outline"
          onClick={() => navigate("/products")}
          className="mt-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/products")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-gray-600 mt-2">
              {product.description || "No description"}
            </p>
          </div>

          <PermissionGuard permission="products:update">
            <Button onClick={() => navigate(`/products/${product.id}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Product
            </Button>
          </PermissionGuard>
        </div>
      </div>

      {/* Product Information */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Product Type
              </label>
              <div className="mt-1">
                <span className="inline-flex items-center px-3 py-1 rounded text-sm font-medium bg-gray-100 text-gray-800 capitalize">
                  {product.type}
                </span>
              </div>
            </div>

            {product.type === "simple" && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    SKU
                  </label>
                  <p className="mt-1 text-gray-900">
                    {product.sku || "Not set"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Base Price
                  </label>
                  <p className="mt-1 text-gray-900 text-lg font-semibold">
                    {product.base_price
                      ? `₦${product.base_price.toLocaleString()}`
                      : "Not set"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Stock Quantity
                  </label>
                  <p className="mt-1 text-gray-900">
                    {product.stock_quantity ?? "Not tracked"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Re-order Level
                  </label>
                  <p className="mt-1 text-gray-900">
                    {product.re_order_level ?? "Not set"}
                  </p>
                </div>
              </>
            )}

            <div>
              <label className="text-sm font-medium text-gray-600">
                Created
              </label>
              <p className="mt-1 text-gray-900">
                {new Date(product.created_at).toLocaleDateString()}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Last Updated
              </label>
              <p className="mt-1 text-gray-900">
                {new Date(product.updated_at).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Image Card (if available) */}
        {product.main_image_url && (
          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={product.main_image_url}
                alt={product.name}
                className="w-full h-auto rounded-lg"
              />
            </CardContent>
          </Card>
        )}

        {/* Placeholder for when no image */}
        {!product.main_image_url && (
          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                <Package className="h-16 w-16 text-gray-300" />
              </div>
              <p className="text-center text-gray-500 mt-4 text-sm">
                No image available
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Variants Card (for variable products) */}
      {product.type === "variable" && product.variants && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Product Variants</CardTitle>
            <CardDescription>
              {product.variants.length}{" "}
              {product.variants.length === 1 ? "variant" : "variants"}{" "}
              configured
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      SKU
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Attributes
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Price
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Stock
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {product.variants.map((variant) => (
                    <tr key={variant.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">
                        {variant.sku || "—"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(variant.attributes || {}).map(
                            ([key, value]) => (
                              <span
                                key={key}
                                className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800"
                              >
                                {key}: {value}
                              </span>
                            ),
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-900">
                        {variant.price
                          ? `₦${variant.price.toLocaleString()}`
                          : "—"}
                      </td>
                      <td className="py-3 px-4 text-gray-900">
                        {variant.stock_quantity ?? 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
