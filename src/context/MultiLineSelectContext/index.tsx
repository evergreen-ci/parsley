import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { QueryParams } from "constants/queryParams";
import useLineRangeSelection from "hooks/useLineRangeSelection";
import { useQueryParam } from "hooks/useQueryParam";
import { SentryBreadcrumb, leaveBreadcrumb } from "utils/errorReporting";

type MultiLineSelectContextState = {
  handleSelectLine: (selectedLine: number, shiftClick: boolean) => void;
  clearSelection: () => void;
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
  const [shareLine] = useQueryParam<number | undefined>(
    QueryParams.ShareLine,
    undefined
  );

  const hasShareLine = shareLine !== undefined;
  const hasEndingLine = selectedLines.endingLine !== undefined;

  const initialMenuPosition =
    hasShareLine && hasEndingLine
      ? selectedLines.endingLine
      : selectedLines.startingLine;

  const [menuPosition, setMenuPosition] = useState<number | undefined>(
    initialMenuPosition ?? undefined
  );

  const clearSelection = useCallback(() => {
    setSelectedLines({ endingLine: undefined, startingLine: undefined });
    setMenuPosition(undefined);
    leaveBreadcrumb("Clear line range", {}, SentryBreadcrumb.UI);
  }, [setSelectedLines]);

  const handleSelectLine = useCallback(
    (selectedLine: number, shiftClick: boolean) => {
      if (shiftClick) {
        setSelectedLines({
          endingLine: selectedLine,
          startingLine: selectedLines.startingLine,
        });
        setOpenMenu(true);
        leaveBreadcrumb(
          "Shift click on line range",
          {
            endingLine: selectedLine,
            startingLine: selectedLines.startingLine,
          },
          SentryBreadcrumb.UI
        );
      } else {
        setSelectedLines({ endingLine: undefined, startingLine: selectedLine });
        leaveBreadcrumb(
          "Set initial line range",
          { endingLine: undefined, startingLine: selectedLine },
          SentryBreadcrumb.UI
        );
      }

      if (selectedLines.startingLine === selectedLine) {
        clearSelection();
      } else {
        setMenuPosition(selectedLine);
      }
    },
    [selectedLines, setSelectedLines, clearSelection]
  );

  const bothLinesSelected = useMemo(
    () =>
      selectedLines.startingLine !== undefined &&
      selectedLines.endingLine !== undefined,
    [selectedLines]
  );
  const memoizedContext = useMemo(
    () => ({
      clearSelection,
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
