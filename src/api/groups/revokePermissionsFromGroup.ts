import api from "../client";

export async function revokePermissionsFromGroup(
  groupId: string,
  permissionCodes: string[],
): Promise<{
  message: string;
  revoked_count: number;
  requested_count: number;
  not_present: number;
}> {
  const { data } = await api.post(`/api/groups/${groupId}/permissions/revoke`, {
    permission_codes: permissionCodes,
  });
  return data;
}

type RevokePermissionsFromGroupMutationFnParams = {
  groupId: string;
  permissionCodes: string[];
};

export async function revokePermissionsFromGroupMutationFn({
  groupId,
  permissionCodes,
}: RevokePermissionsFromGroupMutationFnParams) {
  return revokePermissionsFromGroup(groupId, permissionCodes);
}
