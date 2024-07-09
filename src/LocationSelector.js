import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LocationSelector = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  
  // Fetch all countries on initial load
  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await axios.get('https://crio-location-selector.onrender.com/countries');
      setCountries(response.data);
    } catch (error) {
      setCountries([]); // Clear countries array on error
    }
  };

  const fetchStates = async (countryName) => {
    try {
      const response = await axios.get(`https://crio-location-selector.onrender.com/country=${encodeURIComponent(countryName)}/states`);
      setStates(response.data);
    } catch (error) {
      setStates([]); // Clear states array on error
    }
  };

  const fetchCities = async (countryName, stateName) => {
    try {
      const response = await axios.get(`https://crio-location-selector.onrender.com/country=${encodeURIComponent(countryName)}/state=${encodeURIComponent(stateName)}/cities`);
      setCities(response.data);
    } catch (error) {
      setCities([]); // Clear cities array on error
    }
  };

  const handleCountryChange = (event) => {
    const selectedCountry = event.target.value;
    setSelectedCountry(selectedCountry);
    setSelectedState('');
    setSelectedCity('');
    setStates([]);
    setCities([]);
    if (selectedCountry) {
      fetchStates(selectedCountry);
    }
  };

  const handleStateChange = (event) => {
    const selectedState = event.target.value;
    setSelectedState(selectedState);
    setSelectedCity('');
    setCities([]);
    if (selectedCountry && selectedState) {
      fetchCities(selectedCountry, selectedState);
    }
  };

  const handleCityChange = (event) => {
    const selectedCity = event.target.value;
    setSelectedCity(selectedCity);
  };

  return (
    <div className="container">
      <h2>Select Location</h2>
      <div className="row">
        <div className="col-md-4">
          <select className="form-select" value={selectedCountry} onChange={handleCountryChange}>
            <option value="">Select Country</option>
            {countries.map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select className="form-select" value={selectedState} onChange={handleStateChange} disabled={!selectedCountry}>
            <option value="">Select State</option>
            {states.map((state, index) => (
              <option key={index} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select className="form-select" value={selectedCity} onChange={handleCityChange} disabled={!selectedState}>
            <option value="">Select City</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>
      {selectedCity && (
        <div className="selected-location mt-3">
          <p>You selected {selectedCity}, {selectedState}, {selectedCountry}</p>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
