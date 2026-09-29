import ProductImage from "@/components/catalog/ProductImage";
import {
  type Order,
  orderDate,
  orderMoney,
  orderQuantity,
  orderSubtotal,
} from "../orders.schemas";
import OrderIcon from "./OrderIcon";

export default function OrderCard({ order }: { order: Order }) {
  const quantity = orderQuantity(order);
  const product = order.cartItems[0]?.product;
  return (
    <details className="order-card">
      <summary aria-label={`Order ${order.id} details`}>
        <span className="order-cover">
          <span className="order-image">
            <ProductImage
              src={product?.imageCover}
              alt={product?.title || "Product"}
              sizes="112px"
            />
          </span>
          {order.cartItems.length > 1 && (
            <span className="order-more">+{order.cartItems.length - 1}</span>
          )}
        </span>
        <span className="order-overview">
          <span className="order-top">
            <span>
              <span
                className={`order-status ${order.isDelivered ? "delivered" : "processing"}`}
              >
                <OrderIcon icon={9} />
                {order.isDelivered ? "Delivered" : "Processing"}
              </span>
              <span className="order-number">
                <OrderIcon icon={10} />
                {order.id}
              </span>
            </span>
            <span
              className="order-payment"
              title={
                order.paymentMethodType === "cash"
                  ? "Cash"
                  : order.paymentMethodType === "card"
                    ? "Card"
                    : order.paymentMethodType
              }
            >
              <OrderIcon icon={11} />
              <span className="sr-only">
                Payment: {order.paymentMethodType}
              </span>
            </span>
          </span>
          <span className="order-meta">
            <span>
              <OrderIcon icon={12} />
              <time dateTime={order.createdAt}>
                {orderDate(order.createdAt)}
              </time>
            </span>
            <span>
              <OrderIcon icon={13} />
              {quantity} {quantity === 1 ? "item" : "items"}
            </span>
            {order.shippingAddress?.city && (
              <span>
                <OrderIcon icon={14} />
                {order.shippingAddress.city}
              </span>
            )}
          </span>
          <span className="order-bottom">
            <span className="order-total">
              {orderMoney(order.totalOrderPrice)} <small>EGP</small>
            </span>
            <span className="order-toggle">
              <span className="order-view">Details</span>
              <span className="order-hide">Hide</span>
              <OrderIcon icon={1} />
            </span>
          </span>
        </span>
      </summary>
      <div className="order-expanded">
        <section className="order-items">
          <h2>
            <span>
              <OrderIcon icon={15} />
            </span>
            Order Items
          </h2>
          {order.cartItems.length ? (
            order.cartItems.map((item) => (
              <div className="order-item" key={item._id}>
                <span className="order-item-image">
                  <ProductImage
                    src={item.product?.imageCover}
                    alt={item.product?.title || "Product unavailable"}
                    sizes="64px"
                  />
                </span>
                <div className="order-item-info">
                  <p>{item.product?.title || "Product unavailable"}</p>
                  <p>
                    {item.count} × {orderMoney(item.price)} EGP
                  </p>
                </div>
                <div className="order-line-total">
                  <strong>{orderMoney(item.price * item.count)}</strong>
                  <small>EGP</small>
                </div>
              </div>
            ))
          ) : (
            <p>No item information is available for this order.</p>
          )}
        </section>
        <div className="order-panels">
          <section className="order-address">
            <h2>
              <span>
                <OrderIcon icon={16} />
              </span>
              Delivery Address
            </h2>
            {order.shippingAddress &&
            Object.values(order.shippingAddress).some(Boolean) ? (
              <>
                <p>{order.shippingAddress.city}</p>
                <p>{order.shippingAddress.details}</p>
                {order.shippingAddress.postalCode && (
                  <p>{order.shippingAddress.postalCode}</p>
                )}
                {order.shippingAddress.phone && (
                  <p className="order-phone">
                    <OrderIcon icon={17} />
                    {order.shippingAddress.phone}
                  </p>
                )}
              </>
            ) : (
              <p>Delivery address unavailable.</p>
            )}
          </section>
          <section className="order-summary">
            <h2>
              <span>
                <OrderIcon icon={18} />
              </span>
              Order Summary
            </h2>
            <dl>
              <div>
                <dt>Subtotal</dt>
                <dd>{orderMoney(orderSubtotal(order))} EGP</dd>
              </div>
              <div>
                <dt>Shipping</dt>
                <dd>
                  {order.shippingPrice === 0
                    ? "Free"
                    : `${orderMoney(order.shippingPrice)} EGP`}
                </dd>
              </div>
              <div>
                <dt>Tax</dt>
                <dd>{orderMoney(order.taxPrice)} EGP</dd>
              </div>
              <div className="order-summary-total">
                <dt>Total</dt>
                <dd>{orderMoney(order.totalOrderPrice)} EGP</dd>
              </div>
            </dl>
            <p className="order-payment-state">
              {order.paymentMethodType === "cash"
                ? "Cash"
                : order.paymentMethodType === "card"
                  ? "Card"
                  : order.paymentMethodType}{" "}
              · {order.isPaid ? "Paid" : "Unpaid"}
              {order.isPaid && order.paidAt
                ? ` · ${orderDate(order.paidAt)}`
                : ""}
            </p>
          </section>
        </div>
      </div>
    </details>
  );
}
