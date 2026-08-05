import { CorporateProfile, HeroSlide, HeroStat, Donor, Campaign, WorkActivity, PresenceLocation, WorkDetail, CampaignDetail, Blog } from './db';
import fs from 'fs';
import path from 'path';

export async function getCorporateData() {
  try {
    // Automatically apply schema updates on the live database (Hostycare)
    await CorporateProfile.sync({ alter: true });

    const data = await CorporateProfile.findOne();
    if (data) {
      // Seed backend records directly
      let needsSave = false;
      if (!data.pan || data.pan === 'Loading...') { data.pan = 'AAICE2817L'; needsSave = true; }
      if (!data.csr || data.csr === 'Loading...') { data.csr = 'CSR00078495'; needsSave = true; }
      if (!data.cin || data.cin === 'Loading...') { data.cin = 'U88900GJ2024NPL153125'; needsSave = true; }
      
      if (needsSave) {
        await data.save();
      }
      
      return data.toJSON();
    }
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

export async function getHeroStats() {
  try {
    const stats = await HeroStat.findAll({ order: [['order', 'ASC']] });
    if (stats.length > 0) return stats.map(s => s.toJSON());
    return null;
  } catch (error) {
    console.error('Failed to get hero stats:', error);
    return null;
  }
}

export async function getDonors() {
  try {
    const donors = await Donor.findAll({ order: [['order', 'ASC']] });
    if (donors.length > 0) return donors.map(s => s.toJSON());
    return null;
  } catch (error) {
    console.error('Failed to get donors:', error);
    return null;
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
    await WorkDetail.sync({ alter: true });
    
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
    
    // If not found and it is women-empowerment, create the default directly
    if (id === 'work-women') {
      const defaultWomenData = {
        id: 'work-women',
        bannerTitle: 'Her Rights, Her Choices, Her Voice.',
        whyTitle: 'Why Women Empowerment',
        whyText: 'Women\'s empowerment is not just about gender equity; it\'s about leveraging the full potential of a nation\'s human capital, leading to comprehensive development that benefits every aspect of society. It\'s an investment that yields dividends in economic prosperity, social harmony, and global competitiveness.\n\n"Her Rights, Her Choices, Her Voice." UNDP highlight the importance of legal rights for women, ensuring they have the same legal protections and opportunities as men. Enhancing Women\'s ability to make choices that affect their economic, social, and personal lives, which in turn benefits families and communities. Giving Space to Her voice to express opinions, influence society, and contribute to policy-making and nation building is important to build an inclusive society.\n\nEmyris Foundation has initiated a program called "Shiksha Hi Surakhya", a grassroots movement that not only educates but also empowers underprivileged communities through a blend of cultural, educational, and safety-focused initiatives. This approach respects and builds upon the social fabric of these communities, ensuring sustainability and broader impact.',
        sdgGrid: [
          { title: 'Grassroots Movement', text: 'We engage local community leaders who are trusted figures in underprivileged communities, to act as liaisons or champions for the campaign. Organize or participates in events like "Gram Utsav" or community festivals where activities related to education and safety can be highlighted.' },
          { title: 'Mobile Learning Centers', text: 'Mobile units that travel to remote areas, providing access to books, educational materials, and even digital learning resources. These reach could utilize as platforms for safety discussions and self-defense training.' },
          { title: 'Scholarships and Stipends', text: 'Offer educational incentives for attendance and performance, which could include free meals, uniforms, or a small stipend, directly tied to participation in safety and education programs.' },
          { title: 'Community Mentoring', text: 'Establish mentorship programs where individuals from the community who have benefited from education or safety initiatives can mentor others, providing real-life examples of success and safety.' },
          { title: 'Media and Storytelling', text: 'Leverage local media, street plays, or folk arts to convey messages about education and safety. Stories and local heroes can become powerful motivators.' }
        ],
        impactMedia: [
          { type: 'image', url: '/Emyris Foundation Photos/women_impact_1.webp' }
        ],
        reachStats: [
          { count: '3', label: 'villages & slums', color: '#facc15' },
          { count: '1', label: 'states', color: '#d1d5db' },
          { count: '1', label: 'projects', color: '#fbcfe8' },
          { count: '4', label: 'future projects', color: '#fca5a5' }
        ],
        testimonials: [
          { name: 'Rani', text: 'Happy to learn and now I can put my signature in place of thumb impression.' },
          { name: 'Geeta', text: 'The mobile learning center brought education directly to my village.' },
          { name: 'Pooja', text: 'Community mentoring gave me the confidence to start my own small business.' },
          { name: 'Anjali', text: 'Through the scholarship program, I was able to complete my higher education without financial burden.' }
        ],
        videos: []
      };
      
      const newDetail = await WorkDetail.create(defaultWomenData);
      return newDetail.toJSON();
    }
    
    // If not found and it is farmers-connect, create the default directly
    if (id === 'work-farmers') {
      const defaultFarmersData = {
        id: 'work-farmers',
        bannerTitle: 'Empowering Earth\'s Stewards',
        whyTitle: 'Why Farmer\'s Connect?',
        whyText: 'In India – we are proud of our agricultural heritage however the harsh realities of farmer distress, underscoring the urgent needs for comprehensive, effective agricultural policies those truly uplift farmers, aligning with the broader goals of nation-building. Protecting farmers\' interests is not just about economic support but ensuring their voices are heard in shaping agricultural policy, which directly influences national food security, economic stability, and environmental health. Farmers are the backbone of any nation\'s agricultural sector, which is often the foundation of its economy, particularly in developing countries like us.\n\nAgriculture contributes significantly to GDP, employment, and rural development. Plays a crucial role in environmental health, including soil conservation, water management, and biodiversity. Where direct benefits like subsidies, loans, and insurance schemes (like PM-KISAN, Fasal Bima Yojana), infrastructure development for irrigation and market linkage, and promoting organic and sustainable farming practices is yielding positive outcomes, challenges remain, particularly in equitable distribution of benefits, addressing climate change impacts, and ensuring farmers have a voice in policy-making.',
        sdgGrid: [
          { title: 'Workshops & Training', text: 'Organizes training with support of agricultural colleges\', technical experts, covers from soil testing, market economics to integrated farming and crop diversification.' },
          { title: 'Online Platforms and Apps', text: 'Utilizing technology for real-time advice, market information, and educational content directly accessible to farmers, even in remote areas.' },
          { title: 'Peer Learning Networks', text: 'Encouraging experienced farmers to mentor less experienced ones, fostering a culture of continuous learning and Farmer-to-Farmer networks.' },
          { title: 'Demonstration Farms', text: 'Practical learning through model farms where new techniques are showcased.' },
          { title: 'Promoting Sustainability', text: 'Encouraging practices that promote soil health, reduce chemical use, and enhance biodiversity.' }
        ],
        impactMedia: [
          { type: 'image', url: '/Emyris Foundation Photos/farmers_impact_1.webp' }
        ],
        reachStats: [
          { count: '3', label: 'Farmers association', color: '#facc15' },
          { count: '1', label: 'states', color: '#d1d5db' },
          { count: '1', label: 'projects', color: '#fbcfe8' },
          { count: '4', label: 'future projects', color: '#fca5a5' }
        ],
        testimonials: [
          { name: 'Ravi', text: 'A farmer from Odisha, thanked for our support and help in improving his knowledge on Organic Cultivation.' },
          { name: 'Manoj', text: 'The demonstration farms showed us practical techniques that actually work in our climate.' },
          { name: 'Suresh', text: 'The online app alerts me about market prices, ensuring I get the right value for my crops.' },
          { name: 'Ganesh', text: 'Thanks to the soil testing workshop, my yield has doubled this season.' }
        ],
        videos: []
      };
      
      const newDetail = await WorkDetail.create(defaultFarmersData);
      return newDetail.toJSON();
    }
    
    return null;
  } catch (error) {
    console.error('getWorkDetail error:', error);
    return null;
  }
}

export async function getCampaignDetail(id) {
  const isBlood = id === 'blood' || id === 'campaign-blood';
  
  const defaultData = isBlood ? {
    id: 'blood',
    title: 'Blood Donation Camps',
    motto: 'Be a Hero, Donate Blood.',
    bannerMsg: 'Join Hands to create awareness and willingness to Donate Blood to Save Lives.',
    narrativeHeading: 'Every Drop is a Testament to Life',
    narrativeQuote: '“Come and shower your love in saving someone’s life. Join hands and fill up the consent form to coordinate your invitation.”',
    introText: `The beauty of blood donation lies in its simplicity and accessibility. It requires no special skills, just a willingness to give a part of oneself for the greater good. Every drop donated is a testament to the community's commitment to life, to each other.\n\n<strong style="font-size: 1.25rem; color: var(--primary-orange); display: block; margin-top: 15px; margin-bottom: 5px;">A Culture of Giving</strong>So, let's take a moment to reflect on the power we hold within us—the power to save lives. Let us not wait for a crisis to act; let's create a culture where giving blood is as routine as any other civic duty. By doing so, we not only protect our immediate community but also contribute to a global network of care and compassion.\n\n<strong style="font-size: 1.25rem; color: var(--primary-orange); display: block; margin-top: 25px; margin-bottom: 5px;">Celebrations of Life</strong>In essence, blood donation camps are more than just events; they are celebrations of life, love, and community. They are a call to action for each of us to be a part of something larger than ourselves, to be a part of the heartbeat of our community. Let's keep this heartbeat strong, for in doing so, we keep our society alive, vibrant, and interconnected.\n\nCome and shower your love in saving someone’s life. Join Hand and Fill up the consent form to contact you to invite.`,
    whyTitle: 'Why Healthy Volunteers Should Donate',
    whyGrid: [
      { title: 'Constant Need for Blood Supplies', text: 'Hospitals require a steady supply of blood for surgeries, accident victims, childbirth complications, and treatments for various illnesses like anemia, cancer, or thalassemia.' },
      { title: 'Limited shelf life', text: 'Blood components have a limited shelf life (e.g., red blood cells last about 42 days), necessitating continuous replenishment.' },
      { title: 'Local Availability', text: 'Local donation camps ensure a diverse blood supply within the community, which is crucial for emergency situations where immediate access to blood is life-saving.' },
      { title: 'Reducing Shortages', text: 'Blood shortages are common and can critically affect patient care. Regular donation camps help maintain a buffer stock.' },
      { title: 'Volunteer Opportunities', text: 'It provides a platform for community members to volunteer, from organizing the event to comforting donors, enhancing community spirit.' }
    ],
    galleryTitle: '"Blood: The Universal Bond"',
    gallerySubtitle: 'Photographs on Blood Donation with scroll option for our future camp captures.',
    galleryPhotos: [
      { url: '/Emyris Foundation Photos/blood-donor-day-poster-with-heart-blood-drop_1017-25357.webp', title: 'Blood Donation Drive' },
      { url: '/Emyris Foundation Photos/low-angle-hands-holding-heart-shape-with-sky_23-2148635107.webp', title: 'Community Camp' }
    ],
    videoTitle: 'Blood Donation in Motion',
    videoSubtitle: 'Youtube videos with scroll option for our camps and other videos on Blood Donation.',
    videos: []
  } : id === 'shiksha' ? {
    id: 'shiksha',
    title: 'Shiksha Hi Surakhya',
    motto: 'Education is Protection',
    bannerMsg: 'Join Hands to support Education Program of Underprivileged Children’s.',
    narrativeHeading: 'Education as the Bedrock',
    narrativeQuote: '“Education for underprivileged children transcends the traditional boundaries of learning. It is a shield against adversity.”',
    introText: `"Siksha Hi Suraksha" translates to "Education is Protection," emphasizing the role of education as a fundamental safeguard for underprivileged children.\n\n<strong style="font-size: 1.25rem; color: var(--primary-orange); display: block; margin-top: 15px; margin-bottom: 5px;">Education as the Bedrock</strong>In the tapestry of human development, education stands out as a golden thread, weaving through the fabric of society to fortify its most vulnerable members. "Siksha Hi Suraksha" is not just a slogan; it's a clarion call for transformative action, particularly for those children who find themselves on the fringes of opportunity due to socio-economic disparities.\n\n<strong style="font-size: 1.25rem; color: var(--primary-orange); display: block; margin-top: 25px; margin-bottom: 5px;">Breaking Cycles of Poverty</strong>Education for underprivileged children transcends the traditional boundaries of learning. It's about empowerment, breaking cycles of poverty, and opening doors to a future where children can dream, aspire, and achieve. For these children, education isn't merely an option; it's a lifeline, a shield against the adversities of child labor, early marriage, and trafficking.`,
    whyTitle: 'Purpose behind action:',
    whyGrid: [
      { title: 'Empowerment', text: 'Education equips children with the knowledge and skills necessary to navigate through life\'s challenges, fostering an environment where they can grow into informed, responsible citizens.' },
      { title: 'Economic Upliftment', text: 'Educating children from underprivileged backgrounds is an investment in economic empowerment. It not only enhances their earning potential but also contributes to national economic growth.' },
      { title: 'Social Integration', text: 'Education serves as a great equalizer, reducing social disparities by providing a common ground where all children can learn, play, and grow together, regardless of their socio-economic status.' },
      { title: 'Better Society', text: 'Join Hands for better educated society and growth.' }
    ],
    galleryTitle: 'Campaign Photographs',
    gallerySubtitle: 'Moments captured during our recent drives and community workshops.',
    galleryPhotos: [
      { url: '/Emyris Foundation Photos/modern-hand-drawn-education-concept_23-2147906438.avif', title: 'Campaign Activity' }
    ],
    videoTitle: 'Campaign Stories in Motion',
    videoSubtitle: 'Youtube videos with scroll option for our camps and other videos on Campaign Activities.',
    videos: []
  } : id === 'organ' ? {
    id: 'organ',
    title: 'Organ Donation Awareness',
    motto: 'Eternal Impact, Organ Donation.',
    bannerMsg: 'Join hands to create awareness on “Organ Donation, a Testament to Human Kindness”',
    narrativeHeading: 'A Testament to Human Kindness',
    narrativeQuote: '“Imagine a world where every person who can donate, does. A world where waiting lists for organs are dramatically shortened or even eradicated.”',
    introText: `Imagine a world where every person who can donate, does. A world where waiting lists for organs are dramatically shortened or even eradicated. This isn't a distant dream but a reachable reality with increased awareness and action.\n\n<strong style="font-size: 1.25rem; color: var(--primary-orange); display: block; margin-top: 15px; margin-bottom: 5px;">What Can I Do?</strong>To those who ponder, "What can I do?"—your action can be as simple as registering as an organ donor. It's about sparking conversations, educating others, and breaking through the silence that often surrounds this topic. Organ donation isn't just about saving lives; it's about fostering a culture of empathy, where life's end for one becomes life's beginning for another.\n\n<strong style="font-size: 1.25rem; color: var(--primary-orange); display: block; margin-top: 25px; margin-bottom: 5px;">A Profound Gift</strong>Let's pledge not only to give when we can but to also spread the word, dispel myths, and advocate for a future where organ donation is as commonplace as any other act of kindness. In doing so, we participate in one of the most profound gifts humanity can offer—the gift of life.\n\nCome and shower your love in saving someone’s life. Join Hand and Fill up the consent form to contact you.`,
    whyTitle: 'Why Organ Donation is Important?',
    whyGrid: [
      { title: 'Saves Lives and Improves Quality of Life', text: 'Organ donation is often the only treatment for end-stage organ failure or certain congenital conditions. Hearts, kidneys, livers, lungs, and other organs can mean the difference between life and death for recipients.' },
      { title: 'Enhanced Quality of Life', text: 'For many recipients, receiving an organ transplant can restore health, allowing them to return to normal activities, work, and family life, significantly improving their quality of life.' },
      { title: 'End of Long Suffering', text: 'People waiting for organs often endure long periods of pain, disability, or dependence on machines like dialysis machines for kidney failure. Donation can end this suffering.' },
      { title: 'Healthcare Costs', text: 'Early transplantation can be more cost-effective than prolonged treatments or machine-dependent care. This reduces healthcare costs both for individuals and the overall healthcare system.' },
      { title: 'Innovation', text: 'The need for organ donation drives medical research into organ preservation, transplantation techniques, and even the development of artificial organs or organ regeneration.' }
    ],
    galleryTitle: '"Organ Donation: The Human Kindness"',
    gallerySubtitle: 'Photographs on Organ Donation with scroll option for our future camps photographs.',
    galleryPhotos: [
      { url: '/Emyris Foundation Photos/low-angle-hands-holding-heart-shape-with-sky_23-2148635107.webp', title: 'Awareness Drive' }
    ],
    videoTitle: 'Organ Donation in Motion',
    videoSubtitle: 'Youtube videos with scroll option for our camps and other videos on Organ Donation.',
    videos: []
  } : id === 'plantation' ? {
    id: 'plantation',
    title: 'Plantation: Save Mother Earth',
    motto: 'Nurture Nature.',
    bannerMsg: 'Join Hands to create awareness on Planting Trees to Save Mother Earth',
    narrativeHeading: 'Plant a Tree, Build a Legacy',
    narrativeQuote: '“Planting trees is planting for the future. They outlive us, becoming silent witnesses to the passage of time, and guardians of life.”',
    introText: `Plantation activities are a call to each of us, inviting us to participate in the regeneration of our planet. They remind us that every individual can make a difference that collective effort can lead to monumental change.\n\n<strong style="font-size: 1.25rem; color: var(--primary-orange); display: block; margin-top: 15px; margin-bottom: 5px;">Cultivate a Future</strong>So, let us dig into the soil, not just to plant a tree but to plant hope, to cultivate a future where nature's balance is restored, where every breath of fresh air and every sip of clean water is a testament to our commitment to life. In the simple act of planting, we find a profound connection to the Earth, a reminder that we are both caretakers and beneficiaries of this beautiful, fragile planet we call home.\n\n<strong style="font-size: 1.25rem; color: var(--primary-orange); display: block; margin-top: 25px; margin-bottom: 5px;">A Legacy Project</strong>Planting trees is planting for the future, a legacy project. Trees can live for decades, centuries, even millennia. They outlive us, becoming monuments of our times, silent witnesses to the passage of time, and guardians of life.\n\nCome and join in our effort to make our mother Earth greener. Fill up the consent form to contact you to invite and participate.`,
    whyTitle: 'Why Plantation is required?',
    whyGrid: [
      { title: 'Carbon Sequestration', text: 'Trees absorb carbon dioxide (a primary greenhouse gas) and store carbon while releasing oxygen, playing a crucial role in mitigating climate change.' },
      { title: 'Oxygen Production', text: 'They produce oxygen through photosynthesis, essential for all life forms.' },
      { title: 'Air Purification', text: 'Trees act as natural air filters, removing pollutants like sulfur dioxide, carbon monoxide, and nitrogen dioxide from the air.' },
      { title: 'Soil Conservation', text: 'Their root systems help prevent soil erosion, maintain soil structure, and contribute to water infiltration, which replenishes groundwater.' },
      { title: 'Water Cycle Regulation', text: 'Trees help regulate the water cycle by intercepting rain, reducing runoff, and promoting transpiration which can influence local weather patterns.' },
      { title: 'Biodiversity', text: 'Trees provide habitat for numerous species, supporting biodiversity. They are crucial in ecosystems where many organisms rely on trees for food, shelter, or reproduction.' },
      { title: 'Mental Health', text: 'Access to green spaces with trees has been linked to lower levels of stress and mental fatigue. Activities like tree planting can be therapeutic, enhancing mental well-being.' }
    ],
    galleryTitle: '"Plant a Tree, Build a Legacy."',
    gallerySubtitle: 'Photographs on plantation awareness activity with scroll option for our future camps photographs.',
    galleryPhotos: [
      { url: '/Emyris Foundation Photos/environment-concept_23-2147517224.webp', title: 'Plantation Drive' }
    ],
    videoTitle: '“Plantation activity in Motion”',
    videoSubtitle: 'Youtube videos with scroll option for our camps and other videos on Plantation activity.',
    videos: []
  } : {
    id: 'welfare',
    title: 'Social Welfare',
    motto: 'Together We Can Build Stronger Communities',
    bannerMsg: 'Welcome to Emyris Foundation where community and compassion converge.',
    narrativeHeading: 'Driving Transformation Together',
    narrativeQuote: '“Your participation builds resilient communities. Join hands and sign up today.”',
    introText: `At Emyris, we believe in the power of collective action to foster change and improve lives. Our mission is rooted in the principle that every individual deserves access to opportunities and support, which is why we're dedicated to a wide array of social welfare activities that address diverse needs within our community. By engaging with us, you're not just participating in activities; you're contributing to a movement. Together, we can build stronger, more resilient communities where everyone has the opportunity to thrive. Join today, and let's turn compassion into action.\n\n<strong style="font-size: 1.25rem; color: var(--primary-orange); display: block; margin-top: 15px; margin-bottom: 5px;">Understanding Social Security: A Vital Safety Net</strong>Social Security is a government program designed to provide financial support to individuals and families across the Country. It serves as a crucial safety net, offering benefits for retirement, disability, and survivors of deceased workers. It plays a vital role in reducing poverty and supporting the well-being of our community's most vulnerable members.\n\n<strong>Key Components of Social Security:</strong><br/>• <strong>Retirement Benefits:</strong> Ensures individuals have a source of income when they retire.<br/>• <strong>Disability Benefits (SSDI & SSI):</strong> Assistance for those unable to work due to illness, injury, or low-income disabilities.<br/>• <strong>Survivor Benefits:</strong> Supports dependents of deceased workers during difficult times.\n\nDespite its importance, Social Security faces challenges, including funding sustainability. Advocacy, education, and direct support are crucial to strengthen and protect this essential program.\n\n<strong style="font-size: 1.25rem; color: var(--primary-orange); display: block; margin-top: 25px; margin-bottom: 5px;">Mental Health: A Crucial Aspect of Well-being</strong>Child and adolescent mental health is essential for overall well-being, impacting emotional, social, and cognitive development. Mental health issues can significantly affect a child’s ability to learn, socialize, and engage in daily activities.\n\n<strong>Common Disorders & Factors:</strong><br/>• <strong>Anxiety & Depressive Disorders:</strong> Can manifest as irritability, sadness, withdrawal, and avoidance behaviors.<br/>• <strong>ADHD & Behavioral Disorders:</strong> Can hinder academic performance and disrupt school environments.<br/>• <strong>Risk Factors:</strong> Include biological genetics, environmental trauma, and social pressures like bullying.\n\n<strong>Importance of Early Intervention:</strong><br/>Early identification and treatment (like Cognitive Behavioral Therapy, medication, or school-based programs) can significantly improve a child's functioning and quality of life.\n\nPrioritizing child and adolescent mental health is essential for fostering a healthy, thriving society. By addressing these issues early and providing adequate support, we can help children reach their full potential.`,
    whyTitle: 'Promoting Mental Health & Well-being',
    whyGrid: [
      { title: 'Education & Awareness', text: 'Raising awareness about mental health can help reduce stigma and encourage families to seek help without hesitation.' },
      { title: 'Parental Support', text: 'Parents play a vital role by fostering open communication, modeling healthy coping strategies, and being involved in their child\'s journey.' },
      { title: 'Community Programs', text: 'Schools and community organizations can offer resources, workshops, and support groups to help children and families.' },
      { title: 'Early Intervention', text: 'Identifying and treating mental health issues early can dramatically improve a child\'s functioning and quality of life.' },
      { title: 'Get Involved', text: 'Whether through advocacy or direct support, your involvement helps strengthen vital safety nets like Social Security for those in need.' }
    ],
    galleryPhotos: [
      { url: '/Emyris Foundation Photos/hands-composition-about-support_23-2150510481.webp', title: 'Community Support' }
    ],
    videos: []
  };

  try {
    // Ensure table exists in database and alters schema if new columns are added
    await CampaignDetail.sync({ alter: true });
    
    let detail = await CampaignDetail.findByPk(id);
    if (detail) {
      return detail.toJSON();
    }
    
    // Seed default data into DB
    const created = await CampaignDetail.create(defaultData);
    return created.toJSON();
  } catch (error) {
    console.error('getCampaignDetail DB error, returning fallback data:', error);
    return defaultData;
  }
}


export async function getBlogs() {
  try {
    const blogs = await Blog.findAll({ limit: 3, order: [['publishedAt', 'DESC'], ['order', 'ASC']] });
    return blogs.map(b => b.toJSON());
  } catch (err) {
    return [];
  }
}

