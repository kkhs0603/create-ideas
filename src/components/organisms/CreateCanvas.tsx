import React, { useContext, useState } from "react";
import {
  Button,
  TextField,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import { CanvasContext } from "../../contexts/CanvasContext";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { orange } from "@material-ui/core/colors";

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(orange[500]),
    backgroundColor: orange[500],
    "&:hover": {
      backgroundColor: orange[700],
    },
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  container: {
    backgroundColor: "white",
    padding: 100,
    borderRadius: 10,
  },
  section: {
    margin: "50px 0",
  },
  templates: {
    display: "flex",
  },
  active: {
    maxWidth: 345,
    margin: 10,
    border: "3px solid black",
  },
  inactive: {
    maxWidth: 345,
    margin: 10,
  },
  media: {
    border: "1px solid #f1f1f1",
    height: 80,
    width: "100%",
  },
}));

const CreateCanvas = () => {
  const { createCanvas, templates } = useContext(CanvasContext);
  const [canvasName, setCanvasName] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isOpendBackdrop, setIsOpendBackdrop] = useState<boolean>(false);
  const classes = useStyles();

  const handleSubmit = () => {
    if (canvasName === "") {
      setIsSubmitted(true);
    } else {
      setIsOpendBackdrop(true);
      const tempId = templates[selectedIndex].id;
      createCanvas(canvasName, tempId);
    }
  };

  const templatesComponent = templates.map((template, index) => (
    <Card
      className={`${
        index === selectedIndex ? classes.active : classes.inactive
      }`}
      key={index}
      variant="outlined"
    >
      <CardActionArea onClick={() => setSelectedIndex(index)}>
        <CardMedia className={classes.media} image={template.imageUrl} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {template.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {template.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  ));

  return (
    <div className={classes.container}>
      <Backdrop className={classes.backdrop} open={isOpendBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Typography gutterBottom variant="h4">
        Canvas作成
      </Typography>
      <div className={classes.section}>
        <Typography variant="h6">テンプレート</Typography>
        <div className={classes.templates}>{templatesComponent}</div>
      </div>
      <div className={classes.section}>
        <Typography variant="h6">Canvas名</Typography>
        <TextField
          error={isSubmitted && canvasName === ""}
          helperText={
            isSubmitted && canvasName === "" ? "Canvas名を入力してください" : ""
          }
          id="outlined-basic"
          variant="outlined"
          required
          fullWidth
          onChange={(e) => setCanvasName(e.target.value)}
        />
      </div>
      <div className={classes.section}>
        <ColorButton fullWidth onClick={handleSubmit}>
          Canvas作成
        </ColorButton>
      </div>
    </div>
  );
};

export default CreateCanvas;
