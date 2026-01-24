import type { QueryFunctionContext } from "@tanstack/react-query";
import api from "../client";
import type { User } from "@/types/user";

export const fetchUser = async (
  ctx: QueryFunctionContext<[string, string]>,
): Promise<User> => {
  const [, userId] = ctx.queryKey;
  const { data } = await api.get<User>(`/users/${userId}`);
  console.log({ DATA: data });

  return data;
};
