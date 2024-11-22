import React, { useState } from "react";
import "../../style.css";
import "../../App.css";
import ReactModal from "react-modal";
const AddTransaction = ({ onAddTranasction }) => {
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const customStyles = {
    content: {
      top: "35%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      width: "50%",
      transform: "translate(-40%, -10%)",
    },
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text || !amount) {
      setIsModalOpen(true);
      return;
    }
    const newTransaction = {
      id: Math.floor(Math.random() * 10000),
      text,
      amount: parseFloat(amount),
    };
    onAddTranasction(newTransaction);
    setText("");
    setAmount("");
  };
  return (
    <div>
      <h3>Add new transaction</h3>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-control">
          <label htmlFor="text">Name your transaction</label>
          <input
            type="text"
            id="text"
            placeholder="Enter text..."
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label htmlFor="amount">
            Amount <br />( - expense, + income)
          </label>
          <input
            type="text"
            id="amount"
            placeholder="Enter amount..."
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <button className="btn" type="submit">
          Add transaction
        </button>
      </form>
      <ReactModal
        style={customStyles}
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <h2>Error</h2>
        <p>Please provide both text and amount</p>
        <button onClick={() => setIsModalOpen(false)}>Close</button>
      </ReactModal>
    </div>
  );
};

export default AddTransaction;
