import type { QueryFunctionContext } from "@tanstack/react-query";
import api from "../client";
import type { PaginatedResponse } from "@/responses/paginatedResponse";
import type { GroupPermission } from "@/types/group";

export async function listGroupPermissions(
  ctx: QueryFunctionContext<[string, string]>,
): Promise<PaginatedResponse<GroupPermission>> {
  const [, groupId] = ctx.queryKey;
  const { data } = await api.get(`/groups/${groupId}/permissions`);
  return data;
}
