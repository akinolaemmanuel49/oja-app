import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Users,
  Shield,
  UserPlus,
  ShieldPlus,
  Loader2,
  Trash2,
  Edit,
  LogOutIcon,
} from "lucide-react";
import { PermissionGuard } from "@/components/guards/PermissionGuard";
import { usePermissions } from "@/hooks/usePermissions";
import { AppHref } from "@/routes/constants";
import { listUserPermissions } from "@/api/users/listUserPermissions";
import { fetchUser } from "@/api/users/fetchUser";
import { revokePermissionsFromUserMutationFn } from "@/api/users/revokePermissionsFromUser";
import { fetchGroups } from "@/api/groups/fetchGroups";

export default function GroupDetail() {
  const { userId } = useParams<{ userId: string }>();
  const page = 1;
  const pageSize = 20;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { can } = usePermissions();
  const [selectedTab, setSelectedTab] = useState("members");

  // Fetch user data
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["users", userId!],
    queryFn: fetchUser,
    enabled: !!userId,
  });

  const { data, isLoading: isLoadingGroups } = useQuery({
    queryKey: ["groups", page, pageSize],
    queryFn: fetchGroups,
    enabled: !!userId,
  });

  const groups = useMemo(() => data?.data || [], [data]);

  // Fetch user permissions
  const { data: permissionsData, isLoading: isLoadingPermissions } = useQuery({
    queryKey: ["user-permissions", userId!],
    queryFn: listUserPermissions,
    enabled: !!userId && selectedTab === "permissions",
  });

  const permissions = useMemo(
    () => permissionsData?.data || [],
    [permissionsData],
  );

  // Permission checks
  const canUpdate = can("groups:update");
  const canGrantPermissions = can("permissions:grant");
  // const canRevokePermissions = can("permissions:revoke");

  // Revoke permission mutation
  const revokePermissionMutation = useMutation({
    mutationFn: revokePermissionsFromUserMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-permissions", userId],
      });
      queryClient.invalidateQueries({ queryKey: ["groups", userId] });
    },
  });

  /**
   * Handle revoking a permission from the group
   */
  const handleRevokePermission = (permissionCode: string) => {
    if (!userId) return;
    // TODO: Add confirmation dialog
    revokePermissionMutation.mutate({
      userId,
      permissionCodes: [permissionCode],
    });
  };

  /**
   * Navigate to grant permissions page
   */
  const handleGrantPermissions = () => {
    navigate(`/users/${userId}/permissions`);
  };

  // Loading state
  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  // Group not found
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertDescription>User not found</AlertDescription>
        </Alert>
        <Button
          variant="outline"
          onClick={() => navigate(AppHref.usersRoute)}
          className="mt-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
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
          onClick={() => navigate(AppHref.usersRoute)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{user.full_name}</h1>
            <p className="text-gray-600 mt-2">{user.email || "No email"}</p>
          </div>

          <PermissionGuard permission="users:update">
            <Button
              variant="outline"
              onClick={() => navigate(`/users/${userId}/edit`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit User
            </Button>
          </PermissionGuard>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Groups(UNIMPLEMENTED)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-400" />
              <span className="text-2xl font-bold">0</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-gray-400" />
              <span className="text-2xl font-bold">{permissions.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="members">Groups</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        {/* Groups Tab */}
        <TabsContent value="members" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Groups</CardTitle>
                  <CardDescription>
                    Groups that this user belongs to and inherits permissions
                    from.
                  </CardDescription>
                </div>

                <PermissionGuard
                  permissions={["users:update", "groups:update"]}
                >
                  <Button onClick={() => {}} size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add to group
                  </Button>
                </PermissionGuard>
              </div>
            </CardHeader>

            <CardContent>
              {isLoadingGroups ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : groups.length > 0 ? (
                <div className="space-y-3">
                  {groups.map((group) => (
                    <div
                      key={group.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-medium">{group.name}</p>
                        <p className="text-sm text-gray-600">
                          {group.description}
                        </p>
                      </div>

                      <PermissionGuard permission="groups:update">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          // onClick={() => handleRemoveMember(member.id)}
                          // disabled={removeMemberMutation.isPending}
                        >
                          <LogOutIcon className="h-4 w-4 text-red-600 hover:text-red-700" />
                        </Button>
                      </PermissionGuard>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No members in this group</p>

                  {canUpdate && (
                    <Button onClick={() => {}} size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Join Group
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Permissions</CardTitle>
                  <CardDescription>
                    Permissions assigned to this user
                  </CardDescription>
                </div>

                <PermissionGuard permission="permissions:grant">
                  <Button onClick={handleGrantPermissions} size="sm">
                    <ShieldPlus className="h-4 w-4 mr-2" />
                    Grant Permissions
                  </Button>
                </PermissionGuard>
              </div>
            </CardHeader>

            <CardContent>
              {isLoadingPermissions ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : permissions.length > 0 ? (
                <div className="space-y-3">
                  {permissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                            {permission.code}
                          </code>
                          {permission.code === "*" && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded font-medium">
                              SUPERUSER
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {permission.name}
                        </p>
                        {permission.description && (
                          <p className="text-xs text-gray-500 mt-1">
                            {permission.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          Granted{" "}
                          {new Date(permission.granted_at).toLocaleDateString()}
                        </p>
                      </div>

                      <PermissionGuard permission="permissions:revoke">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() =>
                            handleRevokePermission(permission.code)
                          }
                          disabled={revokePermissionMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </PermissionGuard>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">
                    No permissions assigned to this group
                  </p>

                  {canGrantPermissions && (
                    <Button onClick={handleGrantPermissions} size="sm">
                      <ShieldPlus className="h-4 w-4 mr-2" />
                      Grant First Permission
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
