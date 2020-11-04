import React, { useContext } from "react";
import { ListItem, ListItemText, Card, CardContent } from "@material-ui/core";
import { AuthContext } from "../../contexts/AuthContext";
import { useRouter } from "next/router";
const SelectCanvas = (props) => {
  const canvases = props.canvases;
  const router = useRouter();
  if (canvases == null) {
    return <></>;
  } else {
    const sortedCanvases = canvases.sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : -1
    );
    return sortedCanvases.map((canvas) => {
      return (
        <ListItem
          key={canvas.createdAt}
          button
          onClick={() =>
            router.push("/Canvases/[id]", `/Canvases/${canvas.id}`)
          }
        >
          <Card variant="outlined">
            <CardContent>{"canvas名：" + canvas.name}</CardContent>
            <CardContent>{"created_by：" + canvas.createdBy}</CardContent>
            <CardContent>{"created_at：" + canvas.createdAt}</CardContent>
          </Card>
          {/* <ListItemText key={canvas.created_at} primary={caption} /> */}
        </ListItem>
      );
    });
  }
};

export default SelectCanvas;
