import React from 'react';
import ListItem from "./ListItem";

const RecordList = props => {
  return (
    <div>
      {
        props.expenses ? props.expenses.map(
          record => <ListItem key={record.id} removeItem={props.removeItem} colorCheck={true} record={record} />) : null
      }
    </div>
  );
}

export default RecordList;