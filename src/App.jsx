import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import BreweryDetail from './component/BreweryDetail.jsx';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

function App() {
  const [data, setData] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.openbrewerydb.org/breweries');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const totalBreweries = data.length;

  const breweryTypes = [
    'micro',
    'nano',
    'regional',
    'brewpub',
    'large',
    'planning',
    'bar',
    'contract',
    'proprietor',
    'closed',
  ];

  const states = [...new Set(data.map(brewery => brewery.state_province))];

  const filteredBreweries = data.filter(brewery => {
    const typeMatches = !filterType || brewery.brewery_type === filterType;
    const stateMatches = !filterState || brewery.state_province === filterState;
    const nameMatches =
      !filterName || brewery.name.toLowerCase().includes(filterName.toLowerCase());

    return typeMatches && stateMatches && nameMatches;
  });

  const breweryTypeDistribution = filteredBreweries.reduce((typeCounts, brewery) => {
    typeCounts[brewery.brewery_type] = (typeCounts[brewery.brewery_type] || 0) + 1;
    return typeCounts;
  }, {});

  const typeData = Object.keys(breweryTypeDistribution).map(type => ({
    type,
    count: breweryTypeDistribution[type],
  }));

  return (
    <Router>
      <div className="app-container">
        <div className="summary-statistics">
          <p>Total Breweries: {totalBreweries}</p>
          <BarChart width={400} height={250} data={typeData}>
            <XAxis dataKey="type" />
            <YAxis dataKey="count" />
            <Bar dataKey="count" fill="#8884d8" />
            <Tooltip />
            <Legend />
          </BarChart>
        </div>
        <Routes>
          <Route
            path="/"
            element={
              <FilteredList
                filteredBreweries={filteredBreweries}
                breweryTypes={breweryTypes}
                states={states}
                setFilterType={setFilterType}
                setFilterState={setFilterState}
                setFilterName={setFilterName}
              />
            }
          />
          <Route path="/brewery/:breweryId" element={<BreweryDetail data={data} />} />
        </Routes>
      </div>
    </Router>
  );
}

function FilteredList({
  filteredBreweries,
  breweryTypes,
  states,
  setFilterType,
  setFilterState,
  setFilterName,
}) {
  return (
    <>
      <div className="filter-container">
        <label htmlFor="filterType">Filter by Brewery Type:</label>
        <select
          id="filterType"
          onChange={e => setFilterType(e.target.value)}
          value={setFilterType}
        >
          <option value="">All</option>
          {breweryTypes.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-container">
        <label htmlFor="filterState">Filter by State:</label>
        <select
          id="filterState"
          onChange={e => setFilterState(e.target.value)}
          value={setFilterState}
        >
          <option value="">All</option>
          {states.map(state => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-container">
        <label htmlFor="filterName">Filter by Brewery Name:</label>
        <input
          type="text"
          id="filterName"
          placeholder="Search by name..."
          onChange={e => setFilterName(e.target.value)}
          value={setFilterName}
        />
      </div>
      <ul className="brewery-list">
        {filteredBreweries.map(brewery => (
          <li key={brewery.id} className="brewery-item">
            <h3>Name: {brewery.name}</h3>
            <p>Brewery Type: {brewery.brewery_type}</p>
            <p>Location: {brewery.city}, {brewery.state_province}</p>
            <Link to={`/brewery/${brewery.id}`}>More Details</Link>
            <p>
              Website: <a href={brewery.website_url} target="_blank" rel="noopener noreferrer">{brewery.website_url}</a>
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;