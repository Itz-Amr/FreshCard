"use client";

import { useReducedMotion } from "motion/react";
import { type ReactNode, useRef } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Icon } from "@/components/shared/storefront-ui";
import "swiper/css";

export default function ProductCarousel({
  items,
}: {
  items: { id: string; content: ReactNode }[];
}) {
  const swiper = useRef<SwiperInstance | null>(null);
  const reduced = useReducedMotion();
  return (
    <div className="related-carousel">
      <div className="carousel-controls">
        <button
          type="button"
          aria-label="Previous related products"
          onClick={() => swiper.current?.slidePrev()}
        >
          <Icon name="chevronLeft" />
        </button>
        <button
          type="button"
          aria-label="Next related products"
          onClick={() => swiper.current?.slideNext()}
        >
          <Icon name="chevronRight" />
        </button>
      </div>
      <Swiper
        modules={[A11y]}
        slidesPerView={1}
        spaceBetween={24}
        speed={reduced ? 0 : 300}
        breakpoints={{
          600: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1000: { slidesPerView: 4 },
          1200: { slidesPerView: 5 },
        }}
        onSwiper={(instance) => {
          swiper.current = instance;
        }}
      >
        {items.map((item) => (
          <SwiperSlide key={item.id}>{item.content}</SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
