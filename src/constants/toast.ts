import { Variant } from "@leafygreen-ui/toast";
import { ToastTypeKeys } from "types/toast";
import { InvertedObject } from "types/utils";

export const variantToTitleMap = {
  [Variant.Success]: "Success!",
  [Variant.Important]: "Warning!",
  [Variant.Warning]: "Error!",
  [Variant.Note]: "Something Happened!",
  [Variant.Progress]: "Loading...",
};

export const mapToastToLeafyGreenVariant: {
  [key in keyof ToastTypeKeys]: Variant;
} = {
  success: Variant.Success,
  warning: Variant.Important,
  error: Variant.Warning,
  info: Variant.Note,
  progress: Variant.Progress,
};

export const mapLeafyGreenVariantToToastVariant: InvertedObject<
  typeof mapToastToLeafyGreenVariant
> = {
  [Variant.Success]: "success",
  [Variant.Important]: "warning",
  [Variant.Warning]: "error",
  [Variant.Note]: "info",
  [Variant.Progress]: "progress",
};

const SECOND = 1000;
export const TOAST_TIMEOUT = 30 * SECOND;
