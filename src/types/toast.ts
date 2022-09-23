import { Variant } from "@leafygreen-ui/toast";

export type ToastType = {
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

export type ToastTypeKeys = {
  success: string;
  warning: string;
  error: string;
  info: string;
  progress: string;
};
