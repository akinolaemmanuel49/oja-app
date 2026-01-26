import type { User } from "@/types/user";
import api from "../client";
import type { PaginatedResponse } from "@/responses/paginatedResponse";
import type { QueryFunctionContext } from "@tanstack/react-query";

export const fetchUsers = async (
  ctx: QueryFunctionContext<[string, number, number]>,
): Promise<PaginatedResponse<User>> => {
  const [, page, pageSize] = ctx.queryKey;
  const { data } = await api.get("/users", {
    params: {
      page,
      page_size: pageSize,
    },
  });
  return data;
};
