import React, { useState } from 'react';
import '../styles/ExpenseForm.css';

function ExpenseForm({ addExpense }) {
  const [expense, setExpense] = useState({ description: '', amount: '', date: '' });

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addExpense(expense);
    setExpense({ description: '', amount: '', date: '' });
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <input type="text" name="description" value={expense.description} onChange={handleChange} placeholder="Description" required />
      <input type="number" name="amount" value={expense.amount} onChange={handleChange} placeholder="Amount" required />
      <input type="date" name="date" value={expense.date} onChange={handleChange} required />
      <button type="submit">Add Expense</button>
    </form>
  );
}

export default ExpenseForm;
