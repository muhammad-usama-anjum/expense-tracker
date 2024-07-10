import React, { useState } from 'react';
import '../styles/Filter.css';

function Filter({ filterExpenses }) {
  const [filters, setFilters] = useState({ name: '', startDate: '', endDate: '' });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    filterExpenses(filters);
  };

  return (
    <form className="filter-form" onSubmit={handleSubmit}>
      <input type="text" name="name" value={filters.name} onChange={handleChange} placeholder="Item Name" />
      <input type="date" name="startDate" value={filters.startDate} onChange={handleChange} />
      <input type="date" name="endDate" value={filters.endDate} onChange={handleChange} />
      <button type="submit">Filter</button>
    </form>
  );
}

export default Filter;
