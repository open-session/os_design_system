"use client";

import type { DialogProps as AriaDialogProps, ModalOverlayProps as AriaModalOverlayProps } from "react-aria-components";
import { Dialog as AriaDialog, DialogTrigger as AriaDialogTrigger, Modal as AriaModal, ModalOverlay as AriaModalOverlay } from "react-aria-components";
import { cx } from "@/utils/cx";
import { devProps } from "@/lib/utils/dev-props";

export const DialogTrigger = AriaDialogTrigger;

export const ModalOverlay = (props: AriaModalOverlayProps) => {
    return (
        <AriaModalOverlay
            {...devProps('ModalOverlay')}
            {...props}
            className={(state) =>
                cx(
                    "fixed inset-0 z-50 flex min-h-dvh w-full items-end justify-center overflow-y-auto bg-overlay/70 px-4 pt-4 pb-[clamp(16px,8vh,64px)] outline-hidden backdrop-blur-[6px] sm:items-center sm:justify-center sm:p-8",
                    state.isEntering && "duration-moderate ease-motion-out animate-in fade-in",
                    state.isExiting && "duration-standard ease-motion-in animate-out fade-out",
                    typeof props.className === "function" ? props.className(state) : props.className,
                )
            }
        />
    );
};

export const Modal = (props: AriaModalOverlayProps) => (
    <AriaModal
        {...devProps('Modal')}
        {...props}
        className={(state) =>
            cx(
                "max-h-full w-full align-middle outline-hidden max-sm:overflow-y-auto max-sm:rounded-xl",
                state.isEntering && "duration-moderate ease-motion-out animate-in zoom-in-95",
                state.isExiting && "duration-standard ease-motion-in animate-out zoom-out-95",
                typeof props.className === "function" ? props.className(state) : props.className,
            )
        }
    />
);

export const Dialog = (props: AriaDialogProps) => (
    <AriaDialog
        {...devProps('Dialog')}
        {...props}
        className={cx(
            // v8: base Dialog now owns surface treatment (rounded, bg, shadow)
            // so consumers no longer need a wrapper div with these classes.
            "w-full overflow-hidden rounded-xl bg-bg-primary shadow-xl outline-hidden",
            props.className,
        )}
    />
);
