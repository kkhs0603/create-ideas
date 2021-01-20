import React, { useContext } from "react";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import { Lock, LockOpen } from "@material-ui/icons";

import { CanvasContext } from "../../contexts/CanvasContext";

const LockButton = (props) => {
  const { lockCanvasObject } = useContext(CanvasContext);
  return (
    <div style={{ paddingLeft: 15 }}>
      <FormControlLabel
        control={
          <Checkbox
            icon={<LockOpen />}
            checkedIcon={<Lock />}
            name="checkedH"
            checked={props.isLocked}
            onChange={() =>
              lockCanvasObject(
                props.canvasId,
                props.objName,
                props.id,
                !props.isLocked
              )
            }
          />
        }
        label=""
      />
    </div>
  );
};

export default LockButton;
