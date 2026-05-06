// components/base — primitive barrel
//
// Single import surface for every BOS-transformed UUI Pro primitive.
// Required by Part 2's `_manifest.json` generator and by external tooling
// (Storybook indexes, MCP component-source endpoints, the future Generator
// preview surface) that needs to introspect the primitive layer without
// walking the filesystem.
//
// Conventions:
//   - Re-export public components by name; do NOT re-export internal
//     types/constants (`CommonProps`, `sizes`, `styles`) — those collide
//     across primitives and are consumed via deep imports when needed.
//   - Tooltip is re-exported from `with-defaults.tsx` (the BOS-defaulted
//     wrapper); that file already re-exports `TooltipTrigger` and types
//     from the underlying `tooltip.tsx`.
//   - `Modal` / `ModalOverlay` / `Dialog` come from `application/modals/`;
//     the slideout-menu file's same-named exports are intentionally
//     shadowed (we expose only its distinct `SlideoutMenu` symbol).
//   - `base-components/` subfolders (avatar-add-button, etc.) are internal
//     helpers and are NOT part of the public API.

// ─────────────────────────────────────────────────────────────────────────────
// base/ — primitives
// ─────────────────────────────────────────────────────────────────────────────

export { Avatar } from "./base/avatar/avatar";
export { AvatarLabelGroup } from "./base/avatar/avatar-label-group";
export { AvatarProfilePhoto } from "./base/avatar/avatar-profile-photo";

export {
  Badge,
  BadgeWithDot,
  BadgeWithIcon,
  BadgeWithFlag,
  BadgeWithImage,
} from "./base/badges/badges";

export { ButtonGroup, ButtonGroupItem } from "./base/button-group/button-group";

export { Button } from "./base/buttons/button";
export { CloseButton } from "./base/buttons/close-button";

export { Checkbox, CheckboxBase } from "./base/checkbox/checkbox";

export { Dropdown } from "./base/dropdown/dropdown";

export { HintText } from "./base/input/hint-text";
export { InputGroup, InputPrefix } from "./base/input/input-group";
export { PaymentInput } from "./base/input/input-payment";
export { Input, InputBase, TextField } from "./base/input/input";
export { Label } from "./base/input/label";

export { ComboBox } from "./base/select/combobox";
export { Popover } from "./base/select/popover";
export { SelectItem } from "./base/select/select-item";
export { NativeSelect } from "./base/select/select-native";
export { SelectContext } from "./base/select/select";
export { TagSelectBase, TagSelectTagsValue } from "./base/select/tag-select";

export { Slider } from "./base/slider/slider";

export { TextArea, TextAreaBase } from "./base/textarea/textarea";

export { Toggle, ToggleBase } from "./base/toggle/toggle";

// Tooltip: with-defaults re-exports `TooltipTrigger` + types from ./tooltip,
// then exports the BOS-defaulted Tooltip wrapper. Single import covers both.
export { Tooltip, TooltipTrigger } from "./base/tooltip/with-defaults";

// ─────────────────────────────────────────────────────────────────────────────
// application/ — composed primitives
// ─────────────────────────────────────────────────────────────────────────────

export {
  ChartLegendContent,
  ChartTooltipContent,
  ChartActiveDot,
} from "./application/charts/charts-base";

export { Calendar, CalendarContextProvider } from "./application/date-picker/calendar";
export { CalendarCell } from "./application/date-picker/cell";
export { DateInput } from "./application/date-picker/date-input";
export { DatePicker } from "./application/date-picker/date-picker";
export { DateRangePicker } from "./application/date-picker/date-range-picker";
export { RangeCalendar, RangeCalendarContextProvider } from "./application/date-picker/range-calendar";
export { RangePresetButton } from "./application/date-picker/range-preset";

export { EmptyState } from "./application/empty-state/empty-state";

export { MessageItem, MessageStatus } from "./application/messaging/messaging";

export { Modal, ModalOverlay, Dialog, DialogTrigger } from "./application/modals/modal";

export { Pagination } from "./application/pagination/pagination-base";
export { PaginationDot } from "./application/pagination/pagination-dot";
export { PaginationLine } from "./application/pagination/pagination-line";
export {
  PaginationPageDefault,
  PaginationPageMinimalCenter,
  PaginationCardDefault,
  PaginationCardMinimal,
  PaginationButtonGroup,
} from "./application/pagination/pagination";

// SlideoutMenu file also exports `Modal` / `ModalOverlay` / `Dialog` for its
// internal use; those are intentionally shadowed by the canonical Modal exports
// above. Only the distinct `SlideoutMenu` symbol surfaces from the public API.
export { SlideoutMenu } from "./application/slideout-menus/slideout-menu";

export { TableRowActionsDropdown } from "./application/table/table";

export { Tab, TabList, TabPanel, Tabs } from "./application/tabs/tabs";

// ─────────────────────────────────────────────────────────────────────────────
// foundations/ — building-block primitives
// ─────────────────────────────────────────────────────────────────────────────

export { Dot } from "./foundations/dot-icon";

export { FeaturedIcon } from "./foundations/featured-icon/featured-icon";

// payment-icons/index.tsx is already a sub-barrel; re-export everything from it
export * from "./foundations/payment-icons";
