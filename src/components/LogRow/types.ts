import { ListRowProps, ListRowRenderer } from "react-virtualized";

interface LogRowLineProps extends ListRowProps {
  wrap: boolean;
  lines: (number | number[])[];
  getLine: (line: number) => string;
}
type ListRowRendererFunction = (props: LogRowLineProps) => ListRowRenderer;

export type { ListRowRendererFunction, LogRowLineProps };
