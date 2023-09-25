import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import useLineRangeSelection from "hooks/useLineRangeSelection";

type MultiLineSelectContextState = {
  handleSelectLine: (selectedLine: number, shiftClick: boolean) => void;
  clearSelection: () => void;
  handleCloseMenu: () => void;
  menuPosition: number | undefined;
  openMenu: boolean;
  selectedLines: {
    startingLine?: number;
    endingLine?: number;
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
  const [selectedLines, setSelectedLines] = useLineRangeSelection();
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [menuPosition, setMenuPosition] = useState<number | undefined>(
    selectedLines.startingLine ?? undefined
  );

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
      } else if (selectedLines.startingLine === selectedLine) {
        setSelectedLines({ endingLine: undefined, startingLine: undefined });
      } else {
        setSelectedLines({ endingLine: undefined, startingLine: selectedLine });
      }
      setOpenMenu(true);
      if (selectedLines.startingLine === selectedLine) {
        setMenuPosition(undefined);
      } else {
        setMenuPosition(selectedLine);
      }
    },
    [selectedLines]
  );
  const clearSelection = useCallback(() => {
    setSelectedLines({ endingLine: undefined, startingLine: undefined });
  }, []);

  const bothLinesSelected = useMemo(
    () =>
      selectedLines.startingLine !== undefined &&
      selectedLines.endingLine !== undefined,
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
