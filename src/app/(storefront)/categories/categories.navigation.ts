import { productsHref } from "../products/product.navigation";
export function categoryHref(id: string) {
  return productsHref({ category: id });
}
