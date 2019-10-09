import React from "react";

class AddForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputTitle: '',
      inputExp: ''
    }
  }

  submitForm = e => {
    e.preventDefault();
    const id = Math.floor(Math.random() * 1000000);
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1 < 10 ? '0' + currentDate.getMonth() + 1 : currentDate.getMonth() + 1;
    const date = currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate();
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
    return (
      <div>
        <form onSubmit={this.submitForm}>
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
          <button className="buttons">ADD</button>
        </form>
      </div>
    );
  }
}

export default AddForm;