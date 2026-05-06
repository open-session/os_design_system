"use client";

/**
 * BOS Button — Wrapper shape: C (full fork).
 *
 * @upstream-base components/base/base/buttons/button.tsx (UUI Pro vendor source, mechanically transformed only)
 * @history components/ds/_history/button.md
 *
 * Brand decisions (rebased against UUI v8, Phase C Wave 1, 2026-05-06):
 *   - colors.primary.root → calm/contained primary (Decision #2, ds/_exceptions.md).
 *     v8 ships an orange CTA with skeuomorphic depth + inner-border gradient;
 *     BOS overrides to neutral-secondary surface that reveals the brand accent on
 *     hover. Type 3 (still BOS brand intent post-v8).
 *   - sizes.xs.root → smaller than v8's xs. v8 added an xs at 32px height
 *     (text-sm, rounded-lg, p-2 icon-only). BOS keeps a TIGHTER xs (text-xs,
 *     rounded-md, p-1.5 icon-only) for compact UI surfaces. Type 3.
 *   - sizes.{sm,md,lg,xl}.linkRoot → omits v8's `*:data-text:underline-offset-3/4`.
 *     BOS link buttons use a single `underline-offset-2` (baked into the link
 *     color arms) for visual consistency across sizes. Type 3.
 *   - colors.{secondary,primary-destructive,secondary-destructive}.root → adds
 *     `disabled:shadow-xs`. v8's vendor source doesn't override the disabled
 *     shadow, so disabled-but-skeuomorphic buttons look "raised" inappropriately.
 *     BOS forces shadow-xs (flat) when disabled. Type 3.
 *   - colors.{link-gray,link-color}.root → use `decoration-current` for hover
 *     underline. v8 uses per-color decoration tokens (`decoration-fg-quaternary`,
 *     `decoration-fg-brand-secondary_alt`). BOS's "match text color" pattern is
 *     simpler and brand-consistent. Type 3.
 *   - styles.common.root → uses `ease-motion-out` instead of v8's `ease-linear`.
 *     Type 3 (BOS motion preference). Codemod gap: axis1 doesn't transform
 *     `ease-linear` today, so re-pulls preserve the BOS choice via this wrapper
 *     until the codemod expands.
 *
 * Adopted from v8 in Wave 1 rebase:
 *   - styles.common.root: added `in-data-input-wrapper:disabled:opacity-100`
 *     (v8 Type 2 — disabled buttons inside InputGroup don't dim because the
 *     group handles disabled visually itself).
 *   - sizes.xs.root: added `*:data-icon:size-4` (v8 Type 2 — smaller icons fit
 *     the tighter xs button proportions). Stroke-styling not adopted (BOS
 *     keeps its default icon stroke).
 *   - colors.{secondary,primary-destructive,secondary-destructive}.root:
 *     dropped redundant `disabled:opacity-50` (already provided by
 *     common.root); kept `disabled:shadow-xs`.
 *
 * Wrapper shape rationale (Shape C — full fork): the primitive uses an object-style
 * `sortCx` constant read from module scope, not props. Runtime override would require
 * monkey-patching or re-implementation. Forking is cleaner and survives `bun run uui:add`
 * re-pulls predictably — the fresh upstream lands in base/ untouched, the BOS fork stays here.
 *
 * Consumer entry point: `import { Button } from '@/components/base'`. The barrel
 * (components/base/index.ts) re-exports from this file, NOT from base/base/buttons/button.tsx.
 */

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, DetailedHTMLProps, FC, ReactNode } from "react";
import React, { isValidElement } from "react";
import type { ButtonProps as AriaButtonProps, LinkProps as AriaLinkProps } from "react-aria-components";
import { Button as AriaButton, Link as AriaLink } from "react-aria-components";
import { cx, sortCx } from "@/utils/cx";
import { isReactComponent } from "@/utils/is-react-component";
import { devProps } from "@/lib/utils/dev-props";

export const styles = sortCx({
    common: {
        root: [
            "group relative inline-flex h-max cursor-pointer items-center justify-center whitespace-nowrap outline-brand transition duration-micro ease-motion-out before:absolute focus-visible:outline-2 focus-visible:outline-offset-2",
            // When button is used within `InputGroup`
            "in-data-input-wrapper:shadow-xs in-data-input-wrapper:focus:!z-50 in-data-input-wrapper:in-data-leading:-mr-px in-data-input-wrapper:in-data-leading:rounded-r-none in-data-input-wrapper:in-data-leading:before:rounded-r-none in-data-input-wrapper:in-data-trailing:-ml-px in-data-input-wrapper:in-data-trailing:rounded-l-none in-data-input-wrapper:in-data-trailing:before:rounded-l-none",
            // Disabled styles — v8 Type 2 adoption: input-wrapper-scoped buttons skip disabled dim
            "disabled:cursor-not-allowed disabled:opacity-50 in-data-input-wrapper:disabled:opacity-100",
            // Same as `icon` but for SSR icons that cannot be passed to the client as functions.
            "*:data-icon:pointer-events-none *:data-icon:size-5 *:data-icon:shrink-0 *:data-icon:transition-inherit-all",
        ].join(" "),
        icon: "pointer-events-none size-5 shrink-0 transition-inherit-all",
    },
    sizes: {
        xs: {
            root: [
                "gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold before:rounded-[5px] data-icon-only:p-1.5",
                "in-data-input-wrapper:px-3 in-data-input-wrapper:py-2 in-data-input-wrapper:data-icon-only:p-2",
                // v8 Type 2 adoption: smaller icons fit the tighter BOS xs proportions
                "*:data-icon:size-4",
            ].join(" "),
            linkRoot: "gap-1",
        },
        sm: {
            root: [
                "gap-1 rounded-lg px-3 py-2 text-sm font-semibold before:rounded-[7px] data-icon-only:p-2",
                "in-data-input-wrapper:px-3.5 in-data-input-wrapper:py-2.5 in-data-input-wrapper:data-icon-only:p-2.5",
            ].join(" "),
            linkRoot: "gap-1",
        },
        md: {
            root: [
                "gap-1 rounded-lg px-3.5 py-2.5 text-sm font-semibold before:rounded-[7px] data-icon-only:p-2.5",
                "in-data-input-wrapper:gap-1.5 in-data-input-wrapper:px-4 in-data-input-wrapper:text-md in-data-input-wrapper:data-icon-only:p-3",
            ].join(" "),
            linkRoot: "gap-1",
        },
        lg: {
            root: "gap-1.5 rounded-lg px-4 py-2.5 text-md font-semibold before:rounded-[7px] data-icon-only:p-3",
            linkRoot: "gap-1.5",
        },
        xl: {
            root: "gap-1.5 rounded-lg px-4.5 py-3 text-md font-semibold before:rounded-[7px] data-icon-only:p-3.5",
            linkRoot: "gap-1.5",
        },
    },

    colors: {
        primary: {
            root: [
                // BOS brand override (Decision #2 — ds/_exceptions.md): calm/contained primary,
                // not UUI orange CTA. Hover reveals brand accent.
                "bg-bg-secondary text-fg-primary shadow-xs ring-1 ring-border-primary ring-inset",
                "hover:bg-bg-brand-primary hover:text-fg-brand-primary hover:ring-border-brand-solid",
                "data-loading:bg-bg-brand-primary",
                // Disabled — opacity-50 from common.root; BOS keeps shadow-xs (override skeuomorphic ancestors)
                "disabled:shadow-xs",
                // Icon styles
                "*:data-icon:text-fg-tertiary hover:*:data-icon:text-fg-brand-primary",
            ].join(" "),
        },
        secondary: {
            root: [
                "bg-primary text-secondary shadow-xs-skeuomorphic ring-1 ring-primary ring-inset hover:bg-primary_hover hover:text-secondary_hover data-loading:bg-primary_hover",
                // Disabled — disabled:opacity-50 already comes from common.root; keep shadow-xs override (BOS Type 3: disabled = no skeuomorphic shadow)
                "disabled:shadow-xs",
                // Icon styles
                "*:data-icon:text-fg-quaternary hover:*:data-icon:text-fg-quaternary_hover",
            ].join(" "),
        },
        tertiary: {
            root: [
                "text-tertiary hover:bg-primary_hover hover:text-tertiary_hover data-loading:bg-primary_hover",
                // Icon styles
                "*:data-icon:text-fg-quaternary hover:*:data-icon:text-fg-quaternary_hover",
            ].join(" "),
        },
        "link-gray": {
            root: [
                "justify-normal rounded p-0! text-tertiary hover:text-tertiary_hover",
                // Inner text underline
                "*:data-text:underline *:data-text:decoration-transparent *:data-text:underline-offset-2 hover:*:data-text:decoration-current",
                // Icon styles
                "*:data-icon:text-fg-quaternary hover:*:data-icon:text-fg-quaternary_hover",
            ].join(" "),
        },
        "link-color": {
            root: [
                "justify-normal rounded p-0! text-brand-secondary hover:text-brand-secondary_hover",
                // Inner text underline
                "*:data-text:underline *:data-text:decoration-transparent *:data-text:underline-offset-2 hover:*:data-text:decoration-current",
                // Icon styles
                "*:data-icon:text-fg-brand-secondary_alt hover:*:data-icon:text-fg-brand-secondary_hover",
            ].join(" "),
        },
        "primary-destructive": {
            root: [
                "bg-error-solid text-white shadow-xs-skeuomorphic ring-1 ring-transparent outline-error ring-inset hover:bg-error-solid_hover data-loading:bg-error-solid_hover",
                // Inner border gradient
                "before:absolute before:inset-px before:border before:border-white/12 before:mask-b-from-0%",
                // Disabled — opacity-50 from common.root; BOS keeps shadow-xs override
                "disabled:shadow-xs",
                // Icon styles
                "*:data-icon:text-white/60 hover:*:data-icon:text-white/70",
            ].join(" "),
        },
        "secondary-destructive": {
            root: [
                "bg-primary text-error-primary shadow-xs-skeuomorphic ring-1 ring-error_subtle outline-error ring-inset hover:bg-error-primary hover:text-error-primary_hover data-loading:bg-error-primary",
                // Disabled — opacity-50 from common.root; BOS keeps disabled:bg-primary + shadow-xs overrides
                "disabled:bg-primary disabled:shadow-xs",
                // Icon styles
                "*:data-icon:text-fg-error-secondary hover:*:data-icon:text-fg-error-primary",
            ].join(" "),
        },
        "tertiary-destructive": {
            root: [
                "text-error-primary outline-error hover:bg-error-primary hover:text-error-primary_hover data-loading:bg-error-primary",
                // Icon styles
                "*:data-icon:text-fg-error-secondary hover:*:data-icon:text-fg-error-primary",
            ].join(" "),
        },
        "link-destructive": {
            root: [
                "justify-normal rounded p-0! text-error-primary outline-error hover:text-error-primary_hover",
                // Inner text underline
                "*:data-text:underline *:data-text:decoration-transparent *:data-text:underline-offset-2 hover:*:data-text:decoration-current",
                // Icon styles
                "*:data-icon:text-fg-error-secondary hover:*:data-icon:text-fg-error-primary",
            ].join(" "),
        },
    },
});

/**
 * Common props shared between button and anchor variants
 */
export interface CommonProps {
    /** Disables the button and shows a disabled state */
    isDisabled?: boolean;
    /** Shows a loading spinner and disables the button */
    isLoading?: boolean;
    /** The size variant of the button */
    size?: keyof typeof styles.sizes;
    /** The color variant of the button */
    color?: keyof typeof styles.colors;
    /** Icon component or element to show before the text */
    iconLeading?: FC<{ className?: string }> | ReactNode;
    /** Icon component or element to show after the text */
    iconTrailing?: FC<{ className?: string }> | ReactNode;
    /** Removes horizontal padding from the text content */
    noTextPadding?: boolean;
    /** When true, keeps the text visible during loading state */
    showTextWhileLoading?: boolean;
}

/**
 * Props for the button variant (non-link)
 */
export interface ButtonProps extends CommonProps, DetailedHTMLProps<Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color" | "slot">, HTMLButtonElement> {
    /** Slot name for react-aria component */
    slot?: AriaButtonProps["slot"];
}

/**
 * Props for the link variant (anchor tag)
 */
interface LinkProps extends CommonProps, DetailedHTMLProps<Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "color">, HTMLAnchorElement> {
    /** Options for the configured client side router. */
    routerOptions?: AriaLinkProps["routerOptions"];
}

/** Union type of button and link props */
export type Props = ButtonProps | LinkProps;

export const Button = ({
    size = "sm",
    color = "primary",
    children,
    className,
    noTextPadding,
    iconLeading: IconLeading,
    iconTrailing: IconTrailing,
    isDisabled: disabled,
    isLoading: loading,
    showTextWhileLoading,
    ...otherProps
}: Props) => {
    const href = "href" in otherProps ? otherProps.href : undefined;
    const Component = href ? AriaLink : AriaButton;

    const isIcon = (IconLeading || IconTrailing) && !children;
    const isLinkType = ["link-gray", "link-color", "link-destructive"].includes(color);

    noTextPadding = isLinkType || noTextPadding;

    let props = {};

    if (href) {
        props = {
            ...otherProps,

            href: disabled ? undefined : href,
        };
    } else {
        props = {
            ...otherProps,

            type: otherProps.type || "button",
            isPending: loading,
        };
    }

    return (
        <Component
            {...devProps('Button')}
            data-loading={loading ? true : undefined}
            data-icon-only={isIcon ? true : undefined}
            {...props}
            isDisabled={disabled}
            className={cx(
                styles.common.root,
                styles.sizes[size].root,
                styles.colors[color].root,
                isLinkType && styles.sizes[size].linkRoot,
                (loading || (href && (disabled || loading))) && "pointer-events-none",
                // If in `loading` state, hide everything except the loading icon (and text if `showTextWhileLoading` is true).
                loading && (showTextWhileLoading ? "[&>*:not([data-icon=loading]):not([data-text])]:hidden" : "[&>*:not([data-icon=loading])]:invisible"),
                className,
            )}
        >
            {/* Leading icon */}
            {isValidElement(IconLeading) && IconLeading}
            {isReactComponent(IconLeading) && <IconLeading data-icon="leading" className={styles.common.icon} />}

            {loading && (
                <svg
                    fill="none"
                    data-icon="loading"
                    viewBox="0 0 20 20"
                    className={cx(styles.common.icon, !showTextWhileLoading && "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2")}
                >
                    {/* Background circle */}
                    <circle className="stroke-current opacity-30" cx="10" cy="10" r="8" fill="none" strokeWidth="2" />
                    {/* Spinning circle */}
                    <circle
                        className="origin-center animate-spin stroke-current"
                        cx="10"
                        cy="10"
                        r="8"
                        fill="none"
                        strokeWidth="2"
                        strokeDasharray="12.5 50"
                        strokeLinecap="round"
                    />
                </svg>
            )}

            {children && (
                <span data-text className={cx("transition-inherit-all", !noTextPadding && "px-0.5")}>
                    {children}
                </span>
            )}

            {/* Trailing icon */}
            {isValidElement(IconTrailing) && IconTrailing}
            {isReactComponent(IconTrailing) && <IconTrailing data-icon="trailing" className={styles.common.icon} />}
        </Component>
    );
};
