import React, { useContext, useState } from "react";
import { Button, TextField } from "@material-ui/core";
import { CanvasContext } from "../../contexts/CanvasContext";
import { makeStyles } from "@material-ui/core/styles";

const SendStickyNote = () => {
  const classes = useStyles();
  const [word, setWord] = useState();
  const { sendWord } = useContext(CanvasContext);
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
          setWord("");
          sendWord(word);
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
    backgroundColor: "#FEF3B5",
    padding: "20px",
  },
});

export default SendStickyNote;
