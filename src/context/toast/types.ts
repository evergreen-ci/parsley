import { Variant } from "@leafygreen-ui/toast";

export type ToastVariant =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "progress";

export type ToastParams = {
  variant: Variant;
  closable: boolean;
  message: string;
  onClose: () => void;
  shouldTimeout: boolean;
  title: string;
  progress?: number;
};

// This is a function definition.
export type DispatchToast = (
  message: string,
  closable?: boolean,
  options?: {
    onClose?: () => void;
    shouldTimeout?: boolean;
    title?: string;
  },
) => void;

// This is a function definition.
export type DispatchToastWithProgress = (
  message: string,
  progress?: number,
  closable?: boolean,
  options?: {
    onClose?: () => void;
    shouldTimeout?: boolean;
    title?: string;
  },
) => void;
