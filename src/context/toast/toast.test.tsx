import { renderHook } from "@testing-library/react-hooks";
import { TOAST_TIMEOUT } from "constants/toast";
import { act, render, screen, userEvent, waitFor } from "test_utils";
import { DispatchToastContextState, ToastProvider, useToastContext } from ".";
import { RenderFakeToastContext } from "./__mocks__";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>
    <div>{children}</div>
  </ToastProvider>
);

// According to the creators of @testing-library/react-hooks, the correct way to test a hook with DOM side effects
// is to write a small test component that uses the hook internally.
// (https://github.com/testing-library/react-hooks-testing-library/issues/86)
type ToastComponentProps = {
  [K in keyof DispatchToastContextState]: {
    toastType: K;
    params: Parameters<DispatchToastContextState[K]>;
  };
}[keyof DispatchToastContextState];

const ToastComponent: React.FC<ToastComponentProps> = ({
  toastType,
  params,
}) => {
  const dispatchToast = useToastContext();
  return (
    <button
      // @ts-ignore-error: Typescript is unable to infer the correct type, but based on the props
      // definition we should not be able to pass incorrect arguments.
      onClick={() => dispatchToast[toastType](...(params as []))}
      type="button"
    >
      Click Me
    </button>
  );
};

describe("toast", () => {
  it("should error when rendered outside of ToastProvider context", () => {
    // This test intentionally throws an error so we need to mock the error object to prevent it
    // from showing in the test runner.
    const errorObject = console.error;
    jest.spyOn(console, "error").mockImplementation();
    expect(() =>
      render(<ToastComponent params={["msg"]} toastType="success" />)
    ).toThrow("useToastContext must be used within a ToastProvider");
    console.error = errorObject;
  });

  it("should not display a toast by default", () => {
    render(<div />, { wrapper });
    expect(screen.queryByDataCy("toast")).toBeNull();
  });

  it("should be able to set a custom title for a toast", async () => {
    render(
      <ToastComponent
        params={["test string", true, { title: "Custom Title" }]}
        toastType="info"
      />,
      {
        wrapper,
      }
    );
    await userEvent.click(screen.getByText("Click Me"));
    expect(screen.queryByText("Something Happened!")).not.toBeInTheDocument();
    expect(screen.getByText("Custom Title")).toBeInTheDocument();
    expect(screen.getByText("test string")).toBeInTheDocument();
  });

  describe("displays a toast which corresponds to the variant dispatched", () => {
    it("success", async () => {
      render(<ToastComponent params={["test string"]} toastType="success" />, {
        wrapper,
      });
      await userEvent.click(screen.getByText("Click Me"));
      expect(screen.getByDataCy("toast")).toBeInTheDocument();
      expect(screen.getByText("Success!")).toBeInTheDocument();
      expect(screen.getByText("test string")).toBeInTheDocument();
    });
    it("error", async () => {
      render(<ToastComponent params={["test string"]} toastType="error" />, {
        wrapper,
      });
      await userEvent.click(screen.getByText("Click Me"));
      expect(screen.getByDataCy("toast")).toBeInTheDocument();
      expect(screen.getByText("Error!")).toBeInTheDocument();
      expect(screen.getByText("test string")).toBeInTheDocument();
    });
    it("warning", async () => {
      render(<ToastComponent params={["test string"]} toastType="warning" />, {
        wrapper,
      });
      await userEvent.click(screen.getByText("Click Me"));
      expect(screen.getByDataCy("toast")).toBeInTheDocument();
      expect(screen.getByText("Warning!")).toBeInTheDocument();
      expect(screen.getByText("test string")).toBeInTheDocument();
    });
    it("info", async () => {
      render(<ToastComponent params={["test string"]} toastType="info" />, {
        wrapper,
      });
      await userEvent.click(screen.getByText("Click Me"));
      expect(screen.getByDataCy("toast")).toBeInTheDocument();
      expect(screen.getByText("Something Happened!")).toBeInTheDocument();
      expect(screen.getByText("test string")).toBeInTheDocument();
    });
    it("progress", async () => {
      render(<ToastComponent params={["test string"]} toastType="progress" />, {
        wrapper,
      });
      await userEvent.click(screen.getByText("Click Me"));
      expect(screen.getByDataCy("toast")).toBeInTheDocument();
      expect(screen.getByText("Loading...")).toBeInTheDocument();
      expect(screen.getByText("test string")).toBeInTheDocument();
    });
  });

  describe("closing the toast", () => {
    it("should be able to close a toast by clicking the x by default", async () => {
      render(<ToastComponent params={["test string"]} toastType="info" />, {
        wrapper,
      });
      await userEvent.click(screen.getByText("Click Me"));
      expect(screen.getByDataCy("toast")).toBeInTheDocument();

      const closeButton = screen.getByLabelText("X Icon");
      expect(closeButton).toBeInTheDocument();
      await userEvent.click(closeButton);
      await waitFor(() => {
        expect(screen.queryByDataCy("toast")).not.toBeInTheDocument();
      });
    });
    it("should not be able to close the toast when closable is false", async () => {
      render(
        <ToastComponent params={["test string", false]} toastType="info" />,
        {
          wrapper,
        }
      );
      await userEvent.click(screen.getByText("Click Me"));
      expect(screen.getByDataCy("toast")).toBeInTheDocument();
      expect(screen.queryByLabelText("X Icon")).toBeNull();
    });
    it("should trigger a callback function onClose", async () => {
      const onClose = jest.fn();
      render(
        <ToastComponent
          params={["test string", true, { onClose }]}
          toastType="info"
        />,
        {
          wrapper,
        }
      );
      await userEvent.click(screen.getByText("Click Me"));
      expect(screen.getByDataCy("toast")).toBeInTheDocument();

      const closeButton = screen.getByLabelText("X Icon");
      expect(closeButton).toBeInTheDocument();
      await userEvent.click(closeButton);
      await waitFor(() => {
        expect(screen.queryByDataCy("toast")).not.toBeInTheDocument();
      });
      expect(onClose).toHaveBeenCalledTimes(1);
    });
    it("should close on its own after a timeout has completed", async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(<ToastComponent params={["test string"]} toastType="info" />, {
        wrapper,
      });
      await user.click(screen.getByText("Click Me"));
      expect(screen.getByDataCy("toast")).toBeInTheDocument();

      // Advance timer so that the timeout is triggered.
      act(() => {
        jest.advanceTimersByTime(TOAST_TIMEOUT);
      });
      await waitFor(() => {
        expect(screen.queryByDataCy("toast")).not.toBeInTheDocument();
      });
      jest.useRealTimers();
    });
    it("should close the toast when hide() is called", async () => {
      const { rerender } = render(
        <ToastComponent params={["test string", true]} toastType="info" />,
        {
          wrapper,
        }
      );
      await userEvent.click(screen.getByText("Click Me"));
      expect(screen.getByDataCy("toast")).toBeInTheDocument();

      rerender(<ToastComponent params={[]} toastType="hide" />);
      await userEvent.click(screen.getByText("Click Me"));
      await waitFor(() => {
        expect(screen.queryByDataCy("toast")).not.toBeInTheDocument();
      });
    });
  });
});

describe("mocked toast", () => {
  it("should be able to mock the toast in a component test", async () => {
    const {
      Component,
      useToastContext: useToastContextSpied,
      dispatchToast,
    } = RenderFakeToastContext(
      <ToastComponent params={["test"]} toastType="success" />
    );
    render(<Component />);
    await userEvent.click(screen.getByText("Click Me"));
    expect(useToastContextSpied).toHaveBeenCalledTimes(1);
    expect(dispatchToast.success).toHaveBeenCalledWith("test");
  });

  it("should be able to mock the toast in a hook test", () => {
    const useUpdateToastTest = () => {
      const dispatchToast = useToastContext();
      dispatchToast.success("test");
    };

    const {
      HookWrapper,
      useToastContext: useToastContextSpied,
      dispatchToast,
    } = RenderFakeToastContext();
    renderHook(() => useUpdateToastTest(), { wrapper: HookWrapper });
    expect(useToastContextSpied).toHaveBeenCalledTimes(1);
    expect(dispatchToast.success).toHaveBeenCalledWith("test");
  });
});
