import React, { useRef, useEffect } from "react";
import StickyNote from "./StickyNote";
import { makeStyles } from "@material-ui/core/styles";

const StickyNotesArea = (props) => {
  const ref = useRef(null);
  const classes = useStyles();
  const stickyNotes = props.words?.map((data, index) => (
    <StickyNote
      data={data}
      key={index}
      parent={ref.current?.getBoundingClientRect()}
    />
  ));
  return (
    <div ref={ref} className={classes.container}>
      {stickyNotes}
    </div>
  );
};
///////
//Style
///////
const useStyles = makeStyles({
  container: {
    // width: "100%",
    height: "80vh",
    // backgroundColor: "#EEE",
    // position: "relative",
    // overflow: "auto",
    // padding: "0",

    backgroundColor: "white",
    position: "relative",
    borderRadius: "5px",
    border: "10px solid #adb2bd",
    boxShadow: "inset -1px 2px 2px #404040, 6px 9px 1px rgba(0, 0, 0, 0.2)",
    overflow: "hidden"
  },
});

export default StickyNotesArea;
