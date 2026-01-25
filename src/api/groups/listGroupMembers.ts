import type { QueryFunctionContext } from "@tanstack/react-query";
import api from "../client";
import type { PaginatedResponse } from "@/responses/paginatedResponse";
import type { GroupMember } from "@/types/group";

export async function listGroupMembers(
  ctx: QueryFunctionContext<[string, string]>,
): Promise<PaginatedResponse<GroupMember>> {
  const [, groupId] = ctx.queryKey;
  const { data } = await api.get(`/api/groups/${groupId}/members`);
  return data;
}
