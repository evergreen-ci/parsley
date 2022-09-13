import { useCallback, useState } from "react";
import { css } from "@emotion/react";
import ConfirmationModal from "@leafygreen-ui/confirmation-modal";
import { useNavigate } from "react-router-dom";
import { StyledRouterLink } from "components/styles";
import routes from "constants/routes";
import { size, zIndex } from "constants/tokens";

interface UploadLinkProps {
  hasLogs: boolean;
  clearLogs: () => void;
}
const UploadLink: React.FC<UploadLinkProps> = ({ hasLogs, clearLogs }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    if (hasLogs) {
      setOpen(true);
    } else {
      navigate(routes.upload);
    }
  }, [hasLogs, navigate]);
  return (
    <>
      <StyledRouterLink
        css={navLinkStyles}
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

const navLinkStyles = css`
  margin: 0 ${size.s};
`;

export default UploadLink;
