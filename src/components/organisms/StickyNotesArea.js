import React from "react";
import StickyNote from "./StickyNote";

const StickyNotesArea = (props) => {
  const stickyNotes = props.words?.map((word, index) => (
    <StickyNote word={word} key={index} />
  ));
  return <div>{stickyNotes}</div>;
};

export default StickyNotesArea;
