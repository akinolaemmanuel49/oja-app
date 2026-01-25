import type { UpdateStorefrontRequest } from "@/requests/storefront";
import type { Storefront } from "@/types/storefront";
import api from "../client";

export const updateStorefront = async (
  storefrontId: string,
  storefrontData: UpdateStorefrontRequest,
): Promise<Storefront> => {
  const { data } = await api.patch(
    `/storefronts/${storefrontId}`,
    storefrontData,
  );

  return data;
};

type UpdateStorefrontMutationFnParams = {
  storefrontId: string;
  storefrontUpdate: UpdateStorefrontRequest;
};

export const UpdateStorefrontMutationFn = async ({
  storefrontId,
  storefrontUpdate,
}: UpdateStorefrontMutationFnParams) =>
  updateStorefront(storefrontId, storefrontUpdate);
