'use client';

import React, { useEffect } from 'react';
import { CorporateProvider } from '../context/CorporateContext';
import { ModalProvider } from '../context/ModalContext';
import Header from '../components/Header';
import Hero from '../components/Hero';
import TrustSeals from '../components/TrustSeals';
import AboutUs from '../components/AboutUs';
import OurWork from '../components/OurWork';
import Campaigns from '../components/Campaigns';
import Presence from '../components/Presence';
import Publications from '../components/Publications';
import ActivityGallery from '../components/ActivityGallery';
import FAQs from '../components/FAQs';
import GetInvolved from '../components/GetInvolved';
import Contact from '../components/Contact';
import DonorWall from '../components/DonorWall';
import Footer from '../components/Footer';
import Modals from '../components/Modals';

export default function Home() {
  useEffect(() => {
    const handleHashClick = (e) => {
      const target = e.target.closest('a');
      if (target && target.hash && target.hash.startsWith('#') && target.origin === window.location.origin) {
        // Only prevent default if it's an internal hash link
        const element = document.querySelector(target.hash);
        if (element) {
          e.preventDefault();
          element.scrollIntoView({ behavior: 'smooth' });
          window.history.pushState(null, '', target.hash);
        }
      }
    };
    document.addEventListener('click', handleHashClick);
    return () => document.removeEventListener('click', handleHashClick);
  }, []);

  return (
    <CorporateProvider>
      <ModalProvider>
        <Header />
        <main id="app-content">
          <div id="public-views">
            <Hero />
            <TrustSeals />
            <AboutUs />
            <OurWork />
            <Campaigns />
            <Presence />
            <Publications />
            <ActivityGallery />
            <FAQs />
            <GetInvolved />
            <Contact />
            <DonorWall />
          </div>
        </main>
        <Footer />
        <Modals />
      </ModalProvider>
    </CorporateProvider>
  );
}
