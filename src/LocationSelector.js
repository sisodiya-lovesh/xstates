import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LocationSelector = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [countryError, setCountryError] = useState('');
  const [stateError, setStateError] = useState('');
  const [cityError, setCityError] = useState('');

  // Fetch all countries on initial load
  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      setIsLoadingCountries(true);
      const response = await axios.get('https://crio-location-selector.onrender.com/countries');
      if (response.status === 500) {
        setCountryError('Failed to fetch countries. Please try again later.');
        setCountries([]);
      } else {
        setCountries(response.data);
      }
    } catch (error) {
      setCountryError('Failed to fetch countries. Please try again later.');
      setCountries([]); // Clear countries array on error
    } finally {
      setIsLoadingCountries(false);
      setSelectedCountry(''); // Reset selected country
      setSelectedState(''); // Reset selected state
      setSelectedCity(''); // Reset selected city
      setStates([]); // Clear states array on error
      setCities([]); // Clear cities array on error
    }
  };

  const fetchStates = async (countryName) => {
    try {
      setIsLoadingStates(true);
      const response = await axios.get(`https://crio-location-selector.onrender.com/country=${encodeURIComponent(countryName)}/states`);
      if (response.status === 500) {
        setStateError(`Failed to fetch states for ${countryName}. Please try again later.`);
        setStates([]);
      } else {
        setStates(response.data);
      }
    } catch (error) {
      setStateError(`Failed to fetch states for ${countryName}. Please try again later.`);
      setStates([]); // Clear states array on error
    } finally {
      setIsLoadingStates(false);
      setSelectedState(''); // Reset selected state
      setSelectedCity(''); // Reset selected city
      setCities([]); // Clear cities array on error
    }
  };

  const fetchCities = async (countryName, stateName) => {
    try {
      setIsLoadingCities(true);
      const response = await axios.get(`https://crio-location-selector.onrender.com/country=${encodeURIComponent(countryName)}/state=${encodeURIComponent(stateName)}/cities`);
      if (response.status === 500) {
        setCityError(`Failed to fetch cities for ${stateName}, ${countryName}. Please try again later.`);
        setCities([]);
      } else {
        setCities(response.data);
      }
    } catch (error) {
      setCityError(`Failed to fetch cities for ${stateName}, ${countryName}. Please try again later.`);
      setCities([]); // Clear cities array on error
    } finally {
      setIsLoadingCities(false);
      setSelectedCity(''); // Reset selected city
    }
  };

  const handleCountryChange = (event) => {
    const selectedCountry = event.target.value;
    setSelectedCountry(selectedCountry);
    setSelectedState('');
    setSelectedCity('');
    setCountryError('');
    setStateError('');
    setCityError('');
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
    setStateError('');
    setCityError('');
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
            {isLoadingCountries ? (
              <option disabled>Loading countries...</option>
            ) : countryError ? (
              <option disabled>{countryError}</option>
            ) : (
              countries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))
            )}
          </select>
        </div>
        <div className="col-md-4">
          <select className="form-select" value={selectedState} onChange={handleStateChange} disabled={!selectedCountry}>
            <option value="">Select State</option>
            {isLoadingStates ? (
              <option disabled>Loading states...</option>
            ) : stateError ? (
              <option disabled>{stateError}</option>
            ) : (
              states.map((state, index) => (
                <option key={index} value={state}>
                  {state}
                </option>
              ))
            )}
          </select>
        </div>
        <div className="col-md-4">
          <select className="form-select" value={selectedCity} onChange={handleCityChange} disabled={!selectedState}>
            <option value="">Select City</option>
            {isLoadingCities ? (
              <option disabled>Loading cities...</option>
            ) : cityError ? (
              <option disabled>{cityError}</option>
            ) : (
              cities.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))
            )}
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
