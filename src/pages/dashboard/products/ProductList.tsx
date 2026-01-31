import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Package, View } from "lucide-react";
import { PermissionGuard } from "@/components/guards/PermissionGuard";
import { usePermissions } from "@/hooks/usePermissions";
import { fetchProducts } from "@/api/products/fetchProducts";
import type { Product } from "@/types/product";
import { useMemo } from "react";
import { getVariantPriceRange } from "@/helpers/getVariantPriceRange";

/**
 * Helper function to format the SKU column for variable products
 * Shows the variant count and indicates it's a variable product
 */
function getVariantSkuDisplay(product: Product): React.ReactNode {
  if (product.type === "simple") {
    return <span className="text-gray-600">{product.sku || "—"}</span>;
  }

  // For variable products, show variant count
  const variantCount = product.variants?.length || 0;

  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-600 text-sm">
        {variantCount} {variantCount === 1 ? "variant" : "variants"}
      </span>
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
        Variable
      </span>
    </div>
  );
}

export default function ProductList() {
  const navigate = useNavigate();
  const page = 1;
  const pageSize = 20;
  const { can } = usePermissions();

  // Fetch products list with variants included so we can calculate price ranges
  const {
    data: paginatedResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", page, pageSize],
    queryFn: fetchProducts,
    enabled: can("products:read"),
  });

  const products = useMemo(
    () => paginatedResponse?.data ?? [],
    [paginatedResponse],
  );

  const totalProductCount = useMemo(
    () => paginatedResponse?.total ?? 0,
    [paginatedResponse],
  );

  const canCreate = can("products:create");
  const canRead = can("products:read");
  const canUpdate = can("products:update");
  const canDelete = can("products:delete");

  const handleViewClick = (product: Product) => {
    navigate(`/products/${product.id}`);
  };

  const handleEditClick = (product: Product) => {
    navigate(`/products/${product.id}/edit`);
  };

  const handleCreateClick = () => {
    navigate("/products/create");
  };

  const handleDeleteClick = (product: Product) => {
    // TODO: Implement confirmation dialog + delete mutation
    console.log("Delete product:", product.id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">
          Error loading products: {(error as Error).message}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product catalog</p>
        </div>

        <PermissionGuard permission="products:create">
          <Button onClick={handleCreateClick}>
            <Plus className="h-4 w-4 mr-2" />
            Create Product
          </Button>
        </PermissionGuard>
      </div>

      {/* Products Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({totalProductCount})</CardTitle>
        </CardHeader>

        <CardContent>
          {totalProductCount > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      SKU / Variants
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Price
                    </th>

                    {(canUpdate || canDelete) && (
                      <th className="text-right py-3 px-4 font-medium text-gray-600">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      {/* Product Name */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-medium">{product.name}</span>
                          {product.description && (
                            <span className="text-sm text-gray-500 line-clamp-1">
                              {product.description}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Product Type */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                          {product.type}
                        </span>
                      </td>

                      {/* SKU / Variants Column - Different display for simple vs variable */}
                      <td className="py-3 px-4">
                        {getVariantSkuDisplay(product)}
                      </td>

                      {/* Price Column - Shows range for variable products */}
                      <td className="py-3 px-4">
                        <span className="font-medium">
                          {getVariantPriceRange(product)}
                        </span>
                      </td>

                      {/* Actions Column */}
                      {(canRead || canUpdate || canDelete) && (
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <PermissionGuard permission="products:read">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewClick(product)}
                                title="View product"
                                className="hover:cursor-pointer"
                              >
                                <View className="h-4 w-4" />
                              </Button>
                            </PermissionGuard>

                            <PermissionGuard permission="products:update">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditClick(product)}
                                title="Edit product"
                                className="hover:cursor-pointer"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </PermissionGuard>

                            <PermissionGuard permission="products:delete">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:cursor-pointer"
                                onClick={() => handleDeleteClick(product)}
                                title="Delete product"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </PermissionGuard>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No products found</p>

              {canCreate && (
                <PermissionGuard permission="products:create">
                  <Button onClick={handleCreateClick}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Product
                  </Button>
                </PermissionGuard>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
