import React, { useContext } from "react";
import {
  Button,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
const SelectCanvas = (props) => {
  const classes = useStyles();
  const canvases = props.canvases;
  const router = useRouter();
  if (!canvases) return <></>;

  const cards = canvases.map((canvas, index) => {
    return (
      <Card className={classes.card} key={index} variant="outlined">
        <CardActionArea
          onClick={() =>
            router.push("/Canvases/[id]", `/Canvases/${canvas.id}`)
          }
        >
          <CardMedia
            className={classes.media}
            image={
              canvas.thumbnailUrl
                ? canvas.thumbnailUrl
                : "https://firebasestorage.googleapis.com/v0/b/create-ideas-cea7b.appspot.com/o/images%2Ftemplates%2FnoImage.png?alt=media&token=58161723-b8ea-42b1-815c-17f83f5314d9"
            }
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {canvas.name}
            </Typography>
            <Typography gutterBottom>更新日時：{canvas.updatedAt}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  });
  return <div className={classes.container}>{cards}</div>;
};

export default SelectCanvas;

///////
//Style
///////
const useStyles = makeStyles({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  card: {
    margin: 20,
  },
  media: {
    height: 140,
    width: 240,
  },
});
