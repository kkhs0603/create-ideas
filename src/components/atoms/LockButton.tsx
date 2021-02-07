import React, { useContext, useState } from "react";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import { Lock, LockOpen } from "@material-ui/icons";

import { MaterialsContext } from "../../contexts/MaterialsContext";

const LockButton = React.forwardRef((props, ref) => {
  const { lockMaterial } = useContext(MaterialsContext);
  //const [isLocked, setIsLocked] = useState<boolean>(props.isLocked);
  return (
    <div style={{ paddingLeft: 15 }} ref={ref}>
      <FormControlLabel
        control={
          <Checkbox
            icon={<LockOpen />}
            checkedIcon={<Lock />}
            name="checkedH"
            checked={props.isLocked}
            onChange={(e) => {
              //setIsLocked(e.target.checked);
              // props.setProps({ ...props.state, isLocked: e.target.checked });
              lockMaterial(
                props.canvasId,
                props.objName,
                props.id,
                !props.isLocked
              );
            }}
          />
        }
        label=""
      />
    </div>
  );
});

export default LockButton;
