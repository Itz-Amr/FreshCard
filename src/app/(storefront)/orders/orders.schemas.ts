import { z } from "zod";

const optionalText = z.string().nullish();
const productSchema = z
  .object({
    title: optionalText,
    imageCover: optionalText,
  })
  .nullish();
export const orderSchema = z.object({
  _id: z.string().min(1),
  id: z.number().int().nonnegative(),
  user: z.object({ _id: z.string().min(1) }),
  shippingAddress: z
    .object({
      details: optionalText,
      phone: optionalText,
      city: optionalText,
      postalCode: optionalText,
    })
    .nullish(),
  taxPrice: z.number().nonnegative(),
  shippingPrice: z.number().nonnegative(),
  totalOrderPrice: z.number().nonnegative(),
  paymentMethodType: z.string().min(1),
  isPaid: z.boolean(),
  isDelivered: z.boolean(),
  cartItems: z.array(
    z.object({
      _id: z.string().min(1),
      count: z.number().int().nonnegative(),
      price: z.number().nonnegative(),
      product: productSchema,
    }),
  ),
  createdAt: z.iso.datetime({ offset: true }),
  paidAt: z.iso.datetime({ offset: true }).nullish(),
});
export const ordersSchema = z.array(orderSchema);
export type Order = Omit<z.infer<typeof orderSchema>, "user">;
export function orderQuantity(order: Order) {
  return order.cartItems.reduce((sum, item) => sum + item.count, 0);
}
export function orderSubtotal(order: Order) {
  return order.cartItems.reduce(
    (sum, item) => sum + item.price * item.count,
    0,
  );
}
export function orderDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}
export function orderMoney(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(
    value,
  );
}
