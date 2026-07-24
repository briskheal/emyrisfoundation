'use client';
import React, { createContext, useContext, useState } from 'react';

const DonateModalContext = createContext(null);

export const useDonateModal = () => useContext(DonateModalContext);

export const DonateModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openDonateModal = () => setIsOpen(true);
  const closeDonateModal = () => setIsOpen(false);

  return (
    <DonateModalContext.Provider value={{ isOpen, openDonateModal, closeDonateModal }}>
      {children}
    </DonateModalContext.Provider>
  );
};

