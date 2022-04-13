import ReactDOM from "react-dom";
import React from "react";
import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, Modal } from "@mui/material";
import { SYSTEM_01 } from "../../utils/constants";
import { Paragraph } from "../Typography/Paragraph/Paragraph";
import { Subtitle } from "../Typography/Subtitle/Subtitle";
import { useStyles } from './styles'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'


export const UserLeaveConfirmation = (
  message,
  callback,
  // confirmOpen,
  // setConfirmOpen
) => {
  const container = document.createElement("div");
  const classes = useStyles

  container.setAttribute("custom-confirm-view", "");

  const handleConfirm = (callbackState) => {
    ReactDOM.unmountComponentAtNode(container);
    callback(callbackState);
    // setConfirmOpen(false);
  };

  const handleCancel = (callbackState) => {
    ReactDOM.unmountComponentAtNode(container);
    callback();
    // setConfirmOpen(false);
  };

  document.body.appendChild(container);
  const { header, content } = JSON.parse(message);
  ReactDOM.render(
    <Modal
      open={true}
    >
      <Box sx={classes.modalCard}>
        <Box sx={classes.header as object}>
          <Subtitle fontWeight='700'>{header}</Subtitle>
        </Box>
        <Box sx={classes.content as object}>
          <ErrorOutlineIcon style={classes.errorOutline} />
          <Paragraph size='large' color={SYSTEM_01}>
            {content}
          </Paragraph>
          <Box display='flex' flexDirection='row'>
            <Button variant='contained' disableElevation sx={classes.cancelButton} onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant='contained' disableElevation sx={classes.submitButton} onClick={handleConfirm}>
              Confirm
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>,

    container
  );
};
