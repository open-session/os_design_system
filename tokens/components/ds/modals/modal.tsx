"use client";

/**
 * BOS Modal — Shape C (full fork).
 *
 * @upstream-base components/base/application/modals/modal.tsx (vendor-pristine v8)
 * @history components/ds/_history/modal.md
 *
 * Brand decisions (Type 3, retained post-v8):
 *   1. Dialog surface treatment: BOS Dialog wraps with
 *      `"w-full overflow-hidden rounded-xl bg-bg-primary shadow-xl outline-hidden"`
 *      so consumers can pass simple content and get a styled modal. v8 Dialog only
 *      centers content (`"flex w-full items-center justify-center outline-hidden"`)
 *      and pushes surface treatment onto consumers. Migrating ~6 consumer Dialogs
 *      to manual styling is a worse trade than a thin wrapper.
 *   2. ModalOverlay + Modal motion durations: BOS uses `duration-moderate ease-motion-out`
 *      for enter and `duration-standard ease-motion-in` for exit (deliberate calm
 *      cadence). v8 uses `duration-micro` for both directions (~100ms) which feels
 *      jumpy at modal scale.
 *
 * DialogTrigger is re-exported from base/ unchanged (no DOM, no styling).
 */

import type { DialogProps as AriaDialogProps, ModalOverlayProps as AriaModalOverlayProps } from "react-aria-components";
import { Dialog as AriaDialog, Modal as AriaModal, ModalOverlay as AriaModalOverlay } from "react-aria-components";
import { cx } from "@/utils/cx";
import { devProps } from "@/lib/utils/dev-props";

export { DialogTrigger } from "@/components/base/application/modals/modal";

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
            "w-full overflow-hidden rounded-xl bg-bg-primary shadow-xl outline-hidden",
            props.className,
        )}
    />
);
