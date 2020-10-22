import React from "react";
import { ListItem, ListItemText, Card, CardContent } from "@material-ui/core";

const SelectCanvas = (props) => {
  const canvases = props.canvases;
  console.log(canvases);
  if (canvases == null) {
    return <></>;
  } else {
    const sortedCanvases = canvases.sort(
      (a, b) => b.created_at.toDate() - a.created_at.toDate()
    );
    return sortedCanvases.map((canvas) => {
      return (
        <ListItem key={canvas.created_at} button>
          <Card variant="outlined">
            <CardContent>{"canvas名：" + canvas.name}</CardContent>
            <CardContent>{"created_by：" + canvas.created_by}</CardContent>
            <CardContent>
              {"created_at：" + canvas.created_at.toDate()}
            </CardContent>
          </Card>
          {/* <ListItemText key={canvas.created_at} primary={caption} /> */}
        </ListItem>
      );
    });
  }
};

export default SelectCanvas;
