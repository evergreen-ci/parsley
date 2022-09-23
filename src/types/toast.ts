import { Variant } from "@leafygreen-ui/toast";

export type VisibleToast = {
  variant: Variant;
  closable: boolean;
  message: string;
  onClose: () => void;
  shouldTimeout: boolean;
  title: string;
};

export type DispatchToast = (
  message: string,
  closable?: boolean,
  options?: {
    onClose?: () => void;
    shouldTimeout?: boolean;
    title?: string;
  }
) => void;

export type ToastVariants = {
  success: string;
  warning: string;
  error: string;
  info: string;
  progress: string;
};
