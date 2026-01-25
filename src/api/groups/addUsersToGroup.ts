import type { AddUsersToGroupResponse } from "@/responses/group";
import api from "../client";

export async function addUsersToGroup(
  groupId: string,
  userIds: string[],
): Promise<AddUsersToGroupResponse> {
  const { data } = await api.post(`/groups/${groupId}/members/add`, {
    user_ids: userIds,
  });
  return data;
}

type AddUsersToGroupMutationFnParams = {
  groupId: string;
  userIds: string[];
};

export async function addUsersToGroupMutationFn({
  groupId,
  userIds,
}: AddUsersToGroupMutationFnParams) {
  return addUsersToGroup(groupId, userIds);
}
