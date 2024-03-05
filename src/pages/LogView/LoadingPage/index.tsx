import { useEffect } from "react";
import styled from "@emotion/styled";
import { Body, BodyProps } from "@leafygreen-ui/typography";
import { useParams } from "react-router-dom";
import Icon from "components/Icon";
import LoadingBar from "components/LoadingBar";
import { LogTypes } from "constants/enums";
import { getResmokeLogURL } from "constants/logURLTemplates";
import { slugs } from "constants/routes";
import { fontSize, size } from "constants/tokens";
import { useLogContext } from "context/LogContext";
import { useToastContext } from "context/toast";
import { useLogDownloader } from "hooks";
import { useFetch } from "hooks/useFetch";
import NotFound from "pages/404";
import { LogkeeperMetadata } from "types/api";
import { SentryBreadcrumb, leaveBreadcrumb } from "utils/errorReporting";
import { getBytesAsString } from "utils/string";
import { useResolveLogURLAndRenderingType } from "./useResolveLogURLAndRenderingType";

interface LoadingPageProps {
  logType: LogTypes;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ logType }) => {
  const {
    [slugs.buildID]: buildID,
    [slugs.execution]: execution,
    [slugs.fileName]: fileName,
    [slugs.groupID]: groupID,
    [slugs.origin]: origin,
    [slugs.testID]: testID,
    [slugs.taskID]: taskID,
  } = useParams();
  const dispatchToast = useToastContext();
  const { ingestLines, setLogMetadata } = useLogContext();
  const {
    downloadURL,
    htmlLogURL,
    jobLogsURL,
    legacyJobLogsURL,
    loading: isLoadingEvergreen,
    rawLogURL,
    renderingType,
  } = useResolveLogURLAndRenderingType({
    buildID,
    execution,
    fileName,
    groupID,
    logType,
    origin,
    taskID,
    testID,
  });
  const { data: logkeeperMetadata, isLoading: isLoadingLogkeeperMetadata } =
    useFetch<LogkeeperMetadata>(
      getResmokeLogURL(buildID || "", { metadata: true, testID }),
      {
        skip: buildID === undefined,
      },
    );

  const {
    data,
    error,
    fileSize,
    isLoading: isLoadingLog,
  } = useLogDownloader({
    logType,
    url: downloadURL,
  });

  useEffect(() => {
    if (data && !isLoadingLogkeeperMetadata) {
      leaveBreadcrumb("ingest-log-lines", { logType }, SentryBreadcrumb.UI);
      setLogMetadata({
        buildID,
        execution: execution || String(logkeeperMetadata?.execution || 0),
        fileName,
        htmlLogURL,
        isUploadedLog: false,
        jobLogsURL,
        legacyJobLogsURL,
        logType,
        origin,
        rawLogURL,
        renderingType,
        taskID: taskID || logkeeperMetadata?.task_id,
        testID,
      });
      ingestLines(data, logType);
    }
    if (error) {
      dispatchToast.error(error);
    }
  }, [
    buildID,
    data,
    dispatchToast,
    error,
    execution,
    fileName,
    htmlLogURL,
    ingestLines,
    isLoadingLogkeeperMetadata,
    jobLogsURL,
    legacyJobLogsURL,
    logkeeperMetadata?.execution,
    logkeeperMetadata?.task_id,
    logType,
    origin,
    rawLogURL,
    renderingType,
    setLogMetadata,
    taskID,
    testID,
  ]);

  if (isLoadingLog || isLoadingEvergreen) {
    return (
      <Container>
        <LoadingBarContainer>
          <FlexRow>
            <LogoContainer>
              <AnimationWrapper>
                <Icon glyph="ParsleyLogo" size={36} useStroke />
              </AnimationWrapper>
              <StyledBody>Downloading log...</StyledBody>
            </LogoContainer>
            <DownloadSize>{getBytesAsString(fileSize)}</DownloadSize>
          </FlexRow>
          <LoadingBar indeterminate />
        </LoadingBarContainer>
      </Container>
    );
  }
  if (error) {
    return (
      <Container>
        <NotFound />
      </Container>
    );
  }
  return null;
};

const LoadingBarContainer = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  width: 40%;
  gap: ${size.s};
`;

const LogoContainer = styled.div`
  display: flex;
  gap: ${size.s};
  align-items: flex-end;
`;

const FlexRow = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const DownloadSize = styled.div`
  font-family: "Source Code Pro", monospace;
`;

const AnimationWrapper = styled.div`
  animation: sway 3s infinite ease-in-out;
  transform-origin: bottom;
  @keyframes sway {
    0% {
      transform: rotateZ(0deg);
    }
    25% {
      transform: rotateZ(-5deg);
    }
    50% {
      transform: rotateZ(5deg);
    }
    75% {
      transform: rotateZ(-5deg);
    }
    100% {
      transform: rotateZ(0deg);
    }
  }
`;

const StyledBody = styled(Body)<BodyProps>`
  font-size: ${fontSize.l};
`;

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
`;

export default LoadingPage;
