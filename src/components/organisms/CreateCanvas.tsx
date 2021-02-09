import React, { useContext, useState } from "react";
import {
  Button,
  TextField,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import { CanvasContext } from "../../contexts/CanvasContext";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { orange } from "@material-ui/core/colors";
import { AuthContext } from "../../contexts/AuthContext";

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
    padding: 20,
    margin: 40,
    borderRadius: 10,
    minWidth: 100,
  },
  section: {
    margin: "50px 0",
  },
  templates: {
    display: "flex",
    overflowX: "scroll",
    maxWidth: 700,
    minWidth: 100,
  },
  active: {
    maxWidth: 345,
    margin: 10,
    border: "3px solid black",
    flex: "0 0 180px",
    minWidth: 100,
  },
  inactive: {
    maxWidth: 345,
    margin: 10,
    flex: "0 0 180px",
    minWidth: 100,
  },
  media: {
    border: "1px solid #f1f1f1",
    height: 80,
    minWidth: 100,
  },
}));

const CreateCanvas = React.forwardRef((props, ref) => {
  const { createCanvas, templates } = useContext(CanvasContext);
  const { user } = useContext(AuthContext);
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
      key={index}
      className={`${
        index === selectedIndex ? classes.active : classes.inactive
      }`}
      variant="outlined"
    >
      <CardActionArea onClick={() => setSelectedIndex(index)}>
        {template.imageUrl ? (
          <CardMedia className={classes.media} image={template.imageUrl} />
        ) : (
          <></>
        )}
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
    <div className={classes.container} ref={ref}>
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
});

export default CreateCanvas;
