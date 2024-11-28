import React from "react";
import "../../App.css";
const TransactionList = ({ transactions, onDeleteTransaction }) => {
  const handleDelete = (id) => {
    onDeleteTransaction(id);
  };
  return (
    <div className="transactionList">
      <h3>Transaction List</h3>
      <div className="table_container">
        <table id="list" className="table">
          <thead>
            <th>Transaction</th>
            <th>Amount (RSD)</th>
            <th>Delete</th>
          </thead>
        </table>
        <div className="tbBody">
          <table className="table">
            <tbody>
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className={transaction.amount < 0 ? "minus" : "plus"}
                >
                  <td> {transaction.text}</td> <td>{transaction.amount}RSD </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(transaction.id)}
                    >
                      x
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default TransactionList;
