import React, { useContext } from "react";
import { ListItem, ListItemText, Card, CardContent } from "@material-ui/core";
import { AuthContext } from "../../contexts/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";
const SelectCanvas = (props) => {
  const canvases = props.canvases;
  const router = useRouter();
  console.log(canvases);
  if (canvases == null) {
    return <></>;
  } else {
    const sortedCanvases = canvases.sort((a, b) =>
      a.created_at < b.created_at ? 1 : -1
    );
    return sortedCanvases.map((canvas) => {
      return (
        <ListItem
          key={canvas.created_at}
          button
          onClick={() =>
            router.push("/Canvases/[id]", `/Canvases/${canvas.id}`)
          }
        >
          {/* <Link
            href={{ pathname: `/Canvases/${canvas.id}` }}
            as={`/Canvases/${canvas.id}`}
          >
            <a>test</a>
          </Link> */}
          <Card variant="outlined">
            <CardContent>{"canvas名：" + canvas.name}</CardContent>
            <CardContent>{"created_by：" + canvas.created_by}</CardContent>
            <CardContent>{"created_at：" + canvas.created_at}</CardContent>
          </Card>
          {/* <ListItemText key={canvas.created_at} primary={caption} /> */}
        </ListItem>
      );
    });
  }
};

export default SelectCanvas;
