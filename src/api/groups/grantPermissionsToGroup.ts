import api from "../client";

export async function grantPermissionsToGroup(
  groupId: string,
  permissionCodes: string[],
): Promise<{
  message: string;
  granted_count: number;
  requested_count: number;
  already_had: number;
}> {
  const { data } = await api.post(`/api/groups/${groupId}/permissions/grant`, {
    permission_codes: permissionCodes,
  });
  return data;
}

type GrantPermissionsToGroupMutationFnParams = {
  groupId: string;
  permissionCodes: string[];
};

export async function grantPermissionsToGroupMutationFn({
  groupId,
  permissionCodes,
}: GrantPermissionsToGroupMutationFnParams) {
  return grantPermissionsToGroup(groupId, permissionCodes);
}
