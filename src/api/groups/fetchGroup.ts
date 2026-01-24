import type { QueryFunctionContext } from "@tanstack/react-query";
import api from "../client";
import type { Group } from "@/types/group";

export async function fetchGroup(
  ctx: QueryFunctionContext<[string, string]>,
): Promise<Group> {
  const [, groupId] = ctx.queryKey;
  const { data } = await api.get<Group>(`/groups/${groupId}`);
  return data;
}
