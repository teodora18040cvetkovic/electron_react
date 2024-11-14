import React from "react";
import "../../style.css";

const IncomeExpence = ({income, expenses}) => {
  return (
    <div class="inc-exp-container">
      <div>
        <h4>Income</h4>
        <p id="money-plus" class="money plus">
          {income} +RSD
        </p>
      </div>
      <div>
        <h4>Expense</h4>
        <p id="money-minus" class="money minus">
          {expenses} -RSD
        </p>
      </div>
    </div>
  );
};
export default IncomeExpence;
