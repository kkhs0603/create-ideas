import React, { useContext, useState } from "react";
import {
  Button,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import CheckIcon from "@material-ui/icons/Check";

const SelectCanvas = (props) => {
  const classes = useStyles();
  const canvases = props.canvases;
  const router = useRouter();
  const [editCanvasId, setEditCanvasId] = useState("");
  if (!canvases) return <></>;

  const handleEdit = (canvasId) => {
    setEditCanvasId(canvasId);
  };

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
        </CardActionArea>
        <CardContent>
          <div
            style={{
              visibility:
                props.user.uid === canvas.createdBy ? "visible" : "hidden",
              textAlign: "right",
            }}
          >
            {editCanvasId === canvas.id ? (
              <IconButton
                onClick={() => {
                  handleEdit("");
                }}
              >
                <CheckIcon fontSize="small" />
              </IconButton>
            ) : (
              <IconButton
                onClick={() => {
                  handleEdit(canvas.id);
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton onClick={() => {}}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </div>
          <div>
            {editCanvasId === canvas.id ? (
              <TextField value={canvas.name}></TextField>
            ) : (
              <Typography gutterBottom variant="h5" component="h2">
                {canvas.name}
              </Typography>
            )}
          </div>

          <Typography gutterBottom>更新日時：{canvas.updatedAt}</Typography>
        </CardContent>
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
