import type { QueryFunctionContext } from "@tanstack/react-query";
import api from "../client";
import type { PaginatedResponse } from "@/responses/paginatedResponse";
import type { UserPermission } from "@/types/user";

export async function listUserPermissions(
  ctx: QueryFunctionContext<[string, string]>,
): Promise<PaginatedResponse<UserPermission>> {
  const [, userId] = ctx.queryKey;
  const { data } = await api.get(`/users/${userId}/permissions`);
  return data;
}
