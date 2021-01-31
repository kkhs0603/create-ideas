import React, { useContext } from "react";
import { MaterialsContext } from "../../contexts/MaterialsContext";
import { MenuItem } from "@material-ui/core";

const FrontBackContextMenuItems = (props) => {
  const { bringForward, sendBackward, bringToFront, sendToBack } = useContext(
    MaterialsContext
  );
  return (
    <div>
      <MenuItem
        disabled={props.isLocked}
        onClick={() => {
          bringForward(
            props.canvasId,
            props.materialType,
            props.id,
            props.zIndex
          );
        }}
      >
        前面へ
      </MenuItem>
      <MenuItem
        disabled={props.isLocked}
        onClick={() => {
          bringToFront(props.canvasId, props.materialType, props.id);
        }}
      >
        最前面へ
      </MenuItem>
      <MenuItem
        disabled={props.isLocked}
        onClick={() => {
          sendBackward(
            props.canvasId,
            props.materialType,
            props.id,
            props.zIndex
          );
        }}
      >
        背面へ
      </MenuItem>
      <MenuItem
        disabled={props.isLocked}
        onClick={() => {
          sendToBack(props.canvasId, props.materialType, props.id);
        }}
      >
        最背面へ
      </MenuItem>
    </div>
  );
};

export default FrontBackContextMenuItems;
