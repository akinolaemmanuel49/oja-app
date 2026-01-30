import type { QueryFunctionContext } from "@tanstack/react-query";
import api from "../client";
import type { PaginatedResponse } from "@/responses/paginatedResponse";
import type { Product } from "@/types/product";

export const fetchProducts = async (
  ctx: QueryFunctionContext<[string, number, number]>,
): Promise<PaginatedResponse<Product>> => {
  const [, page, pageSize] = ctx.queryKey;

  const { data } = await api.get<PaginatedResponse<Product>>("/products", {
    params: {
      page,
      page_size: pageSize,
    },
  });

  return data;
};
