import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [pincode, setPincode] = useState('');
  const [postOffices, setPostOffices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  const handlePincodeChange = (e) => {
    setPincode(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate Pincode
    if (!/^\d{6}$/.test(pincode)) {
      setError('Please enter a valid 6-digit Pincode.');
      return;
    }

    setError('');
    setLoading(true);
    setPostOffices([]);

    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = response.data;

      if (data[0].Status !== 'Success') {
        setError(`Error: ${data[0].Message}`);
      } else {
        setPostOffices(data[0].PostOffice || []);
      }
    } catch (error) {
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Filter post offices based on user input
  const filteredPostOffices = postOffices.filter((office) =>
    office.Name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="App">
      <h1>Enter Pincode</h1>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="pincode-input"
          value={pincode}
          onChange={handlePincodeChange}
          placeholder="Enter 6-digit Pincode"
        />
        <button type="submit">Lookup</button>
      </form>

      {error && <p id="error-message" style={{ color: 'red' }}>{error}</p>}

      <div className="loader" style={{ display: loading ? 'block' : 'none' }}>
        <div className="spinner"></div>
      </div>

      {postOffices.length > 0 && (
        <>
          <input
            type="text"
            value={filter}
            onChange={handleFilterChange}
            placeholder="Filter by Post Office Name"
          />
          <ul id="post-offices-list">
            {filteredPostOffices.length > 0 ? (
              filteredPostOffices.map((office, index) => (
                <li key={index}>
                  <strong>{office.Name}</strong><br />
                  Pincode: {office.Pincode}<br />
                  District: {office.District}<br />
                  State: {office.State}
                </li>
              ))
            ) : (
              <li>Couldn’t find the postal data you’re looking for…</li>
            )}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;

