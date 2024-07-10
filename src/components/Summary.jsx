import React from 'react';
import '../styles/Summary.css';

function Summary({ expenses }) {
  const totalAmount = expenses && expenses.length > 0
    ? expenses.reduce((acc, expense) => acc + parseFloat(expense.amount), 0)
    : 0;

  return (
    <div className="summary">
      <h2>Total: Rs.{totalAmount.toFixed(2)}</h2>
    </div>
  );
}

export default Summary;
