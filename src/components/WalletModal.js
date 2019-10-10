import React from "react";
import Modal from "react-modal";

class WalletModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputBudget: ''
    }
  }

  handleChange = async e => {
    e.persist();
    await this.setState(() => {
      return {
        [e.target.name]: e.target.value
      }
    });
  }

  setNewBudget = number => {
    this.props.setNewBudget(number);
    this.setState(() => ({ inputBudget: '' }));
    this.props.toggle();
  }

  render() {
    return (
      <Modal
        isOpen={!!this.props.modalVisible}
        contentLabel="Set Wallet"
        onRequestClose={this.props.toggle}
        closeTimeoutMS={200}
        className="modal"
      >
        <input
          className="inputBox inputBox__setWalletModal"
          name="inputBudget"
          type="text"
          placeholder="Enter new Budget..."
          onChange={this.handleChange}
          value={this.state.inputBudget}
        />
        <button className="buttons buttons__setWallet" onClick={() => this.setNewBudget(this.state.inputBudget)}>SET</button>
        <button className="buttons buttons__setWallet" onClick={this.props.toggle}>CLOSE</button>
      </Modal>
    );
  }
}
Modal.setAppElement('#root');

export default WalletModal;