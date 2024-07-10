import React from 'react';
import ExpenseItem from './ExpenseItem';
import '../styles/ExpenseList.css';

function ExpenseList({ expenses }) {
  return (
    <div className="expense-list">
      {expenses && expenses.length > 0 ? (
        expenses.map((expense, index) => (
          <ExpenseItem key={index} expense={expense} />
        ))
      ) : (
        <p>No expenses to show</p>
      )}
    </div>
  );
}

export default ExpenseList;
