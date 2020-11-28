import React, { useRef, useEffect, useMemo, useState } from "react";
import StickyNote from "./StickyNote";
import { makeStyles } from "@material-ui/core/styles";
import firebase from "../../firebase/firebase";

const StickyNotesArea = (props) => {
  //console.log("stickyNoteArea")
  const ref = useRef(null);
  const classes = useStyles();
  const [words, setWords] = useState([]);

  useEffect(() => {
    const wordsRef = firebase
      .firestore()
      .collection("canvases")
      .doc(props.id)
      .collection("words");
    //wordsRef
    wordsRef.onSnapshot((snapshot) => {
      console.log("onsnap");
      setWords([]);
      setWords(snapshot.docs.map((word) => word.data()));
    });
  }, []);

  const stickyNotes = words?.map((data, index) => (
    <StickyNote
      data={data}
      key={index}
      parent={ref.current?.getBoundingClientRect()}
      canvasId={props.id}
    />
  ));
  return (
    <div ref={ref} className={classes.frame}>
      <div className={classes.container}>{stickyNotes}</div>
    </div>
  );
};
///////
//Style
///////
const useStyles = makeStyles({
  frame: {
    height: "70vh",
    backgroundColor: "white",
    position: "relative",
    borderRadius: "5px",
    border: "10px solid #adb2bd",
    boxShadow: "inset -1px 2px 2px #404040, 6px 9px 1px rgba(0, 0, 0, 0.2)",
    overflow: "scroll",
  },
  container: {
    height: "100vh",
    width: "1200px",
  },
});

export default StickyNotesArea;
