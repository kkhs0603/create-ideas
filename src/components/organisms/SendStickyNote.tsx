import React, { useContext, useState } from "react";
import { Button, TextField } from "@material-ui/core";
import { CanvasContext } from "../../contexts/CanvasContext";
import { makeStyles } from "@material-ui/core/styles";

const SendStickyNote = (props) => {
  const classes = useStyles();
  const [word, setWord] = useState();
  const { addStickyNote } = useContext(CanvasContext);
  const handleChange = (word) => {
    setWord(word);
  };
  return (
    <div className={classes.container}>
      <TextField
        multiline
        InputProps={{ disableUnderline: true }}
        onChange={(event) => handleChange(event.target.value)}
        value={word}
      ></TextField>
      <Button
        onClick={() => {
          addStickyNote(props.id, word);
          setWord("");
        }}
      >
        送信
      </Button>
    </div>
  );
};

///////
//Style
///////
const useStyles = makeStyles({
  container: {
    display: "inline-block",
    backgroundColor: "#FEF3B5",
    margin: "5px",
    whiteSpace: "pre-wrap",
    padding: "0.5em 30px 0.5em",
    position: "relative",
    boxSizing: "border-box",
    boxShadow: "0 .25rem .25rem hsla(0, 0%, 0%, .1)",
    backgroundImage:
      "linear-gradient(180deg, hsla(0, 0%, 45%, .1) 0.5rem, hsla(0, 100%, 100%, 0) 2.5rem),linear-gradient(180deg, hsla(60, 100%, 85%, 1), hsla(60, 100%, 85%, 1))",
  },
});

export default SendStickyNote;
