"use client";

import { useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductImage from "@/components/catalog/ProductImage";
import "swiper/css";

export default function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const main = useRef<SwiperInstance | null>(null);
  const thumbs = useRef<SwiperInstance | null>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  return (
    <section className="product-gallery" aria-label="Product images">
      {images.length ? (
        <>
          <Swiper
            className="gallery-main"
            modules={[A11y, Keyboard]}
            keyboard={{ enabled: true, onlyInViewport: true }}
            speed={reduced ? 0 : 300}
            onSwiper={(instance) => {
              main.current = instance;
            }}
            onSlideChange={(instance) => {
              setActive(instance.activeIndex);
              thumbs.current?.slideTo(instance.activeIndex);
            }}
          >
            {images.map((src, index) => (
              <SwiperSlide key={src}>
                <div className="gallery-image">
                  <ProductImage
                    src={src}
                    alt={`${title}, image ${index + 1}`}
                    sizes="(max-width: 767px) calc(100vw - 64px), (max-width: 1536px) 24vw, 344px"
                    preload={index === 0}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <Swiper
            className="gallery-thumbnails"
            modules={[A11y]}
            slidesPerView="auto"
            spaceBetween={2}
            onSwiper={(instance) => {
              thumbs.current = instance;
            }}
            speed={reduced ? 0 : 300}
          >
            {images.map((src, index) => (
              <SwiperSlide key={src}>
                <button
                  type="button"
                  aria-label={`Show product image ${index + 1}`}
                  aria-pressed={active === index}
                  onClick={() => main.current?.slideTo(index)}
                >
                  <ProductImage src={src} alt="" sizes="100px" />
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      ) : (
        <div className="gallery-image">
          <ProductImage alt={title} sizes="344px" />
        </div>
      )}
    </section>
  );
}
