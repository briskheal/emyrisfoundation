'use client';
import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext(null);

export const useModals = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [activeModal, setActiveModal] = useState(null); // 'donate', 'volunteer', 'internship', 'consent', 'job', 'campaign', 'lightbox', 'video'
  const [modalData, setModalData] = useState(null); // To pass dynamic data to modals

  const openModal = (modalName, data = null) => {
    setModalData(data);
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalData(null);
  };

  return (
    <ModalContext.Provider value={{ activeModal, modalData, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};
