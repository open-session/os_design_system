"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { devProps } from "@/lib/utils/dev-props";
import { dotIconAnimations, getStaticFrame } from "@/lib/dot-icons";
import { DotLoader } from "@/components/custom/shared/loaders/dot-loader";

interface DotIconProps {
  animationKey: string;
  isHovered: boolean;
  className?: string;
}

export function DotIcon({ animationKey, isHovered, className }: DotIconProps) {
  const animation = dotIconAnimations[animationKey];
  const hoverCount = useRef(0);

  // Increment on each hover-start to force DotLoader remount (resets animation from frame 0)
  useEffect(() => {
    if (isHovered) {
      hoverCount.current++;
    }
  }, [isHovered]);

  if (!animation) return null;

  const staticFrame = getStaticFrame(animation);

  return (
    <div
      {...devProps("DotIcon")}
      className={cn(
        "w-8 h-8 rounded-lg bg-bg-tertiary border border-border-secondary flex items-center justify-center flex-shrink-0",
        className,
      )}
    >
      <DotLoader
        key={isHovered ? hoverCount.current : "static"}
        frames={animation.frames}
        isPlaying={isHovered}
        duration={animation.duration}
        repeatCount={animation.repeatCount}
        initialFrame={staticFrame}
        gridSize={16}
        className="gap-[0.5px]"
        dotClassName="!size-[1.5px] !rounded-[0.5px] bg-brand-500/20 [&.active]:bg-brand-500"
      />
    </div>
  );
}
