import type { CreateProduct, Product } from "@/types/product";
import api from "../client";

export async function createProduct(
  productData: CreateProduct,
): Promise<Product> {
  const { data } = await api.post<Product>("/products", productData);
  return data;
}
