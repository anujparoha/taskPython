import React, { useEffect, useState } from 'react';
import './App.css';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchInputName, setSearchInputName] = useState('');
  const [searchInputYear, setSearchInputYear] = useState('');
  const [sortCriteria, setSortCriteria] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/companies');
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const jsonData = await response.json();
      setCompanies(jsonData.companies);
      setFilteredCompanies(jsonData.companies);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
   
    const filtered = companies.filter(company =>
      company.location.city.toLowerCase().includes(searchInput.toLowerCase()) &&
      (searchInputName === '' || company.name.toLowerCase().includes(searchInputName.toLowerCase())) &&
      (searchInputYear === '' || company.founded_year.toString().includes(searchInputYear))
    );
    setFilteredCompanies(filtered);
  }, [companies, searchInput, searchInputName, searchInputYear]);

  const searchCompanies = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/companies/search?query=${searchInputName}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const jsonData = await response.json();
      setFilteredCompanies(jsonData.companies);
      if (jsonData.companies.length === 0) { 
        toast.error("No companies found"); 
      }
    } catch (err) {
      console.error('Error searching companies:', err);
      setError(err);
    }
  };

  const handleSort = criteria => {
    const sorted = [...filteredCompanies].sort((a, b) => {
      if (criteria === 'name') {
        return a.name.localeCompare(b.name);
      } else if (criteria === 'location.city') {
        return a.location.city.localeCompare(b.location.city);
      } else if (criteria === 'founded_year') {
        return a.founded_year - b.founded_year;
      } else {
        return a[criteria] - b[criteria];
      }
    });
    setSortCriteria(criteria);
    setFilteredCompanies(sorted);
    toast.success(`Company shorted on the basis of ${criteria}`); 
  };
  
  return (
    <div className="app-container">
      <h1 className="heading">Company Information</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by location..."
          className="search-input"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by company name..."
          className="search-input"
          value={searchInputName}
          onChange={(e) => setSearchInputName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by founded year..."
          className="search-input"
          value={searchInputYear}
          onChange={(e) => setSearchInputYear(e.target.value)}
        />
        <button className="search-button" onClick={searchCompanies}>Search</button>
      </div>

      <div className="sort-buttons">
        <button onClick={() => handleSort('name')}>Sort by Name</button>
        <button onClick={() => handleSort('location.city')}>Sort by City</button>
      </div>
      <div className="company-table-container">
        <table className="company-table">
          <thead>
            <tr>
              <th>Company Name</th> 
              <th>Company Email</th> 
              <th>Revenue</th>
              <th>Founded Year</th>
              <th>Keywords</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.map((company, index) => (
              <tr key={index}>
                <td>{company.name}</td>
                <td>{company.email}</td>
                <td>{`$${company.revenue.toLocaleString()}`}</td>
                <td>{company.founded_year}</td>
                <td>{company.keywords.join(', ')}</td>
                <td>{`${company.location.city}, ${company.location.state}, ${company.location.country}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer /> 
    </div>
  );
}

export default App;
