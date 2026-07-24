'use client';
import React, { useEffect } from 'react';
import { useModals } from '../context/ModalContext';
import DonateModal from './modals/DonateModal';
import VolunteerModal from './modals/VolunteerModal';
import InternshipModal from './modals/InternshipModal';
import ConsentModal from './modals/ConsentModal';
import JobModal from './modals/JobModal';

const Modals = () => {
  const { activeModal, closeModal } = useModals();

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [closeModal]);

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = activeModal ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activeModal]);

  return (
    <>
      <DonateModal />
      <VolunteerModal />
      <InternshipModal />
      <ConsentModal />
      <JobModal />
    </>
  );
};

export default Modals;
