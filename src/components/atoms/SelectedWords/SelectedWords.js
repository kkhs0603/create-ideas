import React from "react";
import Style from "./SelectedWords.module.scss";

export const SelectedWords = (props) => {
  const selected = props.words.map((element, i) => {
    if (i + 1 === props.words.length) {
      return (
        <div className={Style.selectedWords} key={i}>
          <div className={Style.word} key={element.key}>
            {element}
          </div>
        </div>
      );
    } else {
      return (
        <div className={Style.selectedWords} key={i}>
          <div className={Style.word} key={element.key}>
            {element}
          </div>
          <div className={Style.cross}>×</div>
        </div>
      );
    }
  });
  return <div className={Style.wrapper}>{selected}</div>;
};
