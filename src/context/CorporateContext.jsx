'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../api';

const CorporateContext = createContext();

export const useCorporate = () => useContext(CorporateContext);

export const CorporateProvider = ({ children }) => {
  const [corporate, setCorporate] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/corporate`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setCorporate(data))
      .catch(err => console.error('Failed to fetch corporate data:', err));
  }, []);

  return (
    <CorporateContext.Provider value={{ corporate }}>
      {children}
    </CorporateContext.Provider>
  );
};

