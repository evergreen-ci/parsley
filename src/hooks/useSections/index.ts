import { useEffect, useState } from "react";

export interface CommandEntry {
  status?: "Running" | "Finished";
  step: number;
  totalSteps: number;
  lineStart: number;
  lineEnd?: number;
  command: string;
  functionName: string;
}
export type SectionData = Omit<CommandEntry, "status">[][] | undefined;

export interface UseSectionsResult {
  sectionData: SectionData;
  visibleSectionLines: Set<string>;
  setVisibleSectionLines: React.Dispatch<React.SetStateAction<Set<string>>>;
  closeAllSections: () => void;
  closeAllSectionsButOne: (sectionName: string) => void;
  expandAllSections: () => void;
  sectionsEnabled: boolean;
  setSectionsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}
export const useSections = (logs: string[]): UseSectionsResult => {
  const [sectionData, setSectionData] =
    useState<UseSectionsResult["sectionData"]>();

  const [sectionsEnabled, setSectionsEnabled] = useState(true);
  const [visibleSectionLines, setVisibleSectionLines] = useState<Set<string>>(
    new Set<string>()
  );

  useEffect(() => {
    if (logs.length) {
      const data = logs.reduce((accum, line, i) => {
        const lineData = processLine(line, i);
        if (!lineData) {
          return accum;
        }
        const copy = [...accum];
        if (lineData.status === "Finished") {
          copy[accum.length - 1].lineEnd = i;
        } else {
          copy.push(lineData);
        }
        return copy;
      }, [] as CommandEntry[]);

      const sectionMap = data.reduce((accum, v) => {
        const accumCopy = { ...accum };
        const dataCopy = { ...v };
        delete dataCopy.status;
        const { functionName } = dataCopy;
        if (accumCopy[functionName]) {
          accumCopy[functionName].push(v);
        } else {
          accumCopy[functionName] = [v];
        }
        return accumCopy;
      }, {} as any);
      setSectionData(Object.values(sectionMap));
    }
  }, [logs, sectionsEnabled]);

  const expandAllSections = () => {
    setVisibleSectionLines(new Set(sectionData?.map((v) => v[0].functionName)));
  };
  const closeAllSections = () => {
    setVisibleSectionLines(new Set([]));
  };
  const closeAllSectionsButOne = (sectionName: string) => {
    setVisibleSectionLines(new Set([sectionName]));
  };

  return {
    closeAllSections,
    closeAllSectionsButOne,
    expandAllSections,
    sectionData,
    sectionsEnabled,
    setSectionsEnabled,
    setVisibleSectionLines,
    visibleSectionLines,
  };
};

const processLine = (str: string, lineNum: number): CommandEntry | null => {
  if (str.startsWith("[P: ")) {
    // eslint-disable-next-line no-param-reassign
    str = str.substring(8);
  }
  const regex =
    /(Running|Finished) command '([^']+)'.*?in function '([^']+)'.*?\(step (\d+(\.\d+)?) of (\d+)\)/;

  const match = str.match(regex);

  if (match) {
    const status = match[1] as "Running" | "Finished";
    const command = match[2];
    const functionName = match[3];
    const step = parseFloat(match[4]);
    const totalSteps = parseFloat(match[6]);

    return {
      command,
      functionName,
      lineStart: lineNum,
      status,
      step,
      totalSteps,
    };
  }
  return null;
};
