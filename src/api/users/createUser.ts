import type { CreateUserRequest } from "@/requests/user";
import api from "../client";

export const createUser = async (data: CreateUserRequest) => {
  const { data: response } = await api.post("/users", data);
  return response;
};
