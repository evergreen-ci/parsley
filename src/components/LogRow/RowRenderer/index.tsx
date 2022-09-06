import {
  CellMeasurer,
  CellMeasurerCache,
  ListRowProps,
  ListRowRenderer,
} from "react-virtualized";

interface RowProps {
  listRowProps: ListRowProps;
  data: {
    getLine: (index: number) => string | undefined;
    wrap: boolean;
  };
}

interface ListRowRendererFunction {
  getLine: (index: number) => string | undefined;
  wrap: boolean;
  Row: React.FC<RowProps>;
}

const RowRenderer: RowRendererFunction = ({ Row, ...data }) => {
  const result = (props: ListRowProps) => {
    const { index, key, parent } = props;
    return (
      <CellMeasurer key={key} cache={cache} parent={parent} rowIndex={index}>
        <Row data={data} listRowProps={props} />
      </CellMeasurer>
    );
  };
  return result;
};

type RowRendererFunction = (data: ListRowRendererFunction) => ListRowRenderer;

const cache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 16,
});

export { RowRenderer, cache };
export type { RowProps };
