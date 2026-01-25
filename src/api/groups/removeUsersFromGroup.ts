import type { RemoveUsersFromGroupResponse } from "@/responses/group";
import api from "../client";

export async function removeUsersFromGroup(
  groupId: string,
  userIds: string[],
): Promise<RemoveUsersFromGroupResponse> {
  const { data } = await api.post(`/groups/${groupId}/members/remove`, {
    user_ids: userIds,
  });
  return data;
}

type RemoveUsersFromGroupMutationFnParams = {
  groupId: string;
  userIds: string[];
};

export async function removeUsersFromGroupMutationFn({
  groupId,
  userIds,
}: RemoveUsersFromGroupMutationFnParams) {
  return removeUsersFromGroup(groupId, userIds);
}
