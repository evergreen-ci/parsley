import { useCallback, useState } from "react";
import { css } from "@emotion/react";
import ConfirmationModal from "@leafygreen-ui/confirmation-modal";
import { useNavigate } from "react-router-dom";
import { useLogDropAnalytics } from "analytics";
import { StyledRouterLink } from "components/styles";
import routes from "constants/routes";
import { zIndex } from "constants/tokens";
import { leaveBreadcrumb } from "utils/errorReporting";

interface UploadLinkProps {
  hasLogs: boolean;
  clearLogs: () => void;
}
const UploadLink: React.FC<UploadLinkProps> = ({ hasLogs, clearLogs }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { sendEvent } = useLogDropAnalytics();
  const handleClick = useCallback(() => {
    if (hasLogs) {
      sendEvent({ name: "Clicked Upload Link", hasLogs: true });
      setOpen(true);
    } else {
      leaveBreadcrumb("upload-link", { hasLogs }, "navigation");
      sendEvent({ name: "Clicked Upload Link", hasLogs: false });
      navigate(routes.upload);
    }
  }, [hasLogs, sendEvent, navigate]);
  return (
    <>
      <StyledRouterLink
        data-cy="upload-link"
        onClick={handleClick}
        to={hasLogs ? "#" : routes.upload}
      >
        Upload
      </StyledRouterLink>
      <ConfirmationModal
        buttonText="Confirm"
        css={css`
          z-index: ${zIndex.modal};
        `}
        data-cy="confirmation-modal"
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          clearLogs();
          setOpen(false);
          navigate(routes.upload);
        }}
        open={open}
        title="Navigating away will clear your current logs."
        variant="danger"
      >
        Are you sure you want to navigate away?
      </ConfirmationModal>
    </>
  );
};

export default UploadLink;
