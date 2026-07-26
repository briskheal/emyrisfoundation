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
    if (detail) return detail.toJSON();
    
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
        videos: [
          { url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', title: 'Impact Video 1' }
        ]
      };
      
      const newDetail = await WorkDetail.create(defaultEducationData);
      return newDetail.toJSON();
    }
    
    return null;
  } catch (error) {
    console.error('getWorkDetail error:', error);
    return null;
  }
}
