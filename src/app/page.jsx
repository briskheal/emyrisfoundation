'use client';

import React from 'react';
import { CorporateProvider } from '../context/CorporateContext';
import { DonateModalProvider } from '../context/DonateModalContext';
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
  return (
    <CorporateProvider>
      <DonateModalProvider>
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
      </DonateModalProvider>
    </CorporateProvider>
  );
}
