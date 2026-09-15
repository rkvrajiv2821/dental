"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

export function ImageReveal({
  className,
  wrapperClassName,
  delay = 0,
  ...props
}: ImageProps & { wrapperClassName?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn("relative overflow-hidden", wrapperClassName)}
      initial={{ clipPath: reduceMotion ? "inset(0 0 0 0)" : "inset(0 0 100% 0)" }}
      whileInView={{ clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: reduceMotion ? 0.01 : 1, delay, ease: [0.65, 0, 0.35, 1] }}
    >
      <motion.div
        initial={{ scale: reduceMotion ? 1 : 1.15 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: reduceMotion ? 0.01 : 1.2, delay, ease: [0.65, 0, 0.35, 1] }}
      >
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image className={cn("h-full w-full object-cover", className)} {...props} />
      </motion.div>
    </motion.div>
  );
}
