"use client";

import { useAnimate, useInView, useReducedMotion } from "motion/react";
import { type ReactNode, useEffect } from "react";

export default function MotionReveal({
  children,
  className,
  x = 0,
  y = 20,
  duration = 0.5,
  delay = 0,
  enabled = true,
}: {
  children: ReactNode;
  className?: string;
  x?: number;
  y?: number;
  duration?: number;
  delay?: number;
  enabled?: boolean;
}) {
  const [scope, animate] = useAnimate();
  const visible = useInView(scope, { once: true, amount: 0.1 });
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!enabled || !visible || reduced !== false) return;
    const animation = animate(
      scope.current,
      { opacity: [0, 1], x: [x, 0], y: [y, 0] },
      { duration, delay, ease: "easeOut" },
    );
    return () => animation.stop();
  }, [animate, delay, duration, enabled, reduced, scope, visible, x, y]);
  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
