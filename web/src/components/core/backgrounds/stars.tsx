"use client";
import * as React from "react";
import {
  type HTMLMotionProps,
  motion,
  type SpringOptions,
  type Transition,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";

const STAR_FIELD_WIDTH = 4000;
const STAR_FIELD_HEIGHT = 4000;
const STAR_ANIMATION_DISTANCE = 2000;

type StarLayerProps = HTMLMotionProps<"div"> & {
  count: number;
  size: number;
  transition: Transition;
  starColor: string;
};

function generateStars(count: number, starColor: string) {
  const shadows: string[] = [];
  for (let i = 0; i < count; i++) {
    const x =
      Math.floor(Math.random() * STAR_FIELD_WIDTH) - STAR_FIELD_WIDTH / 2;
    const y =
      Math.floor(Math.random() * STAR_FIELD_HEIGHT) - STAR_FIELD_HEIGHT / 2;
    shadows.push(`${x}px ${y}px ${starColor}`);
  }
  return shadows.join(", ");
}

function StarLayer({
  count = 1000,
  size = 1,
  transition = { repeat: Infinity, duration: 50, ease: "linear" },
  starColor = "#fff",
  className,
  ...props
}: StarLayerProps) {
  const [boxShadow, setBoxShadow] = React.useState<string>("");

  React.useEffect(() => {
    setBoxShadow(generateStars(count, starColor));
  }, [count, starColor]);

  return (
    <motion.div
      data-slot="star-layer"
      animate={{ y: [0, -STAR_ANIMATION_DISTANCE] }}
      transition={transition}
      className={cn("absolute top-0 left-0 w-full min-h-full", className)}
      style={{ height: `${STAR_ANIMATION_DISTANCE}px` }}
      {...props}
    >
      <div
        className="absolute bg-transparent rounded-full"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          boxShadow: boxShadow,
        }}
      />
      <div
        className="absolute bg-transparent rounded-full"
        style={{
          top: `${STAR_ANIMATION_DISTANCE}px`,
          width: `${size}px`,
          height: `${size}px`,
          boxShadow: boxShadow,
        }}
      />
    </motion.div>
  );
}

type StarsBackgroundProps = React.ComponentProps<"div"> & {
  factor?: number;
  speed?: number;
  transition?: SpringOptions;
  starColor?: string;
  layerConfigs?: Array<{
    count: number;
    size: number;
    speedMultiplier: number;
  }>;
};

const defaultLayerConfigs = [
  { count: 1000, size: 1, speedMultiplier: 1 },
  { count: 400, size: 2, speedMultiplier: 2 },
  { count: 200, size: 3, speedMultiplier: 3 },
];

export function StarsBackground({
  children,
  className,
  factor = 0.05,
  speed = 50,
  transition = { stiffness: 50, damping: 20 },
  starColor = "#fff",
  layerConfigs = defaultLayerConfigs,
  ...props
}: StarsBackgroundProps) {
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const springX = useSpring(offsetX, transition);
  const springY = useSpring(offsetY, transition);

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const newOffsetX = -(e.clientX - centerX) * factor;
      const newOffsetY = -(e.clientY - centerY) * factor;
      offsetX.set(newOffsetX);
      offsetY.set(newOffsetY);
    },
    [offsetX, offsetY, factor],
  );

  return (
    <div
      data-slot="stars-background"
      className={cn("relative w-full h-full", className)}
      onMouseMove={handleMouseMove}
      {...props}
    >
      <motion.div
        className="absolute top-0 left-0 w-full h-full"
        style={{ x: springX, y: springY }}
      >
        {layerConfigs.map((config, i) => (
          <StarLayer
            key={i}
            count={config.count}
            size={config.size}
            transition={{
              repeat: Infinity,
              duration: speed * config.speedMultiplier,
              ease: "linear",
            }}
            starColor={starColor}
          />
        ))}
      </motion.div>
      {children}
    </div>
  );
}