"use client";

import { useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import MotionReveal from "@/components/shared/MotionReveal";
import { Icon, PageContainer } from "@/components/shared/storefront-ui";
import { Button } from "@/components/ui/button";
import { assets } from "@/data/catalog";
import "swiper/css";

const slides = [
  {
    title: "Fresh Products Delivered",
    second: "to your Door",
    description: "Explore products from our catalog",
    action: "Shop Now",
    secondary: "Browse Categories",
  },
  {
    title: "Explore Our Brands",
    second: "",
    description: "Find products from your favorite brands",
    action: "Shop Now",
    secondary: "Browse Categories",
  },
  {
    title: "Shop Your Favorites",
    second: "",
    description: "Save products to your wishlist",
    action: "Order Now",
    secondary: "Browse Categories",
  },
];
export default function Hero() {
  const swiper = useRef<SwiperInstance | null>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  return (
    <section className="hero-slider" aria-label="Fresh products promotions">
      <Swiper
        modules={[A11y, Keyboard]}
        keyboard={{ enabled: true, onlyInViewport: true }}
        speed={reduced ? 0 : 300}
        onSwiper={(instance) => {
          swiper.current = instance;
        }}
        onSlideChange={(instance) => setActive(instance.activeIndex)}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.title} inert={index !== active}>
            <div className="hero">
              <Image
                src={assets.heroProduce}
                alt="Fresh produce in a grocery store"
                fill
                preload={index === 0}
                sizes="100vw"
                className="hero-image"
              />
              <div className="hero-overlay" />
              <PageContainer className="hero-content">
                <MotionReveal
                  key={`title-${active}`}
                  enabled={active === index}
                  duration={0.6}
                >
                  <h1>
                    {slide.title}
                    {slide.second && (
                      <>
                        <br className="hero-title-break" /> {slide.second}
                      </>
                    )}
                  </h1>
                </MotionReveal>
                <MotionReveal
                  key={`description-${active}`}
                  enabled={active === index}
                  duration={0.6}
                  delay={0.1}
                >
                  <p>{slide.description}</p>
                </MotionReveal>
                <MotionReveal
                  key={`actions-${active}`}
                  enabled={active === index}
                  className="flex flex-wrap gap-2"
                  y={30}
                  duration={0.6}
                  delay={0.2}
                >
                  <Button asChild variant="white">
                    <Link href="/products">{slide.action}</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/categories">{slide.secondary}</Link>
                  </Button>
                </MotionReveal>
              </PageContainer>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <Button
        variant="icon"
        className="hero-prev"
        aria-label="Previous promotion"
        onClick={() =>
          swiper.current?.slideTo((active + slides.length - 1) % slides.length)
        }
      >
        <Icon name="chevronLeft" />
      </Button>
      <Button
        variant="icon"
        className="hero-next"
        aria-label="Next promotion"
        onClick={() => swiper.current?.slideTo((active + 1) % slides.length)}
      >
        <Icon name="chevronRight" />
      </Button>
      <div className="hero-dots">
        {slides.map((slide, index) => (
          <button
            type="button"
            key={slide.title}
            className={active === index ? "active" : ""}
            aria-label={`Show promotion ${index + 1}`}
            aria-current={active === index ? "true" : undefined}
            onClick={() => swiper.current?.slideTo(index)}
          />
        ))}
      </div>
    </section>
  );
}
