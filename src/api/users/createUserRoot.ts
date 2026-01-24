import type { CreateUserRequest } from "@/requests/user";
import api from "../client";

export const createUserRoot = async (data: CreateUserRequest) => {
  const { data: response } = await api.post("/users/root", data);
  return response;
};
