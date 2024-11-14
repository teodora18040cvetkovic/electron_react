import React from "react";
import TheHeader from "./components/layout/TheHeader";
import AddTransaction from "./components/transaction/AddTransaction";
import BalanceComponent from "./components/transaction/BalanceComponent";
import "./global.css";
import IncomeExpence from "./components/transaction/IncomeExpence";
import TransactionList from "./components/transaction/TransactionList";
import { useState } from "react";
export default function Home() {
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
    <div>
      <TheHeader />
      <AddTransaction onAddTranasction={handleAddTransaction} />
      <BalanceComponent total={total} />
      <IncomeExpence income={income} expenses={expenses} />
      <TransactionList
        transactions={transactions}
        onDeleteTransaction={handleDeleteTransaction}
      />
    </div>
  );
}
