import React from 'react';
import { CorporateProvider } from '../context/CorporateContext';
import { ModalProvider } from '../context/ModalContext';
import Header from '../components/Header';
import Hero from '../components/Hero';
import TrustSeals from '../components/TrustSeals';
import AboutUs from '../components/AboutUs';
import OurWork from '../components/OurWork';
import Campaigns from '../components/Campaigns';
import Presence from '../components/Presence';
import Blog from '../components/Blog';
import Publications from '../components/Publications';
import ActivityGallery from '../components/ActivityGallery';
import FAQs from '../components/FAQs';
import GetInvolved from '../components/GetInvolved';
import Partnerships from '../components/Partnerships';
import Contact from '../components/Contact';
import DonorWall from '../components/DonorWall';
import Footer from '../components/Footer';
import Modals from '../components/Modals';
import SmoothScroll from '../components/SmoothScroll';
import ScrollToTop from '../components/ScrollToTop';

import { getCorporateData, getHeroSlides, getHeroStats, getDonors, getWorkActivities, getCampaigns, getPresenceLocations, getBlogs, getPartnerships } from '../lib/data-fetcher';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch all initial data instantly on the server side
  const corporateData = await getCorporateData();
  const heroSlides = await getHeroSlides();
  const heroStats = await getHeroStats();
  const donors = await getDonors();
  const workActivities = await getWorkActivities();
  const campaigns = await getCampaigns();
  const presenceLocations = await getPresenceLocations();
  const blogs = await getBlogs();
  const partnerships = await getPartnerships();

  return (
    <CorporateProvider initialData={corporateData}>
      <ModalProvider>
        <SmoothScroll />
        <Header />
        <main id="app-content">
          <div id="public-views">
            <Hero initialSlides={heroSlides} initialStats={heroStats} />
            <TrustSeals />
            <DonorWall initialDonors={donors} />
            <AboutUs />
            <OurWork initialWork={workActivities} />
            <Presence initialLocations={presenceLocations} />
            <Campaigns initialCampaigns={campaigns} />
            <GetInvolved />
            <Partnerships initialPartnerships={partnerships} />
            <Blog initialBlogs={blogs} />
            <ActivityGallery />
            <Publications />
            <FAQs />
            <Contact />
          </div>
        </main>
        <Footer />
        <Modals />
        <ScrollToTop />
      </ModalProvider>
    </CorporateProvider>
  );
}
