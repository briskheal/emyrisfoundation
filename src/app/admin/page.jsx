'use client';

import React from 'react';
import AdminPanel from '../../components/AdminPanel';
import { CorporateProvider } from '../../context/CorporateContext';

export default function AdminPage() {
  return (
    <CorporateProvider>
      <AdminPanel />
    </CorporateProvider>
  );
}
