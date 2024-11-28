import React from "react";
import "../../App.css";
const TransactionList = ({ transactions, onDeleteTransaction }) => {
  const handleDelete = (id) => {
    onDeleteTransaction(id);
  };
  return (
    <div className="transactionList">
      <h3>Transaction List</h3>
      <ul id="list" className="list">
        {transactions.map((transaction) => (
          <li
            key={transaction.id}
            className={transaction.amount < 0 ? "minus" : "plus"}
          >
            {transaction.text} <span>{transaction.amount}RSD </span>
            <button
              className="delete-btn"
              onClick={() => handleDelete(transaction.id)}
            >
              x
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default TransactionList;
