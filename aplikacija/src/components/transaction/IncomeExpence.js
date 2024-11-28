import React from "react";
import "../../App.css";
const IncomeExpence = ({ income, expenses, total }) => {
  return (
    <>
      <div className="inc-exp-container">
        <div className="balanceCont">
          <h4>Balance</h4>
          <h1 id="balance"> {total} RSD</h1>
        </div>
        <div className="incExp">
          <div>
            <h4>Income</h4>
            <p id="money-plus" className="money plus">
              {income} +RSD
            </p>
          </div>
          <div>
            <h4>Expense</h4>
            <p id="money-minus" className="money minus">
              {expenses} -RSD
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
export default IncomeExpence;
