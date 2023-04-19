const renderComponentWithHook = <
  T extends () => any,
  U extends JSX.Element | null
>(
  useHook: T,
  Comp: U
) => {
  const hook: { current: ReturnType<typeof useHook> } = {
    current: {} as ReturnType<typeof useHook>,
  };
  const Component = () => {
    hook.current = useHook();
    return Comp;
  };
  return {
    Component,
    hook,
  };
};

export { renderComponentWithHook };
