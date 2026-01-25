import type { QueryFunctionContext } from "@tanstack/react-query";
import api from "../client";
import type { Storefront } from "@/types/storefront";

export const fetchStorefront = async (
  ctx: QueryFunctionContext<[string, string]>,
): Promise<Storefront> => {
  const [, storefrontId] = ctx.queryKey;
  const { data } = await api.get<Storefront>(`/storefronts/${storefrontId}`);

  return data;
};
