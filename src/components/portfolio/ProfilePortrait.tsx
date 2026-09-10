"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

/**
 * outer wrapper
 *   ambient glow (moves slightly opposite the tilt for depth)
 *     decorative ring
 *       portrait mask
 *         image
 *
 * Idle: very slow float (0 -> -8px -> 0, ~6s, respects reduced motion).
 * Active: small perspective tilt following the cursor, max ~3-4deg,
 * translate max ~6px. Resets smoothly on mouse leave. Disabled on touch
 * and under prefers-reduced-motion.
 */
export function ProfilePortrait({
  src,
  alt,
}: {
  src: string | null;
  alt: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 120, damping: 16, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 120, damping: 16, mass: 0.4 });

  const rotateX = useTransform(y, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-4, 4]);
  const translateX = useTransform(x, [-0.5, 0.5], [-6, 6]);
  const translateY = useTransform(y, [-0.5, 0.5], [-6, 6]);
  const glowX = useTransform(x, [-0.5, 0.5], [8, -8]);
  const glowY = useTransform(y, [-0.5, 0.5], [8, -8]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (prefersReducedMotion) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative mx-auto w-full max-w-[420px]"
      style={{
        perspective: 1000,
        aspectRatio: "4 / 5",
      }}
    >
      {/* ambient glow — drifts slightly opposite the tilt */}
      <motion.div
        aria-hidden
        style={{ x: glowX, y: glowY }}
        className="absolute -inset-10 -z-10 rounded-[40%] blur-[70px]"
      >
        <div
          className="h-full w-full rounded-[40%]"
          style={{ background: "radial-gradient(circle, rgba(201,143,74,0.28), transparent 70%)" }}
        />
      </motion.div>

      {/* the tilting / floating frame */}
      <motion.div
        style={{
          rotateX: prefersReducedMotion ? 0 : rotateX,
          rotateY: prefersReducedMotion ? 0 : rotateY,
          translateX: prefersReducedMotion ? 0 : translateX,
          translateY: prefersReducedMotion ? 0 : translateY,
          transformStyle: "preserve-3d",
        }}
        animate={
          prefersReducedMotion
            ? undefined
            : { y: [0, -8, 0] }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 7, repeat: Infinity, ease: "easeInOut" }
        }
        className="absolute inset-0"
      >
        {/* subtle animated gradient border */}
        <div
          className="absolute -inset-px rounded-[28px] opacity-70"
          style={{
            background:
              "linear-gradient(135deg, rgba(201,143,74,0.5), rgba(237,238,240,0.06) 40%, rgba(201,143,74,0.2))",
          }}
        />
        <div className="relative h-full w-full overflow-hidden rounded-[28px] border border-border-strong bg-bg-elevated shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
          {src ? (
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 768px) 90vw, 420px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-mono text-xs text-muted-2">
              profile_photo.pending
            </div>
          )}
          {/* soft top sheen */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.06), transparent 30%)",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
