const fs = require('fs');

let fileContent = fs.readFileSync('src/lib/data-fetcher.js', 'utf8');

const newDefaultDataStr = `const defaultData = isBlood ? {
    id: 'blood',
    title: 'Blood Donation Camps',
    motto: 'Be a Hero, Donate Blood.',
    bannerMsg: 'Join Hands to create awareness and willingness to Donate Blood to Save Lives.',
    narrativeHeading: 'Every Drop is a Testament to Life',
    narrativeQuote: '“Come and shower your love in saving someone’s life. Join hands and fill up the consent form to coordinate your invitation.”',
    introText: \`The beauty of blood donation lies in its simplicity and accessibility. It requires no special skills, just a willingness to give a part of oneself for the greater good. Every drop donated is a testament to the community's commitment to life, to each other.\\n\\n<strong style="font-size: 1.25rem; color: var(--primary-orange); display: block; margin-top: 15px; margin-bottom: 5px;">A Culture of Giving</strong>So, let's take a moment to reflect on the power we hold within us—the power to save lives. Let us not wait for a crisis to act; let's create a culture where giving blood is as routine as any other civic duty. By doing so, we not only protect our immediate community but also contribute to a global network of care and compassion.\\n\\n<strong style="font-size: 1.25rem; color: var(--primary-orange); display: block; margin-top: 25px; margin-bottom: 5px;">Celebrations of Life</strong>In essence, blood donation camps are more than just events; they are celebrations of life, love, and community. They are a call to action for each of us to be a part of something larger than ourselves, to be a part of the heartbeat of our community. Let's keep this heartbeat strong, for in doing so, we keep our society alive, vibrant, and interconnected.\\n\\nCome and shower your love in saving someone’s life. Join Hand and Fill up the consent form to contact you to invite.\`,
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
    introText: \`"Siksha Hi Suraksha" translates to "Education is Protection," emphasizing the role of education as a fundamental safeguard for underprivileged children.\\n\\n<strong style="font-size: 1.25rem; color: var(--primary-orange); display: block; margin-top: 15px; margin-bottom: 5px;">Education as the Bedrock</strong>In the tapestry of human development, education stands out as a golden thread, weaving through the fabric of society to fortify its most vulnerable members. "Siksha Hi Suraksha" is not just a slogan; it's a clarion call for transformative action, particularly for those children who find themselves on the fringes of opportunity due to socio-economic disparities.\\n\\n<strong style="font-size: 1.25rem; color: var(--primary-orange); display: block; margin-top: 25px; margin-bottom: 5px;">Breaking Cycles of Poverty</strong>Education for underprivileged children transcends the traditional boundaries of learning. It's about empowerment, breaking cycles of poverty, and opening doors to a future where children can dream, aspire, and achieve. For these children, education isn't merely an option; it's a lifeline, a shield against the adversities of child labor, early marriage, and trafficking.\`,
    whyTitle: 'Purpose behind action:',
    whyGrid: [
      { title: 'Empowerment', text: 'Education equips children with the knowledge and skills necessary to navigate through life\\'s challenges, fostering an environment where they can grow into informed, responsible citizens.' },
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
    introText: \`Imagine a world where every person who can donate, does. A world where waiting lists for organs are dramatically shortened or even eradicated. This isn't a distant dream but a reachable reality with increased awareness and action.\\n\\n<strong style="font-size: 1.25rem; color: var(--primary-orange); display: block; margin-top: 15px; margin-bottom: 5px;">What Can I Do?</strong>To those who ponder, "What can I do?"—your action can be as simple as registering as an organ donor. It's about sparking conversations, educating others, and breaking through the silence that often surrounds this topic. Organ donation isn't just about saving lives; it's about fostering a culture of empathy, where life's end for one becomes life's beginning for another.\\n\\n<strong style="font-size: 1.25rem; color: var(--primary-orange); display: block; margin-top: 25px; margin-bottom: 5px;">A Profound Gift</strong>Let's pledge not only to give when we can but to also spread the word, dispel myths, and advocate for a future where organ donation is as commonplace as any other act of kindness. In doing so, we participate in one of the most profound gifts humanity can offer—the gift of life.\\n\\nCome and shower your love in saving someone’s life. Join Hand and Fill up the consent form to contact you.\`,
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
    introText: \`Plantation activities are a call to each of us, inviting us to participate in the regeneration of our planet. They remind us that every individual can make a difference that collective effort can lead to monumental change.\\n\\n<strong style="font-size: 1.25rem; color: var(--primary-orange); display: block; margin-top: 15px; margin-bottom: 5px;">Cultivate a Future</strong>So, let us dig into the soil, not just to plant a tree but to plant hope, to cultivate a future where nature's balance is restored, where every breath of fresh air and every sip of clean water is a testament to our commitment to life. In the simple act of planting, we find a profound connection to the Earth, a reminder that we are both caretakers and beneficiaries of this beautiful, fragile planet we call home.\\n\\n<strong style="font-size: 1.25rem; color: var(--primary-orange); display: block; margin-top: 25px; margin-bottom: 5px;">A Legacy Project</strong>Planting trees is planting for the future, a legacy project. Trees can live for decades, centuries, even millennia. They outlive us, becoming monuments of our times, silent witnesses to the passage of time, and guardians of life.\\n\\nCome and join in our effort to make our mother Earth greener. Fill up the consent form to contact you to invite and participate.\`,
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
    title: 'Social Welfare',`;

const startIdx = fileContent.indexOf('const defaultData = isBlood ? {');
const endIdx = fileContent.indexOf('id: \'welfare\',', startIdx) + 14 + 18;

if (startIdx !== -1 && endIdx !== -1) {
    const finalContent = fileContent.substring(0, startIdx) + newDefaultDataStr + fileContent.substring(endIdx);
    fs.writeFileSync('src/lib/data-fetcher.js', finalContent);
    console.log("Successfully replaced block.");
} else {
    console.error("Could not find the block to replace.");
}
