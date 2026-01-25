import api from "../client";
import type { CreateStorefrontRequest } from "@/requests/storefront";
import type { Storefront } from "@/types/storefront";

export async function createStorefront(
  storefrontData: CreateStorefrontRequest,
): Promise<Storefront> {
  const { data } = await api.post("/storefronts", storefrontData);

  return data;
}
