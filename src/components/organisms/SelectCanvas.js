import React from "react";
import { ListItem, ListItemText, Card, CardContent } from "@material-ui/core";

const SelectCanvas = (props) => {
  const canvases = props.canvases;
  return canvases === null ? (
    <></>
  ) : (
    <div>
      {canvases.map((canvas) => {
        const caption =
          "canvas:" + canvas.name + " created_by" + canvas.created_by;
        return (
          <ListItem key={canvas.created_at} button>
            <Card variant="outlined">
              <CardContent>{caption}</CardContent>
            </Card>
            {/* <ListItemText key={canvas.created_at} primary={caption} /> */}
          </ListItem>
        );
      })}
    </div>
  );
};

export default SelectCanvas;
