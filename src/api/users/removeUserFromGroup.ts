import api from "../client";

export const removeUserFromGroup = async (userId: string, groupId: string) => {
  const { data } = await api.post(`/users/${userId}/groups/remove`, {
    group_id: groupId,
  });

  return data;
};

type RemoveUserFromGroupMutationFnParams = {
  userId: string;
  groupId: string;
};

export const removeUserFromGroupMutationFn = async ({
  userId,
  groupId,
}: RemoveUserFromGroupMutationFnParams) => {
  return removeUserFromGroup(userId, groupId);
};
