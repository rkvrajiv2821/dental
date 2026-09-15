"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const DIRECTIONS = {
  up: { y: 28, x: 0 },
  down: { y: -28, x: 0 },
  left: { x: 28, y: 0 },
  right: { x: -28, y: 0 },
  none: { x: 0, y: 0 },
};

export function FadeIn({
  children,
  delay = 0,
  duration = 0.6,
  direction = "up",
  className,
  once = true,
  amount = 0.3,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: keyof typeof DIRECTIONS;
  className?: string;
  once?: boolean;
  amount?: number;
}) {
  const reduceMotion = useReducedMotion();
  const offset = DIRECTIONS[direction];

  const variants: Variants = {
    hidden: { opacity: 0, ...(reduceMotion ? {} : offset) },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: reduceMotion ? 0.01 : duration, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  staggerChildren = 0.08,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  staggerChildren?: number;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
      variants={{ visible: { transition: { staggerChildren } }, hidden: {} }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, direction = "up" }: { children: ReactNode; className?: string; direction?: keyof typeof DIRECTIONS }) {
  const offset = DIRECTIONS[direction];
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, ...offset },
        visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}
