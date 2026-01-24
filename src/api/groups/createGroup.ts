import type { Group } from "@/types/group";
import api from "../client";

type CreateGroupRequest = {
  name: string;
  description?: string;
};

export async function createGroup(
  groupData: CreateGroupRequest,
): Promise<Group> {
  const { data } = await api.post("/groups", groupData);

  return data;
}
