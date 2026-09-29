import { Icon } from "@/components/shared/storefront-ui";
export default function ProductRating({
  rating,
  count,
  reviews = false,
}: {
  rating: number;
  count: number;
  reviews?: boolean;
}) {
  return (
    <div className="rating">
      <span className="stars" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((star) => (
          <Icon
            key={star}
            name={star < Math.round(rating) ? "starFilled" : "starOutline"}
          />
        ))}
      </span>
      <span>
        {rating} ({count}
        {reviews ? " reviews" : ""})
      </span>
    </div>
  );
}
