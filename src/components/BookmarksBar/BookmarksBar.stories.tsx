import { useEffect } from "react";
import styled from "@emotion/styled";
import { QueryParams } from "constants/queryParams";
import { useQueryParams } from "hooks/useQueryParam";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
import { ProcessedLogLines } from "types/logs";
import BookmarksBar from ".";

export default {
  component: BookmarksBar,
} satisfies CustomMeta<typeof BookmarksBar>;
const processedLogLines: ProcessedLogLines = Array.from(
  { length: 100 },
  (_, i) => i,
);

const Story = ({ ...args }: React.ComponentProps<typeof BookmarksBar>) => {
  const [, setSearchParams] = useQueryParams();

  useEffect(() => {
    setSearchParams({
      [QueryParams.ShareLine]: 21,
      [QueryParams.Bookmarks]: [4, 5, 6, 7, 21, 24, 30, 85],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <BookmarksBar {...args} />
    </Container>
  );
};
export const Default: CustomStoryObj<typeof BookmarksBar> = {
  argTypes: {
    scrollToLine: { action: "scrollToLine" },
  },
  args: {
    lineCount: 100,
    processedLogLines,
  },
  render: (args) => <Story {...args} />,
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 600px;
`;
