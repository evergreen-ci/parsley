import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type MultiLineSelectContextState = {
  handleSelectLine: (selectedLine: number, shiftClick: boolean) => void;
  clearSelection: () => void;
  handleCloseMenu: () => void;
  menuPosition: number | null;
  openMenu: boolean;
  selectedLines: {
    startingLine: number | null;
    endingLine: number | null;
  };
};

const MultiLineSelectContext =
  createContext<MultiLineSelectContextState | null>(null);

const useMultiLineSelectContext = () => {
  const context = useContext(MultiLineSelectContext);
  if (context === undefined) {
    throw new Error(
      "useMultiLineSelectContext must be used within a MultiLineSelectContextProvider"
    );
  }
  return context as MultiLineSelectContextState;
};

const MultiLineSelectContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [selectedLines, setSelectedLines] = useState<{
    startingLine: number | null;
    endingLine: number | null;
  }>({ endingLine: null, startingLine: null });
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [menuPosition, setMenuPosition] = useState<number | null>(null);

  const handleSelectLine = useCallback(
    (selectedLine: number, shiftClick: boolean) => {
      if (shiftClick) {
        if (
          selectedLines.startingLine &&
          selectedLines.startingLine > selectedLine
        ) {
          setSelectedLines({
            endingLine: selectedLines.startingLine,
            startingLine: selectedLine,
          });
        } else {
          setSelectedLines({
            endingLine: selectedLine,
            startingLine: selectedLines.startingLine,
          });
        }
      } else {
        setSelectedLines({ endingLine: null, startingLine: selectedLine });
      }
      setOpenMenu(true);
      setMenuPosition(selectedLine);
    },
    [selectedLines]
  );
  const clearSelection = useCallback(() => {
    setSelectedLines({ endingLine: null, startingLine: null });
  }, []);

  const bothLinesSelected = useMemo(
    () =>
      selectedLines.startingLine !== null && selectedLines.endingLine !== null,
    [selectedLines]
  );
  const memoizedContext = useMemo(
    () => ({
      clearSelection,
      handleCloseMenu: () => {
        setOpenMenu(false);
      },
      handleSelectLine,
      menuPosition,
      openMenu: openMenu && bothLinesSelected,
      selectedLines,
    }),
    [
      clearSelection,
      handleSelectLine,
      menuPosition,
      openMenu,
      bothLinesSelected,
      selectedLines,
    ]
  );
  return (
    <MultiLineSelectContext.Provider value={memoizedContext}>
      {children}
    </MultiLineSelectContext.Provider>
  );
};

export { MultiLineSelectContextProvider, useMultiLineSelectContext };
