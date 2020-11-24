import React, { useState, useContext, useRef ,useEffect} from "react";
import { withStyles } from '@material-ui/core/styles';
import { yellow,green ,red,blue} from '@material-ui/core/colors';
import { CanvasContext } from "../../contexts/CanvasContext";
import { Button, TextField, Menu, MenuItem,Radio,Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Draggable from "react-draggable";

const initialState = {
  mouseX: null,
  mouseY: null,
};

const StickyNote = (props) => {
  const classes = useStyles();
  const { deleteWord, deletable, movedStickyNote,changeStickyNoteColor } = useContext(CanvasContext);
  const [state, setState] = useState(initialState);
  const [position, setPosition] = useState({ x:props.data.positionX,y:props.data.positionY  });

  const handleClick = (e) => {
    e.preventDefault();
    setState({
      mouseX: e.clientX - 2,
      mouseY: e.clientY - 4,
    });
    
  };

  const handleClose = () => {
    setState(initialState);
  };

  const handleStart = () => {
  };

  const handleDrag = (e, ui) => {
    e.preventDefault();
    const nowPosition = position;
    setPosition({ x: nowPosition.x + ui.deltaX, y: nowPosition.y + ui.deltaY });
  };

  const handleStop = (e, ui) => {
    movedStickyNote(props.data.id, ui.x, ui.y);
  };
  const enableDelete = deletable(props.data.createdBy);

  const GreenRadio = withStyles({
    root: {
      color: green[400],
      '&$checked': {
        color: green[600],
      },
    },
    checked: {},
  })((props) => <Radio color="default" {...props} />);
  const YellowRadio = withStyles({
    root: {
      color: yellow[400],
      '&$checked': {
        color: yellow[600],
      },
    },
    checked: {},
  })((props) => <Radio color="default" {...props} />);
  const RedRadio = withStyles({
    root: {
      color: red[400],
      '&$checked': {
        color: red[600],
      },
    },
    checked: {},
  })((props) => <Radio color="default" {...props} />);
  const BlueRadio = withStyles({
    root: {
      color: blue[400],
      '&$checked': {
        color: blue[600],
      },
    },
    checked: {},
  })((props) => <Radio color="default" {...props} />);
  
  const [selectedColor, setSelectedColor] = useState(props.data.color);

  const handleChangeColor = (event) => {
    setSelectedColor(event.target.value);
    changeStickyNoteColor(props.data.id,event.target.value)
  };

  let color = classes.yellow;
  switch (props.data.color) {
    case "yellow":
      color = classes.yellow;
      break;
    case "green":
      color = classes.green;
      break;
    case "red":
      color = classes.red;
      break;
    case "blue":
      color = classes.blue;
      break;
    default:
      color = classes.yellow;
      break;
  }
  
  return (
    <Draggable
      position={{x:position.x,y:position.y}}
      onStart={handleStart}
      onDrag={handleDrag}
      onStop={handleStop}
      bounds="parent"
    >
      <div
        className={color}
        onClick={(e) => {e.preventDefault()}}
        onContextMenu={handleClick}
      >
        <p>{props.data.word}</p>
        <Menu
          keepMounted
          open={state.mouseY !== null}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={
            state.mouseY !== null && state.mouseX !== null
              ? { top: state.mouseY, left: state.mouseX }
              : undefined
          }
        >
          <MenuItem disabled>
            付箋の色
          </MenuItem>
          <YellowRadio
            checked={selectedColor === 'yellow'}
            onChange={handleChangeColor}
            value="yellow"
          />
          <GreenRadio
            checked={selectedColor === 'green'}
            onChange={handleChangeColor}
            value="green"
          />
          <RedRadio
            checked={selectedColor === 'red'}
            onChange={handleChangeColor}
            value="red"
          />
          <BlueRadio
            checked={selectedColor === 'blue'}
            onChange={handleChangeColor}
            value="blue"
          />
          <Divider />
          <MenuItem
            disabled={!enableDelete}
            onClick={() => {
              deleteWord(props.data.id);
              handleClose();
            }}
          >
            削除
          </MenuItem>
        </Menu>
      </div>
    </Draggable>
  );
};
///////
//Style
///////
const useStyles = makeStyles({
  yellow: {
    display: "inline-block",
    backgroundColor: "#FEF3B5",
    margin: "5px",
    whiteSpace: "pre-wrap",
    padding:"0.5em 30px 0.5em",
    position:"relative",
    boxSizing:"border-box",
    boxShadow: "0 .25rem .25rem hsla(0, 0%, 0%, .1)",
    backgroundImage:
    "linear-gradient(180deg, hsla(0, 0%, 45%, .1) 0.5rem, hsla(0, 100%, 100%, 0) 2.5rem),linear-gradient(180deg, hsla(60, 100%, 85%, 1), hsla(60, 100%, 85%, 1))",
  },
  red: {
    display: "inline-block",
    margin: "5px",
    whiteSpace: "pre-wrap",
    padding:"0.5em 30px 0.5em",
    position:"relative",
    boxSizing:"border-box",
    boxShadow: "0 .25rem .25rem hsla(0, 0%, 0%, .1)",
    backgroundImage:
    "linear-gradient(180deg, hsla(0, 0%, 45%, .1) 0.5rem, hsla(0, 100%, 100%, 0) 2.5rem),linear-gradient(180deg, hsla(15, 100%, 85%, 1), hsla(15, 100%, 85%, 1))",
  },
  green: {
    display: "inline-block",
    backgroundColor: "#CDFDB3",
    margin: "5px",
    whiteSpace: "pre-wrap",
    padding:"0.5em 30px 0.5em",
    position:"relative",
    boxSizing:"border-box",
    boxShadow: "0 .25rem .25rem hsla(0, 0%, 0%, .1)",
    backgroundImage:
    "linear-gradient(180deg, hsla(0, 0%, 45%, .1) 0.5rem, hsla(0, 100%, 100%, 0) 2.5rem),linearGradient(180deg, hsla(200, 100%, 85%, 1), hsla(200, 100%, 85%, 1))"
  
  },
  blue: {
    display: "inline-block",
    backgroundColor: "#AEDCF4",
    margin: "5px",
    whiteSpace: "pre-wrap",
    padding:"0.5em 30px 0.5em",
    position:"relative",
    boxSizing:"border-box",
    boxShadow: "0 .25rem .25rem hsla(0, 0%, 0%, .1)",
    backgroundImage:
    "linear-gradient(180deg, hsla(0, 0%, 45%, .1) 0.5rem, hsla(0, 100%, 100%, 0) 2.5rem),linearGradient(180deg, hsla(200, 100%, 85%, 1), hsla(200, 100%, 85%, 1))"
  },
  
});

export default StickyNote;
