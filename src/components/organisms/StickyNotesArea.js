import React from "react";
import StickyNote from "./StickyNote";

const StickyNotesArea = (props) => {
  const stickyNotes = props.words?.map((data, index) => (
    <StickyNote data={data} key={index} />
  ));
  return <div>{stickyNotes}</div>;
};

export default StickyNotesArea;
