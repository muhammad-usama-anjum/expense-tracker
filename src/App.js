import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Summary from './components/Summary';
import Filter from './components/Filter';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  // Fetch expenses from local storage when the component mounts
  useEffect(() => {
    const storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses) {
      const parsedExpenses = JSON.parse(storedExpenses);
      setExpenses(parsedExpenses);
      setFilteredExpenses(parsedExpenses);
    }
  }, []);

  // Update local storage whenever expenses change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (expense) => {
    setExpenses(prevExpenses => [...prevExpenses, expense]);
    setFilteredExpenses(prevExpenses => [...prevExpenses, expense]);
  };

  const filterExpenses = (filters) => {
    const { name, startDate, endDate } = filters;
    const filtered = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const isNameMatch = name ? expense.description.toLowerCase().includes(name.toLowerCase()) : true;
      const isStartDateMatch = startDate ? expenseDate >= new Date(startDate) : true;
      const isEndDateMatch = endDate ? expenseDate <= new Date(endDate) : true;
      return isNameMatch && isStartDateMatch && isEndDateMatch;
    });
    setFilteredExpenses(filtered);
  };

  const downloadExpenses = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(expenses));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "expenses.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const uploadExpenses = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = JSON.parse(e.target.result);
      setExpenses(data);
      setFilteredExpenses(data);
    };
    reader.readAsText(file);
  };

  return (
    <div className="App">
      <Header />
      <div className="main-content">
        <ExpenseForm addExpense={addExpense} />
        <div className="buttons">
          <button onClick={downloadExpenses}>Download Expenses</button>
          <input type="file" accept=".json" onChange={uploadExpenses} />
        </div>
        <Filter filterExpenses={filterExpenses} />
        <Summary expenses={filteredExpenses} />
        <ExpenseList expenses={filteredExpenses} />
      </div>
    </div>
  );
}

export default App;
