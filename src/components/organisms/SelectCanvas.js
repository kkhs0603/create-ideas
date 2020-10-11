import React from "react";
import { ListItem, ListItemText, Card, CardContent } from "@material-ui/core";

const SelectCanvas = (props) => {
  const canvases = props.canvases;
  return canvases === null ? (
    <></>
  ) : (
    <div>
      {canvases.map((canvas) => {
        return (
          <ListItem key={canvas.created_at} button>
            <Card variant="outlined">
              <CardContent>{"canvas名：" + canvas.name}</CardContent>
              <CardContent>{"created_by：" + canvas.created_by}</CardContent>
            </Card>
            {/* <ListItemText key={canvas.created_at} primary={caption} /> */}
          </ListItem>
        );
      })}
    </div>
  );
};

export default SelectCanvas;
