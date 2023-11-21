import { useEffect, useState } from "react";

interface CommandEntry {
  status: "Running" | "Finished";
  step: number;
  totalSteps: number;
  lineStart: number;
  lineEnd?: number;
  command: string;
  functionName: string;
}
export const useSections = (logs: string[]) => {
  const [sectionData, setSectionData] = useState();

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
        const { functionName } = v;
        const copy = { ...accum };
        if (copy[functionName]) {
          copy[functionName].push(v);
        } else {
          copy[functionName] = [v];
        }
        return copy;
      }, {} as any);
      setSectionData(sectionMap);
    }
  }, [logs]);
  return { sectionData };
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
