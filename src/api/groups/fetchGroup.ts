import type { QueryFunctionContext } from "@tanstack/react-query";
import api from "../client";

export async function fetchGroup(ctx: QueryFunctionContext<[string, string]>) {
  const [, groupId] = ctx.queryKey;
  const { data } = await api.get(`/groups/${groupId}`);
  return data;
}
