import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, Package, Users } from "lucide-react";
import { PermissionGuard } from "@/components/guards/PermissionGuard";

export default function DashboardHome() {
  const { userWithPermissions, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Stats Grid - Only show cards user has permission to access */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Storefronts Card - Only visible if user can read storefronts */}
        <PermissionGuard permission="storefronts:read">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storefronts</CardTitle>
              <Store className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Active storefronts
              </p>
              <Button variant="link" className="mt-4 px-0" asChild>
                <a href="/storefronts">Manage storefronts →</a>
              </Button>
            </CardContent>
          </Card>
        </PermissionGuard>

        {/* Products Card - Only visible if user can read products */}
        <PermissionGuard permission="products:read">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Products in catalog
              </p>
              <Button variant="link" className="mt-4 px-0" asChild>
                <a href="/products">Manage products →</a>
              </Button>
            </CardContent>
          </Card>
        </PermissionGuard>

        {/* Team Card - Only visible if user can read users */}
        <PermissionGuard permission="users:read">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Team members</p>
              <Button variant="link" className="mt-4 px-0" asChild>
                <a href="/users">Manage team →</a>
              </Button>
            </CardContent>
          </Card>
        </PermissionGuard>
      </div>

      {/* Welcome Section */}
      <div className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">
          Welcome, {userWithPermissions?.user?.first_name}!
        </h2>
        <p className="text-muted-foreground mb-4">Here's what you can do:</p>

        {/* Action items based on permissions */}
        <div className="space-y-2">
          <PermissionGuard permission="storefronts:create">
            <p className="text-sm text-gray-600">
              • Create your first storefront to start selling
            </p>
          </PermissionGuard>

          <PermissionGuard permission="products:create">
            <p className="text-sm text-gray-600">
              • Add products to your catalog
            </p>
          </PermissionGuard>

          <PermissionGuard permission="users:create">
            <p className="text-sm text-gray-600">
              • Invite team members to collaborate
            </p>
          </PermissionGuard>
        </div>
      </div>
    </div>
  );
}
