import type { Group } from "@/types/group";
import api from "../client";

export type UpdateGroupRequest = {
  name: string;
  description?: string;
};

export async function updateGroup(
  groupId: string,
  groupUpdate: UpdateGroupRequest,
): Promise<Group> {
  const { data } = await api.patch(`/groups/${groupId}`, groupUpdate);
  return data;
}

type UpdateGroupMutationFnParams = {
  groupId: string;
  groupUpdate: UpdateGroupRequest;
};

export async function updateGroupMutationFn({
  groupId,
  groupUpdate,
}: UpdateGroupMutationFnParams) {
  return updateGroup(groupId, groupUpdate);
}
