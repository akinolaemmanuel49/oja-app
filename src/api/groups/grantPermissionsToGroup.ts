import type { GrantPermissionsToGroupResponse } from "@/responses/group";
import api from "../client";

export async function grantPermissionsToGroup(
  groupId: string,
  permissionCodes: string[],
): Promise<GrantPermissionsToGroupResponse> {
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
