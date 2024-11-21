import logo from "./logo.svg";
import "./App.css";
import React from "react";
import TheHeader from "./components/layout/TheHeader.js";
import AddTransaction from "./components/transaction/AddTransaction.js";
import BalanceComponent from "./components/transaction/BalanceComponent.js";
import IncomeExpence from "./components/transaction/IncomeExpence.js";
import TransactionList from "./components/transaction/TransactionList.js";
import { useState } from "react";
function App() {
  const [transactions, setTransactions] = useState([
    { id: 1, text: "Bills", amount: 19.0 },
    { id: 2, text: "Fun", amount: -19.0 },
    { id: 3, text: "Shopping", amount: -19.0 },
  ]);

  const income = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);
  const expenses = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);
  const total = income + expenses;
  const handleAddTransaction = (newTransaction) => {
    setTransactions((prevTransactions) => [
      ...prevTransactions,
      newTransaction,
    ]);
  };
  const handleDeleteTransaction = (id) => {
    setTransactions((prevTransactions) =>
      prevTransactions.filter((transaction) => transaction.id !== id)
    );
  };
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <body>
        <TheHeader />
        <AddTransaction onAddTranasction={handleAddTransaction} />
        <BalanceComponent total={total} />
        <IncomeExpence income={income} expenses={expenses} />
        <TransactionList
          transactions={transactions}
          onDeleteTransaction={handleDeleteTransaction}
        />
      </body>
    </div>
  );
}

export default App;
