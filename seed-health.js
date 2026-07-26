import { sequelize, WorkDetail } from './src/lib/db.js';

async function seedHealth() {
  await sequelize.sync();
  
  await WorkDetail.upsert({
    id: 'work-health',
    bannerTitle: 'Healthcare Reach for All',
    whyTitle: 'Why Healthcare',
    whyText: `In a vast country like India having population of more than 1.4 Bn, Healthcare access to all is a phenomenal challenge. Govt of India doing its bit by “Ayushman Bharat” initiative. Many Non-Profit Organizations also supporting Govt. directly/indirectly in this novel cause. Emyris Foundation also determined to play its part for the improvement of Healthcare facilities around its operational states.\nWhile Ayushman Bharat primarily deals with secondary and tertiary care, there's an undercurrent emphasis on preventive health through its wellness centers. Emyris Foundation has initiatives aimed at preventive care and community health awareness campaigns, which could provide a structured framework for these initiatives, leveraging the existing infrastructure for broader outreach.`,
    sdgGrid: [
      {
        title: 'Telemedicine',
        text: 'You can consult with healthcare providers from your home, reducing the need for travel, which is particularly beneficial for those with mobility issues, time constraints, or those living in remote areas.'
      },
      {
        title: 'Standalone Clinics',
        text: 'These facilities are designed to provide essential outpatient services without the need for overnight stays, catering to diagnostics, minor treatments, and follow-up consultations, significantly improve healthcare access for remote populations, reducing travel time and costs.'
      },
      {
        title: 'Health Camps',
        text: 'Health camps often focus on preventive measures such as vaccinations, screenings for diseases like diabetes, hypertension, or cancer, and health education. This proactive approach can lead to early detection and management of conditions, potentially saving lives.'
      },
      {
        title: 'Health Equity and Racial Equity',
        text: 'Emyris Foundation promotes preventive care, which is often more cost-effective than treatment. This approach not only addresses immediate health needs but also invests in long-term health outcomes, potentially reducing the prevalence of chronic diseases through better management and education. We aim to reach every doorstep of underserved communities in both rural and urban India.'
      },
      {
        title: 'Education and Prevention',
        text: 'We focus heavily on health education and community awareness, building long-term sustainable health systems in the most vulnerable areas.'
      },
      {
        title: 'Engagement and Local Solutions',
        text: 'Engaging local communities directly to find and fund local solutions for healthcare gaps in slums and rural areas.'
      },
      {
        title: 'Sustainable Health Systems',
        text: 'Creating permanent networks and infrastructure to ensure healthcare resilience and continued access for generations to come.'
      }
    ],
    impactMedia: [
      { url: '/Emyris Foundation Photos/health_1.webp' },
      { url: '/Emyris Foundation Photos/health_2.webp' },
      { url: '/Emyris Foundation Photos/health_3.webp' },
      { url: '/Emyris Foundation Photos/health_4.webp' }
    ],
    reachStats: [
      { color: 'yellow', count: '20', label: 'Villages & Slums' },
      { color: '#88b5ec', count: '3', label: 'States' },
      { color: '#f3c1c6', count: '2', label: 'Projects' },
      { color: '#e0767a', count: '4', label: 'Future Projects' }
    ],
    testimonials: [
      { name: 'Rani', text: 'Suffering from illness and help she got message with read more.' },
      { name: 'Sujata', text: 'Health camp diagnosed my diabetes early. Grateful for the support.' },
      { name: 'Ramesh', text: 'Telemedicine connected me to a specialist without traveling 50km.' },
      { name: 'Priya', text: 'The standalone clinic in our village has been a life saver for my children.' }
    ],
    videos: [
      { url: 'https://www.youtube.com/embed/5F2oN6C4z6Y', title: 'Health Impact Video 1' },
      { url: 'https://www.youtube.com/embed/qg_3Gz0tKjQ', title: 'Health Impact Video 2' },
      { url: 'https://www.youtube.com/embed/zH3h1M2_N8E', title: 'Health Impact Video 3' },
      { url: 'https://www.youtube.com/embed/7V2eO52zF6s', title: 'Health Impact Video 4' }
    ]
  });

  console.log('Health data seeded successfully!');
  process.exit();
}

seedHealth();
