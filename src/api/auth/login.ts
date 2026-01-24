import api from "../client";

export type LoginCredentials = {
  email: string;
  password: string;
};

export const login = async (credentials: LoginCredentials) => {
  const { data } = await api.post("/auth/login", credentials);
  return data;
};
