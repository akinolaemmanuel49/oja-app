import api from "../client";

export async function removeUsersFromGroup(
  groupId: string,
  userIds: string[],
): Promise<{
  message: string;
  removed: string[];
  not_found: string[];
}> {
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
