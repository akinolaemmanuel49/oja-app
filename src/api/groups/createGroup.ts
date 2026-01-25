import type { Group } from "@/types/group";
import api from "../client";
import type { CreateGroupRequest } from "@/requests/group";

export async function createGroup(
  groupData: CreateGroupRequest,
): Promise<Group> {
  const { data } = await api.post("/groups", groupData);

  return data;
}
