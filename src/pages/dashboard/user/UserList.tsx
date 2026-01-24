import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Shield, Users } from "lucide-react";
import { PermissionGuard } from "@/components/guards/PermissionGuard";
import { usePermissions } from "@/hooks/usePermissions";
import { fetchUsers } from "@/api/users/fetchUsers";

export default function UserList() {
  const { can } = usePermissions();
  // const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch users list
  const {
    data: paginatedResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    // Only enable query if user has read permission
    // Note: The PermissionRoute guard already checked this, but this is extra safety
    enabled: can("users:read"),
  });

  const users = paginatedResponse?.data;
  console.log({ users });

  // Permission checks for various actions
  // const canCreate = can("users:create");
  const canUpdate = can("users:update");
  const canDelete = can("users:delete");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Error loading users: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-gray-600 mt-1">
            Manage your team members and their access
          </p>
        </div>

        {/* Create User Button - Only show if user has create permission */}
        <PermissionGuard permission="users:create">
          <Button
            onClick={() => {
              /* TODO: Open create modal */
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </PermissionGuard>
      </div>

      {/* Users Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members ({users?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {users && users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Role
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Status
                    </th>
                    {/* Only show actions column if user can do anything */}
                    {(canUpdate || canDelete) && (
                      <th className="text-right py-3 px-4 font-medium text-gray-600">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {user.full_name}
                          {user.is_root && (
                            <Shield className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                          {user.is_root ? "Root" : "Member"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            user.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Actions - Only show if user has permissions */}
                      {(canUpdate || canDelete) && (
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            {/* Edit button - only if user can update */}
                            <PermissionGuard permission="users:update">
                              <Button
                                variant="ghost"
                                size="sm"
                                // onClick={() => setSelectedUser(user)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </PermissionGuard>

                            {/* Delete button - only if user can delete and it's not root */}
                            <PermissionGuard permission="users:delete">
                              {!user.is_root && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => {
                                    /* TODO: Handle delete */
                                  }}
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
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No users found</p>
              <PermissionGuard permission="users:create">
                <Button
                  onClick={() => {
                    /* TODO: Open create modal */
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First User
                </Button>
              </PermissionGuard>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
