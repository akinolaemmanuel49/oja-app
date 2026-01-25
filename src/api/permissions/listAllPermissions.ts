import type { Permission } from "@/types/permission";
import api from "../client";

export async function listAllPermissions(): Promise<Permission[]> {
  const { data } = await api.get(`/permissions/list`);

  return data;
}
