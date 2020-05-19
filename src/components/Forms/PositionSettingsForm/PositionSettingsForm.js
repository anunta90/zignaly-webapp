import React from "react";
import "./PositionSettingsForm.scss";
import { Box } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import CloseIcon from "@material-ui/icons/Close";

/**
 *
 * @typedef {Object} DefaultProps
 * @property {Function} onClose
 */

/**
 *
 * @param {DefaultProps} props
 */

const PositionSettingsForm = (props) => {
  const { onClose } = props;
  const handleSubmit = () => {};

  return (
    <Box
      alignItems="center"
      bgcolor="grid.main"
      className="positionSettingsForm"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <CloseIcon className="closeIcon" onClick={onClose} />
      <span className="boxTitle">Choose Columns</span>
      <Box className="form" />
      <Box className="input-box" display="flex" flexDirection="row" justifyContent="center">
        <CustomButton className={"submitbutton"} onClick={handleSubmit}>
          Save Preference
        </CustomButton>
      </Box>
    </Box>
  );
};

export default PositionSettingsForm;
