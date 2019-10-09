import React from 'react';

const RecordList = props => {
  return (
    <div>
      {
        props.expenses ? props.expenses.map(
          record => <p key={record.id}>{`${record.month}${record.date} ${record.title} ${record.exp}`}</p>) : null
      }
    </div>
  );
}

export default RecordList;