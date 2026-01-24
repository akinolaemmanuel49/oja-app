import type { User } from "@/types/user";
import api from "../client";
import type { PaginatedResponse } from "@/responses/paginatedResponse";

export const fetchUsers = async (): Promise<PaginatedResponse<User>> => {
  const { data } = await api.get("/users");
  return data;
};
