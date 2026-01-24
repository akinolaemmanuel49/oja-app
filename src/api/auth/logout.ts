import api from "../client";

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};
