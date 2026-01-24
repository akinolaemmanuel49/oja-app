import type { QueryFunctionContext } from "@tanstack/react-query";
import api from "../client";

export async function deleteGroup(ctx: QueryFunctionContext<[string, string]>) {
  const [, groupId] = ctx.queryKey;
  const { data } = await api.delete(`/groups/${groupId}`);
  return data;
}
