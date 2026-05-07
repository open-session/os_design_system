"use client";

import type { FC, ReactNode, Ref, RefAttributes } from "react";
import { createContext, isValidElement } from "react";
import { ChevronDown } from "@untitledui/icons";
import type { SelectProps as AriaSelectProps } from "react-aria-components";
import { Button as AriaButton, ListBox as AriaListBox, Select as AriaSelect, SelectValue as AriaSelectValue } from "react-aria-components";
import { Avatar } from "@/components/base/base/avatar/avatar";
import { HintText } from "@/components/base/base/input/hint-text";
import { Label } from "@/components/base/base/input/label";
import { cx } from "@/utils/cx";
import { isReactComponent } from "@/utils/is-react-component";
import { devProps } from "@/lib/utils/dev-props";
import { ComboBox } from "./combobox";
import { Popover } from "./popover";
import { SelectItem } from "./select-item";

export type SelectItemType = {
    id: string;
    label?: string;
    avatarUrl?: string;
    isDisabled?: boolean;
    supportingText?: string;
    icon?: FC | ReactNode;
};

export interface CommonProps {
    hint?: string;
    label?: string;
    tooltip?: string;
    size?: "sm" | "md";
    placeholder?: string;
}

interface SelectProps extends Omit<AriaSelectProps<SelectItemType>, "children" | "items">, RefAttributes<HTMLDivElement>, CommonProps {
    items?: SelectItemType[];
    popoverClassName?: string;
    icon?: FC | ReactNode;
    children: ReactNode | ((item: SelectItemType) => ReactNode);
}

interface SelectValueProps {
    isOpen: boolean;
    size: "sm" | "md";
    isFocused: boolean;
    isDisabled: boolean;
    placeholder?: string;
    ref?: Ref<HTMLButtonElement>;
    icon?: FC | ReactNode;
}

export const sizes = {
    sm: { root: "py-2 px-3", shortcut: "pr-2.5" },
    md: { root: "py-2.5 px-3.5", shortcut: "pr-3" },
};

const SelectValue = ({ isOpen, isFocused, isDisabled, size, placeholder, icon, ref }: SelectValueProps) => {
    return (
        <AriaButton
            {...devProps('SelectValue')}
            ref={ref}
            className={cx(
                "relative flex w-full cursor-pointer items-center rounded-lg bg-primary shadow-xs ring-1 ring-primary outline-hidden transition duration-micro ease-motion-out ring-inset",
                (isFocused || isOpen) && "ring-1 ring-brand shadow-focus-ring-elevated",
                isDisabled && "cursor-not-allowed opacity-50",
            )}
        >
            <AriaSelectValue<SelectItemType>
                className={cx(
                    "flex h-max w-full items-center justify-start gap-2 truncate text-left align-middle",

                    // Icon styles
                    "*:data-icon:size-5 *:data-icon:shrink-0 *:data-icon:text-fg-quaternary",

                    sizes[size].root,
                )}
            >
                {(state) => {
                    const Icon = state.selectedItem?.icon || icon;
                    return (
                        <>
                            {state.selectedItem?.avatarUrl ? (
                                <Avatar size="xs" src={state.selectedItem.avatarUrl} alt={state.selectedItem.label} />
                            ) : isReactComponent(Icon) ? (
                                <Icon data-icon aria-hidden="true" />
                            ) : isValidElement(Icon) ? (
                                Icon
                            ) : null}

                            {state.selectedItem ? (
                                <section className="flex w-full gap-2 truncate">
                                    <p className="truncate text-md font-medium text-primary">{state.selectedItem?.label}</p>
                                    {state.selectedItem?.supportingText && <p className="text-md text-tertiary">{state.selectedItem?.supportingText}</p>}
                                </section>
                            ) : (
                                <p className="text-md text-placeholder">{placeholder}</p>
                            )}

                            <ChevronDown
                                aria-hidden="true"
                                className={cx("ml-auto shrink-0 text-fg-quaternary", size === "sm" ? "size-4 stroke-[2.5px]" : "size-5")}
                            />
                        </>
                    );
                }}
            </AriaSelectValue>
        </AriaButton>
    );
};

export const SelectContext = createContext<{ size: "sm" | "md" }>({ size: "sm" });

const Select = ({ placeholder = "Select", icon, size = "md", children, items, label, hint, tooltip, className, ...rest }: SelectProps) => {
    return (
        <SelectContext.Provider value={{ size }}>
            <AriaSelect {...devProps('Select')} {...rest} className={(state) => cx("flex flex-col gap-1.5", typeof className === "function" ? className(state) : className)}>
                {(state) => (
                    <>
                        {label && (
                            <Label isRequired={state.isRequired} tooltip={tooltip}>
                                {label}
                            </Label>
                        )}

                        <SelectValue {...state} {...{ size, placeholder }} icon={icon} />

                        <Popover size={size} className={rest.popoverClassName}>
                            <AriaListBox items={items} className="size-full outline-hidden">
                                {children}
                            </AriaListBox>
                        </Popover>

                        {hint && <HintText isInvalid={state.isInvalid}>{hint}</HintText>}
                    </>
                )}
            </AriaSelect>
        </SelectContext.Provider>
    );
};

// Static-property pattern (`Select.ComboBox`, `Select.Item`) consumed by
// brand-hub's typography/color/contrast/logo settings (~10 call sites).
// Direct assignment here would read `ComboBox` at module-load time, but
// combobox.tsx imports back from this file (`CommonProps`, `SelectContext`,
// `SelectItemType`, `sizes`) — that ESM cycle leaves `ComboBox` in TDZ when
// select.tsx finishes evaluating, and Vite/Storybook surface it as
// "Cannot access 'ComboBox' before initialization."
//
// Lazy getters defer the read until the property is actually accessed, by
// which time both modules have finished evaluating. C5's `select-shared.tsx`
// extraction will eliminate the cycle structurally; this is the bridge.
const _Select = Select as typeof Select & {
    ComboBox: typeof ComboBox;
    Item: typeof SelectItem;
};
Object.defineProperty(_Select, "ComboBox", {
    get: () => ComboBox,
    enumerable: true,
    configurable: true,
});
Object.defineProperty(_Select, "Item", {
    get: () => SelectItem,
    enumerable: true,
    configurable: true,
});

export { _Select as Select };
