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
            <IconButton
              onClick={() => {
                props.openDeleteModal(canvas.name, canvas.id);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </div>
          <div>
            {editCanvasId === canvas.id ? (
              <div style={{ display: "flex" }}>
                <div
                  style={{ width: "70%", alignItems: "flex-start", flex: "6" }}
                >
                  <TextField value={canvas.name} size="medium"></TextField>
                </div>
                <div
                  style={{ width: "20%", alignItems: "flex-end", flex: "1" }}
                >
                  <IconButton
                    onClick={() => {
                      handleEdit("");
                    }}
                  >
                    <CheckIcon fontSize="small" />
                  </IconButton>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex" }}>
                <h2
                  style={{ width: "70%", alignItems: "flex-start", flex: "6" }}
                >
                  {canvas.name}
                </h2>
                {props.user.uid === canvas.createdBy ? (
                  <div
                    style={{ width: "20%", alignItems: "flex-end", flex: "1" }}
                  >
                    <IconButton
                      onClick={() => {
                        handleEdit(canvas.id);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </div>
                ) : (
                  <></>
                )}
              </div>
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
    width: "320px",
    backgroundColor: "#f8f8f8",
  },
  media: {
    width: "420px",
    height: "190px",
  },
});
