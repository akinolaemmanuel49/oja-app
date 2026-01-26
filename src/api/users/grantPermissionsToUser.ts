import type { GrantPermissionsToUserResponse } from "@/responses/user";
import api from "../client";

export async function grantPermissionsToUser(
  userId: string,
  permissionCodes: string[],
): Promise<GrantPermissionsToUserResponse> {
  const { data } = await api.post(`/users/${userId}/permissions/grant`, {
    permission_codes: permissionCodes,
  });
  return data;
}

type GrantPermissionsToUserMutationFnParams = {
  userId: string;
  permissionCodes: string[];
};

export async function grantPermissionsToUserMutationFn({
  userId,
  permissionCodes,
}: GrantPermissionsToUserMutationFnParams) {
  return grantPermissionsToUser(userId, permissionCodes);
}
