import React from "react";

const BalanceComponent = ({ total }) => {
  return (
    <>
      <h4>Balance</h4>
      <h1 id="balance"> {total} RSD</h1>
    </>
  );
};

export default BalanceComponent;
