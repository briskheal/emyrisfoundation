import { CorporateProfile, HeroSlide, Campaign, WorkActivity, PresenceLocation, WorkDetail } from './db';
import fs from 'fs';
import path from 'path';

export async function getCorporateData() {
  try {
    const data = await CorporateProfile.findOne();
    if (data) return data.toJSON();
    return null;
  } catch (error) {
    console.error('Failed to get corporate data server-side:', error);
    return null;
  }
}

export async function getHeroSlides() {
  try {
    const slides = await HeroSlide.findAll({ order: [['order', 'ASC']] });
    if (slides.length > 0) return slides.map(s => s.toJSON());
    
    // Fallback to json if DB empty/error
    const p = path.join(process.cwd(), 'src', 'data', 'heroSlides.json');
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
    return [];
  } catch (error) {
    return [];
  }
}

export async function getWorkActivities() {
  try {
    const works = await WorkActivity.findAll({ order: [['order', 'ASC']] });
    if (works.length > 0) return works.map(w => w.toJSON());
    
    const p = path.join(process.cwd(), 'src', 'data', 'work.json');
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
    return [];
  } catch (error) {
    return [];
  }
}

export async function getCampaigns() {
  try {
    const camps = await Campaign.findAll({ order: [['order', 'ASC']] });
    if (camps.length > 0) return camps.map(c => c.toJSON());
    
    const p = path.join(process.cwd(), 'src', 'data', 'campaigns.json');
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
    return [];
  } catch (error) {
    return [];
  }
}

export async function getPresenceLocations() {
  try {
    const locs = await PresenceLocation.findAll({ order: [['order', 'ASC']] });
    if (locs.length > 0) return locs.map(l => l.toJSON());
    
    const p = path.join(process.cwd(), 'src', 'data', 'presence.json');
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
    return [];
  } catch (error) {
    return [];
  }
}
export async function getWorkDetail(id) {
  try {
    let detail = await WorkDetail.findByPk(id);
    if (detail) {
      let updated = false;
      // Force remove videos
      if (detail.videos && detail.videos.length > 0) {
        detail.videos = [];
        updated = true;
      }
      // Force trim health grid to 5
      if (id === 'work-health' && detail.sdgGrid && detail.sdgGrid.length > 5) {
        detail.sdgGrid = detail.sdgGrid.slice(0, 5);
        updated = true;
      }
      if (updated) {
        await detail.save();
      }
      return detail.toJSON();
    }
    
    // If not found and it is education, create the default directly
    if (id === 'work-education') {
      const defaultEducationData = {
        id: 'work-education',
        bannerTitle: 'Education is Enlightenment',
        whyTitle: 'Why Education',
        whyText: 'Right To Education (RTE) act passed by Parliament in 2009 and came into effect on 2010 is a significant legislative step towards ensuring education as a fundamental right for children aged between 6 and 14 years. RTE Act was enacted to fulfill the promise of Article 21-A of the Indian Constitution, which mandates free and compulsory education for children in this age group, marking education as a fundamental right. Emyris Foundation understands the importance of education in society which serves as a foundational element for personal empowerment, economic progress, social justice, environmental care, and global peace.\n\nThe Sustainable Development Goals (SDGs), also known as the Global Goals, are a set of 17 interconnected global goals designed to be a "blueprint to achieve a better and more sustainable future for all." Adopted by all United Nations Member States in 2015, these goals are part of the 2030 Agenda for Sustainable Development, which aims to address various global challenges, including poverty, Hunger, Good Health, Quality Education etc. Emyris Foundation plays its part to achieve this Global Goals in assisting and coordinating various Organizations and working on same.',
        sdgGrid: [
          { title: 'Highlights Gap', text: 'Work with existing bodies to identify where the right to education is not being fulfilled, particularly in terms of availability, accessibility, acceptability, and adaptability.' },
          { title: 'Support Infrastructure', text: 'Invest in building schools or educational facilities in underserved areas, ensuring they meet standards for educational environments.' },
          { title: 'Scholarships and Grants', text: 'Establish programs to fund education for marginalized groups, ensuring that financial barriers do not impede access to education.' },
          { title: 'Special Needs Education', text: 'Advocate for and fund programs that cater to children with disabilities, ensuring they have access to education through reasonable accommodations.' },
          { title: 'Awareness Campaign', text: 'Run campaigns to educate communities on the importance of education and rights associated with it, reducing dropout rates through increased understanding and community valuation of education.' }
        ],
        impactMedia: [
          { type: 'image', url: '/Emyris Foundation Photos/modern-hand-drawn-education-concept_23-2147906437.webp' },
          { type: 'image', url: '/Emyris Foundation Photos/impact_education_1.jpg' }
        ],
        reachStats: [
          { count: '3', label: 'villages & slums', color: '#facc15' },
          { count: '1', label: 'states', color: '#e5e7eb' },
          { count: '1', label: 'projects', color: '#fecdd3' },
          { count: '4', label: 'future projects', color: '#fca5a5' }
        ],
        testimonials: [
          { name: 'RAVI', text: 'Happy to learn and now I can put my signature in place of thumb impression.' }
        ],
        videos: []
      };
      
      const newDetail = await WorkDetail.create(defaultEducationData);
      return newDetail.toJSON();
    }
    
    // If not found and it is health, create the default directly
    if (id === 'work-health') {
      const defaultHealthData = {
        id: 'work-health',
        bannerTitle: 'Healthcare Reach for All',
        whyTitle: 'Why Healthcare',
        whyText: 'In a vast country like India having population of more than 1.4 Bn, Healthcare access to all is a phenomenal challenge. Govt of India doing its bit by "Ayushman Bharat" initiative. Many Non-Profit Organizations also supporting Govt. directly/indirectly in this novel cause. Emyris Foundation also determined to play its part for the improvement of Healthcare facilities around its operational states.\n\nWhile Ayushman Bharat primarily deals with secondary and tertiary care, there\'s an undercurrent emphasis on preventive health through its wellness centers. Emyris Foundation has initiatives aimed at preventive care and community health awareness campaigns, which could provide a structured framework for these initiatives, leveraging the existing infrastructure for broader outreach.',
        sdgGrid: [
          { title: 'Telemedicine', text: 'You can consult with healthcare providers from your home, reducing the need for travel, which is particularly beneficial for those with mobility issues, time constraints, or those living in remote areas.' },
          { title: 'Standalone Clinics', text: 'These facilities are designed to provide essential outpatient services without the need for overnight stays, catering to diagnostics, minor treatments, and follow-up consultations, significantly improve healthcare access for remote populations, reducing travel time and costs.' },
          { title: 'Health Camps', text: 'Health camps often focus on preventive measures such as vaccinations, screenings for diseases like diabetes, hypertension, or cancer, and health education. This proactive approach can lead to early detection and management of conditions, potentially saving lives.' },
          { title: 'Health Equity and Racial Equity', text: 'Emyris Foundation promotes preventive care, which is often more cost-effective than treatment. This approach not only addresses immediate health needs but also invests in long-term health outcomes, potentially reducing the prevalence of chronic diseases.' },
          { title: 'Education and Prevention', text: 'We aim to reach every doorstep of underserved communities in both rural and urban India.' }
        ],
        impactMedia: [
          { type: 'image', url: '/Emyris Foundation Photos/health_impact_1.webp' }
        ],
        reachStats: [
          { count: '20', label: 'villages & slums', color: '#facc15' },
          { count: '3', label: 'states', color: '#93c5fd' },
          { count: '2', label: 'projects', color: '#fbcfe8' },
          { count: '4', label: 'future projects', color: '#fca5a5' }
        ],
        testimonials: [
          { name: 'Rani', text: 'Suffering from illness and help she got message with read more.' },
          { name: 'Patient 2', text: 'Health camp diagnosed my issues early.' },
          { name: 'Patient 3', text: 'Telemedicine connected me to a specialist without traveling 50km.' },
          { name: 'Patient 4', text: 'The standalone clinic in our village has been a life saver for my children.' }
        ],
        videos: []
      };
      
      const newDetail = await WorkDetail.create(defaultHealthData);
      return newDetail.toJSON();
    }
    
    // If not found and it is livelihood, create the default directly
    if (id === 'work-livelihood') {
      const defaultLivelihoodData = {
        id: 'work-livelihood',
        bannerTitle: 'From Struggle to Strength: Elevating Lives.',
        whyTitle: 'Why Sustainable Livelihood ?',
        whyText: 'Livelihood refers to the means by which individuals or households meet their basic needs, such as food, clothing, shelter, and other essentials, while also seeking to improve their quality of life. It encompasses the activities, resources, and capabilities that people use to make a living and sustain themselves and their families.\n\nSustainable livelihoods are the cornerstone of resilient communities and a balanced global ecosystem. They represent more than mere survival; they embody the principles of equity, resilience, and environmental stewardship. Whether they are economic, environmental, or social, by diversifying income sources and building capacities, communities become better equipped to handle adversity, reducing the risk of falling into poverty traps due to unforeseen events.\n\nThe Sustainable Development Goals (SDGs), also known as the Global Goals, are a set of 17 interconnected global goals designed to be a "blueprint to achieve a better and more sustainable future for all." Adopted by all United Nations Member States in 2015, these goals are part of the 2030 Agenda for Sustainable Development, which aims to address various global challenges, including poverty, Hunger, Good Health, Quality Education etc. Emyris Foundation plays its part to achieve this Global Goals in assisting and coordinating various Organizations and working on same.',
        sdgGrid: [
          { title: 'Highlights Gap', text: 'Work with community to identify gap in terms of employability. Prepare a blueprint in terms of availability, accessibility, acceptability, and adaptability.' },
          { title: 'Support In Skill development', text: 'Invest in IDENTIFIED GROUP to improve employability. Core Focus Area – Communication Skill, Digital Awareness, Mock Interviews, Placement facilitation, and Post Placement Support.' },
          { title: 'Scholarships and Grants', text: 'Establish programs to fund education for marginalized groups, ensuring that financial barriers do not impede access to further skill development.' },
          { title: 'Special Needs Skill Program', text: 'Advocate for and fund programs that cater to children with disabilities, ensuring they have access to education and skill development to ensure employability.' },
          { title: 'Awareness Campaign', text: 'Run campaigns to educate communities on the importance of education with soft skills and rights associated with it, reducing dropout rates through increased understanding and community valuation of education.' }
        ],
        impactMedia: [
          { type: 'image', url: '/Emyris Foundation Photos/livelihood_impact_1.webp' }
        ],
        reachStats: [
          { count: '2', label: 'Groups', color: '#facc15' },
          { count: '1', label: 'states', color: '#d1d5db' },
          { count: '1', label: 'projects', color: '#fbcfe8' },
          { count: '4', label: 'Future Target Group', color: '#fca5a5' }
        ],
        testimonials: [
          { name: 'Ravi', text: 'Happy to share that now I am confident to face any interview after gone through the training session conducted by Emyris Foundation. I am sure this program is going to help many like me.' },
          { name: 'Trainee 2', text: 'The mock interviews prepared me perfectly for my new job.' },
          { name: 'Trainee 3', text: 'Digital awareness classes completely changed how I find opportunities.' },
          { name: 'Trainee 4', text: 'The placement support helped me secure a steady income for my family.' }
        ],
        videos: []
      };
      
      const newDetail = await WorkDetail.create(defaultLivelihoodData);
      return newDetail.toJSON();
    }
    
    return null;
  } catch (error) {
    console.error('getWorkDetail error:', error);
    return null;
  }
}
