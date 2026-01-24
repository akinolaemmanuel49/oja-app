import type { QueryFunctionContext } from "@tanstack/react-query";
import api from "../client";

export async function listGroupPermissions(
  ctx: QueryFunctionContext<[string, string]>,
) {
  const [, groupId] = ctx.queryKey;
  const { data } = await api.get(`/api/groups/${groupId}/permissions`);
  return data;
}
