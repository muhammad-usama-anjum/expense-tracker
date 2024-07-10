import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Summary from './components/Summary';
import Filter from './components/Filter';
import * as XLSX from 'xlsx'; // Import all functions as XLSX from 'xlsx'
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

  const calculateTotalExpenses = (data) => {
    return data.reduce((total, expense) => total + parseFloat(expense.amount), 0);
  };

  const downloadJSON = () => {
    const dataToDownload = filteredExpenses.length > 0 ? filteredExpenses : expenses;
    const totalExpenses = calculateTotalExpenses(dataToDownload);
    const dataWithTotal = { expenses: dataToDownload, total: totalExpenses };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataWithTotal));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "expenses.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const downloadXLSX = () => {
    const dataToDownload = filteredExpenses.length > 0 ? filteredExpenses : expenses;
    const totalExpenses = calculateTotalExpenses(dataToDownload);

    const ws = XLSX.utils.json_to_sheet(dataToDownload);
    const totalWs = XLSX.utils.json_to_sheet([{ TotalExpenses: totalExpenses }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Expenses');
    XLSX.utils.book_append_sheet(wb, totalWs, 'Total Expenses');

    XLSX.writeFile(wb, 'expenses.xlsx');
  };
  
  const uploadJSONExpenses = (event) => {
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
          <button onClick={downloadJSON}>Download JSON</button>
          <button onClick={downloadXLSX}>Download Excel</button>
        </div>
        <div className='buttons2'>
        <input type="file" accept=".json" onChange={uploadJSONExpenses}></input>
        </div>
        <p className='para'>NOTE: You can only upload the JSON file</p>
        <Filter filterExpenses={filterExpenses} />
        <Summary expenses={filteredExpenses} />
        <ExpenseList expenses={filteredExpenses} />
      </div>
    </div>
  );
}

export default App;
