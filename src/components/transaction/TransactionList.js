import React from "react";

const TransactionList = ({ transactions, onDeleteTransaction }) => {
  const handleDelete = (id) => {
    onDeleteTransaction(id);
  };
  return (
    <div>
      <h3>History</h3>
      <ul id="list" class="list">
        {transactions.map((transaction) => (
          <li
            key={transaction.id}
            className={transaction.amount < 0 ? "minus" : "plus"}
          >
            {transaction.text} <span>{transaction.amount}RSD </span>
            <button
              class="delete-btn"
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
