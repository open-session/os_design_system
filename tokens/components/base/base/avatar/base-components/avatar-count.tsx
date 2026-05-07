"use client";

import { cx } from "@/utils/cx";
import { devProps } from '@/lib/utils/dev-props';

interface AvatarCountProps {
    count: number;
    className?: string;
}

export const AvatarCount = ({ count, className }: AvatarCountProps) => (
    <div
      {...devProps('AvatarCount')} className={cx("absolute right-0 bottom-0 p-px", className)}>
        <div className="flex size-3.5 items-center justify-center rounded-full bg-fg-error-primary text-center text-[10px] leading-[13px] font-bold text-white">
            {count}
        </div>
    </div>
);
