import React from 'react';
import Modal from "react-modal";
import { CSVLink, CSVDownload } from "react-csv";
import './App.css';

import AddForm from "./components/AddForm";
import WalletModal from "./components/WalletModal";
import RecordList from "./components/RecordList";
import ListItem from './components/ListItem';
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

  sortByDateDesc = expArr => {
    let tempObj = {};
    for (let i = 0; i < expArr.length; i++) {
      for (let j = 0; j < expArr.length; j++) {
        if (expArr[i].month + '' + expArr[i].date > expArr[j].month + '' + expArr[j].date) {
          tempObj = expArr[i];
          expArr[i] = expArr[j];
          expArr[j] = tempObj;
        }
      }
    }
    return expArr;
  }

  componentDidMount = async () => {
    const wallet = await firebase
      .firestore()
      .collection('wallet')
      .onSnapshot(query => {
        const wallet = query.docs.map(_doc => {
          const data = _doc.data(); // gets wallet info
          return data;
        })
        this.setState(() => {
          return {
            wallet: wallet[0].wallet
          }
        });
      })

    const expenses = await firebase
      .firestore()
      .collection('expenses')
      .onSnapshot(query => {
        const expenses = query.docs.map(_doc => {
          const data = _doc.data(); // gets every expenses as array
          return data;
        });
        const newOrderExp = this.sortByDateDesc(expenses);
        this.setState(() => {
          return {
            expenses: newOrderExp
          }
        });
      });
  }

  submitForm = async record => {
    const currentWallet = this.state.wallet - record.exp;
    await this.setState(() => ({
      wallet: currentWallet,
      expenses: [record, ...this.state.expenses],
    }));
    // add expense to DB
    firebase.firestore().collection('expenses').add(record);
    // update wallet
    const wallet = firebase.firestore().collection('wallet').get()
      .then(res => {
        const id = res.docs[0].id;
        firebase.firestore().collection('wallet').doc(id).update({
          wallet: currentWallet
        });
      });
  }

  // set wallet modal
  toggleModal = () => {
    this.setState(() => ({ modalVisible: !this.state.modalVisible }));
  }

  // record list modal
  toggleRecord = () => {
    this.setState(() => ({ modalRecordItem: !this.state.modalRecordItem }));
  }

  setNewBudget = number => {
    this.setState(() => {
      return {
        wallet: number
      }
    });
    firebase.firestore().collection('wallet').get()
      .then(res => {
        const id = res.docs[0].id;
        firebase.firestore().collection('wallet').doc(id).update({
          wallet: number
        });
      });
  }

  clearData = () => {
    if (window.confirm('Are you sure you want to clear data?')) {
      this.setState(() => {
        return {
          expenses: []
        }
      });
      // clear all expenses data from DB
      firebase.firestore().collection('expenses').get()
        .then(res => {
          res.docs.forEach(_doc => {
            firebase.firestore().collection('expenses').doc(_doc.id).delete();
          });
        });
    }
  }

  removeItem = id => {
    this.setState(() => {
      return {
        expenses: this.state.expenses.filter(record => record.id !== id)
      }
    });
    // remove from DB
    firebase.firestore().collection('expenses').get()
      .then(res => {
        res.docs.forEach(_doc => {
          if (_doc.data().id === id) {
            firebase.firestore().collection('expenses').doc(_doc.id).delete();
          }
        });
      });
  }

  render() {
    return (
      <div className="container">
        <div>
          {/* AddForm */}
          <AddForm
            submitForm={this.submitForm}
            toggle={this.toggleModal}
          />
          {/* WalletModal */}
          <WalletModal
            appElement={document.getElementById('#root')}
            modalVisible={this.state.modalVisible}
            toggle={this.toggleModal}
            setNewBudget={this.setNewBudget}
          />
          <button className="buttons buttons__clearBtn" onClick={this.clearData}>CLEAR DATA</button>

          {/* Header: Wallet */}
          <div>
            <h2 className="fontColor">Wallet: {this.state.wallet}</h2>
          </div>

          {/* RecordList short ver. */}
          {
            this.state.expenses.map((recordItem, index) => index < 10 ?
              <ListItem key={recordItem.id} removeItem={this.removeItem} colorCheck={false} record={recordItem} /> : null
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
              {
                /*  
                <CSVDownload 
                  filename={this.state.currentDate + 'spent_record.csv'}
                  data={this.state.expenses.map(item => ({
                  month: item.month,
                  date: item.date,
                  title: item.title,
                  exp: item.exp
                }))} target="_blank" />
                */
              }
              <RecordList
                expenses={this.state.expenses}
                removeItem={this.removeItem}
              />
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}

Modal.setAppElement('#root');

export default App;
