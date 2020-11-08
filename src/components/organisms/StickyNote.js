import React from "react";
import { Button, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const StickyNote = (props) => {
  const classes = useStyles();
  let word = props.word;
  return <p className={classes.container}>{word}</p>;
};
///////
//Style
///////
const useStyles = makeStyles({
  container: {
    display: "inline-block",
    backgroundColor: "#FEF3B5",
    padding: "10px",
    margin: "5px",
    whiteSpace: "pre-wrap",
  },
});

export default StickyNote;
