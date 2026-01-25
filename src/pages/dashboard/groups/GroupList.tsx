import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Users, Shield } from "lucide-react";
import { PermissionGuard } from "@/components/guards/PermissionGuard";
import { usePermissions } from "@/hooks/usePermissions";
import { fetchGroups } from "@/api/groups/fetchGroups";
import type { Group } from "@/types/group";
import { AppHref } from "@/routes/constants";

export default function GroupList() {
  const navigate = useNavigate();
  const page = 1;
  const pageSize = 20;
  const { can } = usePermissions();

  // Fetch groups list
  const { data, isLoading, error } = useQuery({
    queryKey: ["groups", page, pageSize],
    queryFn: fetchGroups,
    enabled: can("groups:read"),
  });

  const groups = useMemo(() => data?.data || [], [data]);

  // Permission checks
  const canCreate = can("groups:create");
  const canUpdate = can("groups:update");
  const canDelete = can("groups:delete");

  /**
   * Handle edit button click - navigate to edit page
   */
  const handleEditClick = (group: Group) => {
    navigate(`/groups/${group.id}/edit`);
  };

  /**
   * Handle create button click - navigate to create page
   */
  const handleCreateClick = () => {
    navigate(AppHref.createGroupRoute);
  };

  /**
   * Handle delete button click
   * TODO: Implement delete confirmation dialog
   */
  const handleDeleteClick = (group: Group) => {
    // TODO: Show confirmation dialog before deleting
    console.log("Delete group:", group.id);
  };

  /**
   * Handle view details click - navigate to group detail page
   */
  const handleViewDetails = (group: Group) => {
    // TODO: Create group detail page
    navigate(`/groups/${group.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading groups...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Error loading groups: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Groups</h1>
          <p className="text-gray-600 mt-1">
            Organize users and manage permissions at scale
          </p>
        </div>

        {/* Create Group Button */}
        {canCreate && (
          <PermissionGuard permission="groups:create">
            <Button onClick={handleCreateClick}>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </PermissionGuard>
        )}
      </div>

      {/* Groups Grid */}
      {groups.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Card key={group.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-semibold">
                    {group.name}
                  </CardTitle>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {group.description || "No description"}
                  </p>
                </div>
                <Shield className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Group stats placeholder */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>0 members</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="h-4 w-4" />
                      <span>0 permissions</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleViewDetails(group)}
                    >
                      View Details
                    </Button>

                    {(canUpdate || canDelete) && (
                      <div className="flex gap-1">
                        <PermissionGuard permission="groups:update">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(group)}
                            title="Edit group"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </PermissionGuard>

                        <PermissionGuard permission="groups:delete">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteClick(group)}
                            title="Delete group"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </PermissionGuard>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No groups found</p>
            <p className="text-sm text-gray-400 mb-4">
              Create groups to organize users and assign permissions at scale
            </p>
            <PermissionGuard permission="groups:create">
              <Button onClick={handleCreateClick}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Group
              </Button>
            </PermissionGuard>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
