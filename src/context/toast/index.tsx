import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import styled from "@emotion/styled";
import Toast, { Variant } from "@leafygreen-ui/toast";
import {
  TOAST_TIMEOUT,
  mapLeafyGreenVariantToToastVariant,
  mapToastToLeafyGreenVariant,
  variantToTitleMap,
} from "constants/toast";
import { zIndex } from "constants/tokens";
import { DispatchToast, ToastType } from "types/toast";

export interface DispatchToastContextState {
  success: DispatchToast;
  warning: DispatchToast;
  error: DispatchToast;
  info: DispatchToast;
  progress: DispatchToast;
  hide: () => void;
}

export const ToastDispatchContext =
  createContext<DispatchToastContextState | null>(null);

const useToastContext = (): DispatchToastContextState => {
  const context = useContext(ToastDispatchContext);
  if (context === null || context === undefined) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
};

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toastOpen, setToastOpen] = useState(false);
  const [visibleToast, setVisibleToast] = useState<ToastType>({
    variant: Variant.Note,
    title: "",
    message: "",
    closable: true,
    onClose: () => {},
    shouldTimeout: true,
  });

  useEffect(() => {
    if (!visibleToast.shouldTimeout) {
      return;
    }
    const timeout = setTimeout(() => {
      hideToast();
    }, TOAST_TIMEOUT);
    return () => clearTimeout(timeout);
  });

  const dispatchToast = useCallback(
    (toast: ToastType) => {
      setVisibleToast(toast);
      setToastOpen(true);
    },
    [setVisibleToast, setToastOpen]
  );

  const hideToast = useCallback(() => {
    setToastOpen(false);
  }, [setToastOpen]);

  const toastContext = useMemo(() => {
    const defaultOptions = {
      onClose: () => {},
      shouldTimeout: true,
      title: "",
    };

    return {
      success: (message = "", closable = true, options = {}) =>
        dispatchToast({
          variant: mapToastToLeafyGreenVariant.success,
          message,
          closable,
          ...defaultOptions,
          ...options,
        }),
      warning: (message = "", closable = true, options = {}) =>
        dispatchToast({
          variant: mapToastToLeafyGreenVariant.warning,
          message,
          closable,
          ...defaultOptions,
          ...options,
        }),
      error: (message = "", closable = true, options = {}) =>
        dispatchToast({
          variant: mapToastToLeafyGreenVariant.error,
          message,
          closable,
          ...defaultOptions,
          ...options,
        }),
      info: (message = "", closable = true, options = {}) =>
        dispatchToast({
          variant: mapToastToLeafyGreenVariant.info,
          message,
          closable,
          ...defaultOptions,
          ...options,
        }),
      progress: (message = "", closable = true, options = {}) =>
        dispatchToast({
          variant: mapToastToLeafyGreenVariant.progress,
          message,
          closable,
          ...defaultOptions,
          ...options,
        }),
      hide: hideToast,
    };
  }, [dispatchToast, hideToast]);

  return (
    <ToastDispatchContext.Provider value={toastContext}>
      {children}
      <StyledToast
        body={<Message>{visibleToast.message}</Message>}
        close={
          visibleToast.closable
            ? () => {
                visibleToast.onClose();
                setToastOpen(false);
              }
            : undefined
        }
        data-cy="toast"
        data-variant={mapLeafyGreenVariantToToastVariant[visibleToast.variant]}
        open={toastOpen}
        title={visibleToast.title || variantToTitleMap[visibleToast.variant]}
        variant={visibleToast.variant}
      />
    </ToastDispatchContext.Provider>
  );
};

const StyledToast = styled(Toast)`
  z-index: ${zIndex.toast};
`;

const Message = styled.span`
  word-break: break-word;
`;

export { ToastProvider, useToastContext };
