import React from "react";
import uuid from 'uuid';

class AddForm extends React.Component {
  constructor(props) {
    super(props);
    const currentDate = new Date();
    this.state = {
      inputMonth: currentDate.getMonth() + 1 < 10 ? '0' + currentDate.getMonth() + 1 : currentDate.getMonth() + 1,
      inputDate: currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate(),
      inputTitle: '',
      inputExp: ''
    }
  }

  submitForm = e => {
    e.preventDefault();
    const id = uuid.v4();
    const month = e.target.inputMonth.value;
    const date = e.target.inputDate.value;
    const title = e.target.inputTitle.value;
    const exp = e.target.inputExp.value;
    const record = {
      id,
      month,
      date,
      title,
      exp
    };
    this.props.submitForm(record);
    this.setState(() => ({
      inputTitle: '',
      inputExp: ''
    }));
  }

  handleInput = async e => {
    await this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    const currentDate = new Date();
    return (
      <div>
        <form onSubmit={this.submitForm}>
          <input
            className="inputBox inputBox__addFormDate"
            name="inputMonth"
            type="text"
            placeholder="Month"
            onChange={this.handleInput}
            value={this.state.inputMonth}
          />
          <input
            className="inputBox inputBox__addFormDate"
            name="inputDate"
            type="text"
            placeholder="Date"
            onChange={this.handleInput}
            value={this.state.inputDate}
          />
          <input
            className="inputBox"
            name="inputTitle"
            type="text"
            placeholder="Enter title..."
            onChange={this.handleInput}
            value={this.state.inputTitle}
          />
          <input
            className="inputBox"
            name="inputExp"
            type="text"
            placeholder="Enter amount"
            onChange={this.handleInput}
            value={this.state.inputExp}
          />
          <button type="submit" className="buttons buttons__addFormBtn">ADD</button>
          <button type="button" className="buttons buttons__addFormBtn" onClick={this.props.toggle}>SET WALLET</button>
        </form>
      </div>
    );
  }
}

export default AddForm;