import React from "react";

const ListItem = props => {
  const { id, month, date, title, exp } = props.record;
  let color = '';
  if (props.colorCheck) {
    color = 'fontSize';
  } else {
    color = 'fontColor fontSize';
  }
  return (
    <div className="recordList">
      <span className={color} key={id}>{`${month}${date} ${title} ${exp}`}</span>
      <button className="buttons__clearBtn" onClick={() => props.removeItem(id)}>X</button>
    </div>
  );
}

export default ListItem;