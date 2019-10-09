import React from 'react';
import Modal from "react-modal";
import { CSVLink, CSVDownload } from "react-csv";
import './App.css';

import AddForm from "./components/AddForm";
import WalletModal from "./components/WalletModal";
import RecordList from "./components/RecordList";
const firebase = require('firebase');

class App extends React.Component {
  constructor(props) {
    super(props);
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1 < 10 ? '0' + currentDate.getMonth() + 1 : currentDate.getMonth() + 1;
    const date = currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate();
    this.state = {
      wallet: 0,
      modalVisible: false,
      modalRecordItem: false,
      expenses: [],
      currentDate: `${year}${month}${date}`
    }
  }

  componentDidMount = async () => {
    const json = localStorage.getItem('wallet');
    if (json) {
      const jsonObj = JSON.parse(json);
      this.setState(() => {
        return jsonObj;
      });
    }
    // else {
    //   const wallet = await firebase
    //     .firestore()
    //     .collection('wallet') // tables
    //     .onSnapshot(query => {
    //       const wallet = query.docs.map(_doc => {
    //         const data = _doc.data(); // get wallet data as object
    //         return data;
    //       });
    //       this.setState(() => {
    //         return {
    //           wallet: wallet
    //         }
    //       });
    //     });
    //   const expenses = await firebase
    //     .firestore()
    //     .collection('expenses')
    //     .onSnapshot(query => {
    //       const expenses = query.docs.map(_doc => {
    //         const data = _doc.data(); // gets every expenses as array
    //         return data;
    //       });
    //       this.setState(() => {
    //         return {
    //           expenses: expenses
    //         }
    //       });
    //     });
    // }
  }

  componentDidUpdate = () => {
    const wallet = JSON.stringify(this.state);
    localStorage.setItem('wallet', wallet);
  }

  submitForm = async record => {
    const currentWallet = this.state.wallet - record.exp;
    await this.setState(() => ({
      wallet: currentWallet,
      expenses: [record, ...this.state.expenses],
    }));
    // firebase
    //   .firestore()
    //   .collection('expenses')
    //   .add(record);
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
            <button className="buttons buttons__export" onClick={this.toggleRecord}>CLOSE</button>
            {/* Added export to csv function */}
            <CSVLink
              className="buttons buttons__export"
              filename={this.state.currentDate + 'spent_record.csv'}
              data={this.state.expenses.map(item => ({
                month: item.month,
                date: item.date,
                title: item.title,
                exp: item.exp
              }))}>EXPORT CSV</CSVLink>
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
