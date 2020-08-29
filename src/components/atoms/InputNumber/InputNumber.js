import React from "react";
import Style from "./InputNumber.module.scss";
import PropTypes from "prop-types";

//TODO:AtomsでStateなどの状態管理を持たない
//TODO:Stateを持つ箇所と持たない箇所の責務を分ける。
//TODO:コンポーネント名、ChangeCounter/Counter でもいいかも
const InputNumber = (props) => {
  const { increment, decrement, count } = props;
  const type = props.enable ? "enable" : "disable";
  return (
    <div className={Style.numericUpDown} type={type}>
      <input
        type="button"
        value="-"
        className={Style.decrement}
        onClick={() => decrement(count)}
      />
      <input
        type="number"
        min="1"
        value={count}
        onChange={(e) => {
          props.onChange(e.target.value);
        }}
      />
      <input
        type="button"
        value="+"
        className={Style.increment}
        onClick={() => increment(count)}
      />
    </div>
  );
};

InputNumber.propTypes = {
  increment: PropTypes.func,
  decrement: PropTypes.func,
  count: PropTypes.number,
  enable: PropTypes.bool,
};

export default InputNumber;
