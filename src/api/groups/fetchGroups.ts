import type { QueryFunctionContext } from "@tanstack/react-query";
import api from "../client";
import type { PaginatedResponse } from "@/responses/paginatedResponse";
import type { Group } from "@/types/group";

export const fetchGroups = async (
  ctx: QueryFunctionContext<[string, number, number]>,
): Promise<PaginatedResponse<Group>> => {
  const [, page, pageSize] = ctx.queryKey;

  const { data } = await api.get<PaginatedResponse<Group>>(
    `/groups?page=${page}&page_size=${pageSize}`,
  );

  return data;
};
