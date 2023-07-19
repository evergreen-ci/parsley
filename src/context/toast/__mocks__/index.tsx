import * as toast from "..";
import { useToastContext } from "..";

/**
 * RenderFakeToastContext is a utility that takes a React Component which uses useToastContext and returns a
 * React Component which renders the component with the context mocked out.
 * It is meant to be used for testing components that rely on the useToastContext hook. It also exposes some
 * methods to assert that the toast context was called with the correct parameters.
 * @param Component - A React Component which uses useToastContext
 * @returns an object with the Component, the mocked useToastContext, and the dispatchToast methods
 */
const RenderFakeToastContext = (Component: React.ReactElement = <div />) => {
  const { useToastContext: useToastContextSpied, dispatchToast } =
    mockUseToastContext();

  return {
    Component: () => Component,
    useToastContext: useToastContextSpied,
    dispatchToast,
  };
};

/**
 * `mockUseToastContext` is a utility that mocks the useToastContext hook and returns the mocked hook and the dispatchToast methods.
 * @returns an object with the mocked useToastContext and the dispatchToast methods
 */
const mockUseToastContext = () => {
  const dispatchToast: ReturnType<typeof useToastContext> = {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    progress: jest.fn(),
  };
  const useToastContextSpied = jest
    .spyOn(toast, "useToastContext")
    .mockImplementation(() => ({
      ...dispatchToast,
    }));
  return {
    useToastContext: useToastContextSpied,
    dispatchToast,
  };
};

export { RenderFakeToastContext, mockUseToastContext };
