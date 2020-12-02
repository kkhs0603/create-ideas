import React, { useState, useContext } from "react";
import Draggable from "react-draggable";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import { CanvasContext } from "../../contexts/CanvasContext";

const Line = (props) => {
  const [cursor, setCursor] = useState("grab");
  const [position, setPosition] = useState({
    x: props.x,
    y: props.y,
  });
  const classes = useStyles();
  const { moveLine } = useContext(CanvasContext);

  let lineClasses = classes.container;
  let axis = null;
  switch (props.vh) {
    case "vertical":
      lineClasses = classNames(classes.container, classes.vertical);
      axis = "x";
      break;
    case "horizontal":
      lineClasses = classNames(classes.container, classes.horizontal);
      axis = "y";
      break;
    default:
      lineClasses = classes.container;
      break;
  }

  const handleStart = () => {
    setCursor("grabbing");
  };

  const handleDrag = () => {
    setCursor("grabbing");
  };

  const handleStop = (e, ui) => {
    setCursor("grab");
    if (props.vh === "vertical") {
      setPosition({ x: ui.x, y: 0 });
    } else if (props.vh === "horizontal") {
      setPosition({ x: 0, y: ui.y });
    }
    moveLine(props.canvasId, props.id, ui.x, ui.y);
  };
  return (
    <Draggable
      axis={axis}
      onStart={handleStart}
      onDrag={handleDrag}
      onStop={handleStop}
      position={{ x: position.x, y: position.y }}
      bounds="parent"
    >
      <div className={lineClasses} style={{ cursor: cursor }}></div>
    </Draggable>
  );
};

///////
//Style
///////
const useStyles = makeStyles({
  container: {
    position: "absolute",
    backgroundColor: "black",
  },
  vertical: {
    width: "5px",
    height: "100%",
    margin: "0px 5px",
  },
  horizontal: {
    width: "100%",
    height: "5px",
    margin: "5px 0px",
  },
});

export default Line;
