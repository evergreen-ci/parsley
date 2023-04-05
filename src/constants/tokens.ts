import { spacing } from "@leafygreen-ui/tokens";

// Should be used for spacing such as margins and padding.
const size = {
  xxs: `${spacing[1]}px`, // 4px
  xs: `${spacing[2]}px`, // 8px
  s: `${spacing[3]}px`, // 16px
  m: `${spacing[4]}px`, // 24px
  l: `${spacing[5]}px`, // 32px
  xl: `${spacing[6]}px`, // 64px
  xxl: `${spacing[7]}px`, // 88px
} as const;

const zIndex = {
  backdrop: -1,
  drawer: 10,
  modal: 20,
  tooltip: 30,
  popover: 40,
  toast: 50,
  dropdown: 60,
  max_do_not_use: 1000, // should only be used for things like the welcome modal that need to overlay EVERYTHING
} as const;

const fontSize = {
  s: "8px",
  m: "14px",
  l: "18px",
} as const;

const navbarHeight = "78px";
const subheaderHeight = "48px";
const textInputHeight = "36px";

export {
  fontSize,
  navbarHeight,
  size,
  subheaderHeight,
  textInputHeight,
  zIndex,
};
