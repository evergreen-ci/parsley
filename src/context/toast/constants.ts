import { Variant } from "@leafygreen-ui/toast";
import { ToastVariants } from "./types";

export const mapVariantToTitle = {
  [Variant.Success]: "Success!",
  [Variant.Important]: "Warning!",
  [Variant.Warning]: "Error!",
  [Variant.Note]: "Something Happened!",
  [Variant.Progress]: "Loading...",
};

export const mapToastToLeafyGreenVariant: {
  [key in keyof ToastVariants]: Variant;
} = {
  success: Variant.Success,
  warning: Variant.Important,
  error: Variant.Warning,
  info: Variant.Note,
  progress: Variant.Progress,
};

const SECOND = 1000;
export const TOAST_TIMEOUT = 30 * SECOND;
