import React from "react";
import StickyNote from "./StickyNote";
import { makeStyles } from "@material-ui/core/styles";

const StickyNotesArea = (props) => {
  const classes = useStyles();
  const stickyNotes = props.words?.map((data, index) => (
    <StickyNote data={data} key={index} />
  ));
  return <div className={classes.container}>{stickyNotes}</div>;
};
///////
//Style
///////
const useStyles = makeStyles({
  container: {
    width: "100%",
    height: "500px",
    backgroundColor: "#EEE",
    position: "relative",
    overflow: "auto",
    padding: "0",
  },
});

export default StickyNotesArea;
