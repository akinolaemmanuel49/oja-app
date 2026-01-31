import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Globe, Store, Lock, Package } from "lucide-react";
import { PermissionGuard } from "@/components/guards/PermissionGuard";
import { usePermissions } from "@/hooks/usePermissions";
import { fetchStorefronts } from "@/api/storefronts/fetchStorefronts";
import type { Storefront } from "@/types/storefront";
import { useMemo } from "react";

export default function StorefrontList() {
  const navigate = useNavigate();
  const page = 1;
  const pageSize = 20;
  const { can } = usePermissions();

  // Fetch storefronts list
  const {
    data: paginatedResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["storefronts", page, pageSize],
    queryFn: fetchStorefronts,
    enabled: can("storefronts:read"),
  });

  const storefronts = useMemo(
    () => paginatedResponse?.data ?? [],
    [paginatedResponse],
  );
  const totalStorefrontCount = useMemo(
    () => paginatedResponse?.total || 0,
    [paginatedResponse],
  );

  const canCreate = can("storefronts:create");
  const canUpdate = can("storefronts:update");
  const canDelete = can("storefronts:delete");

  const handleEditClick = (storefront: Storefront) => {
    navigate(`/storefronts/${storefront.id}/edit`);
  };

  const handleProductsClick = (storefront: Storefront) => {
    navigate(`/storefronts/${storefront.id}/products`);
  };

  const handleCreateClick = () => {
    navigate("/storefronts/create");
  };

  const handleDeleteClick = (storefront: Storefront) => {
    // TODO: Implement confirmation dialog + delete mutation
    console.log("Delete storefront:", storefront.id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading storefronts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">
          Error loading storefronts: {(error as Error).message}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Storefronts</h1>
          <p className="text-gray-600 mt-1">
            Manage your storefronts and sales channels
          </p>
        </div>

        <PermissionGuard permission="storefronts:create">
          <Button onClick={handleCreateClick}>
            <Plus className="h-4 w-4 mr-2" />
            Create Storefront
          </Button>
        </PermissionGuard>
      </div>

      {/* Storefronts Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Storefronts ({totalStorefrontCount})</CardTitle>
        </CardHeader>

        <CardContent>
          {totalStorefrontCount > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Slug / URL
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Domain
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Status
                    </th>
                    {(canUpdate || canDelete) && (
                      <th className="text-right py-3 px-4 font-medium text-gray-600">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {storefronts.map((store) => (
                    <tr key={store.id} className="border-b hover:bg-gray-50">
                      {/* Name Column */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {store.name}
                          {store.status === "inactive" && (
                            <Lock className="h-4 w-4 text-amber-500" />
                          )}
                        </div>
                      </td>

                      {/* Slug Column */}
                      <td className="py-3 px-4 text-gray-600">/{store.slug}</td>

                      {/* Domain Column */}
                      <td className="py-3 px-4 text-gray-600">
                        {store.domain ? (
                          <a
                            href={`https://${store.domain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <Globe className="h-3.5 w-3.5" />
                            {store.domain}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>

                      {/* Status Column */}
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-sm font-medium ${
                            store.status === "active"
                              ? "bg-green-100 text-green-700"
                              : store.status === "inactive"
                                ? "bg-gray-100 text-gray-700"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {store.status.charAt(0).toUpperCase() +
                            store.status.slice(1)}
                        </span>
                      </td>

                      {/* Actions Column */}
                      {(canUpdate || canDelete) && (
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            {/* Products Management Button */}
                            <PermissionGuard permission="storefronts:read">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleProductsClick(store)}
                                title="Manage products"
                                className="hover:cursor-pointer"
                              >
                                <Package className="h-4 w-4" />
                              </Button>
                            </PermissionGuard>

                            {/* Edit Button */}
                            <PermissionGuard permission="storefronts:update">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditClick(store)}
                                title="Edit storefront"
                                className="hover:cursor-pointer"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </PermissionGuard>

                            {/* Delete Button */}
                            <PermissionGuard permission="storefronts:delete">
                              {store.status !== "active" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => handleDeleteClick(store)}
                                  title="Delete storefront"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
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
              <Store className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No storefronts found</p>

              {canCreate && (
                <PermissionGuard permission="storefronts:create">
                  <Button onClick={handleCreateClick}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Storefront
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
