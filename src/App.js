import React from 'react';
import Modal from "react-modal";
import './App.css';

import AddForm from "./components/AddForm";
import WalletModal from "./components/WalletModal";
import RecordList from "./components/RecordList";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wallet: 0,
      modalVisible: false,
      modalRecordItem: false,
      expenses: []
    }
  }

  componentDidMount = () => {
    const json = localStorage.getItem('wallet');
    if (json) {
      const jsonObj = JSON.parse(json);
      this.setState(() => {
        return jsonObj;
      });
    }
  }

  componentDidUpdate = () => {
    const wallet = JSON.stringify(this.state);
    localStorage.setItem('wallet', wallet);
  }

  submitForm = record => {
    const currentWallet = this.state.wallet - record.exp;
    this.setState(() => ({
      wallet: currentWallet,
      expenses: [record, ...this.state.expenses],
    }));
  }

  toggleModal = () => {
    this.setState(() => ({ modalVisible: !this.state.modalVisible }));
  }

  toggleRecord = () => {
    this.setState(() => ({ modalRecordItem: !this.state.modalRecordItem }));
  }

  setNewBudget = number => {
    this.setState(() => {
      return {
        wallet: number
      }
    });
  }

  clearData = () => {
    if (window.confirm('Are you sure you want to clear data?')) {
      this.setState(() => {
        return {
          expenses: []
        }
      });
    }
  }

  render() {
    return (
      <div>
        {/* AddForm */}
        <AddForm
          submitForm={this.submitForm}
        />
        {/* WalletModal */}
        <WalletModal
          appElement={document.getElementById('#root')}
          modalVisible={this.state.modalVisible}
          toggle={this.toggleModal}
          setNewBudget={this.setNewBudget}
        />
        <button className="buttons" onClick={this.toggleModal}>SET WALLET</button>
        <button className="buttons" onClick={this.clearData}>CLEAR DATA</button>

        {/* Header: Wallet */}
        <div>
          <h2 className="fontColor">Wallet: {this.state.wallet}</h2>
        </div>

        {/* RecordList short ver. */}
        {
          this.state.expenses.map((recordItem, index) => index < 10 ?
            <p className="fontColor" key={recordItem.id}>
              {`${recordItem.month}${recordItem.date} ${recordItem.title} ${recordItem.exp}`}
            </p> : null
          )
        }
        <button className="buttons" onClick={this.toggleRecord}>SHOW ALL RECORDS</button>

        {/* RecordList All records */}
        <div>
          <Modal
            isOpen={!!this.state.modalRecordItem}
            contentLabel="Record list items"
            onRequestClose={this.toggleRecord}
            closeTimeoutMS={200}
          >
            <button className="buttons" onClick={this.toggleRecord}>CLOSE</button>
            <RecordList
              expenses={this.state.expenses}
            />
          </Modal>
        </div>
      </div>
    );
  }
}

Modal.setAppElement('#root');

export default App;
