import type { QueryFunctionContext } from "@tanstack/react-query";
import api from "../client";

export async function listGroupMembers(
  ctx: QueryFunctionContext<[string, string]>,
) {
  const [, groupId] = ctx.queryKey;
  const { data } = await api.get(`/api/groups/${groupId}/members`);
  return data;
}
