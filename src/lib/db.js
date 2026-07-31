import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost:5432/dummy', {
  dialect: 'postgres',
  logging: false,
});

export const CorporateProfile = sequelize.define('CorporateProfile', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  phone1: DataTypes.STRING,
  phone2: DataTypes.STRING,
  address: DataTypes.TEXT,
  pan: DataTypes.STRING,
  tan: DataTypes.STRING,
  cin: DataTypes.STRING,
  niti: DataTypes.STRING,
  csr: DataTypes.STRING,
  darpan: DataTypes.STRING,
  tax80g: DataTypes.STRING,
  tax12a: DataTypes.STRING,
  fb: DataTypes.STRING,
  insta: DataTypes.STRING,
  linkedin: DataTypes.STRING,
  xUrl: DataTypes.STRING,
  youtubeUrl: DataTypes.STRING,
  accountName: DataTypes.STRING,
  accountNo: DataTypes.STRING,
  ifsc: DataTypes.STRING,
  bankName: DataTypes.STRING,
  bankBranch: DataTypes.STRING,
  upiId: DataTypes.STRING,
  qrCode: DataTypes.TEXT,
  logo: DataTypes.TEXT,
  operationalCenters: DataTypes.TEXT,
  updatedBy: { type: DataTypes.STRING, defaultValue: 'system' },
});

export const AdminUser = sequelize.define('AdminUser', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, unique: true },
  passwordHash: DataTypes.STRING,
  role: { type: DataTypes.STRING, defaultValue: 'superadmin' },
});

export const HeroSlide = sequelize.define('HeroSlide', {
  id: { type: DataTypes.STRING, primaryKey: true },
  title: DataTypes.STRING,
  motto: DataTypes.STRING,
  img: DataTypes.STRING,
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
  updatedBy: { type: DataTypes.STRING, defaultValue: 'system' },
});

export const Campaign = sequelize.define('Campaign', {
  id: { type: DataTypes.STRING, primaryKey: true },
  title: DataTypes.STRING,
  motto: DataTypes.STRING,
  tag: DataTypes.STRING,
  img: DataTypes.STRING,
  desc: DataTypes.TEXT,
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
  updatedBy: { type: DataTypes.STRING, defaultValue: 'system' },
});

export const WorkActivity = sequelize.define('WorkActivity', {
  id: { type: DataTypes.STRING, primaryKey: true },
  title: DataTypes.STRING,
  motto: DataTypes.STRING,
  statVal: DataTypes.STRING,
  statLbl: DataTypes.STRING,
  desc: DataTypes.TEXT,
  bullets: DataTypes.JSON,
  img: DataTypes.STRING,
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
  updatedBy: { type: DataTypes.STRING, defaultValue: 'system' },
});

export const AboutContent = sequelize.define('AboutContent', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: DataTypes.STRING,
  subtitle: DataTypes.STRING,
  motto: DataTypes.STRING,
  paragraph1: DataTypes.TEXT,
  paragraph2: DataTypes.TEXT,
  directorsSubtitle: DataTypes.STRING,
  directorsTitle: DataTypes.STRING,
  updatedBy: { type: DataTypes.STRING, defaultValue: 'system' },
});

export const Director = sequelize.define('Director', {
  id: { type: DataTypes.STRING, primaryKey: true },
  name: DataTypes.STRING,
  role: DataTypes.STRING,
  bio: DataTypes.TEXT,
  img: DataTypes.STRING,
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
  updatedBy: { type: DataTypes.STRING, defaultValue: 'system' },
});

export const Mentor = sequelize.define('Mentor', {
  id: { type: DataTypes.STRING, primaryKey: true },
  name: DataTypes.STRING,
  role: DataTypes.STRING,
  bio: DataTypes.TEXT,
  img: DataTypes.STRING,
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
  updatedBy: { type: DataTypes.STRING, defaultValue: 'system' },
});

export const Publication = sequelize.define('Publication', {
  id: { type: DataTypes.STRING, primaryKey: true },
  title: DataTypes.STRING,
  year: DataTypes.STRING,
  pdfLink: DataTypes.STRING,
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
  updatedBy: { type: DataTypes.STRING, defaultValue: 'system' },
});

// -- PHASE 3 DYNAMIC MODELS --

export const MenuLink = sequelize.define('MenuLink', {
  id: { type: DataTypes.STRING, primaryKey: true },
  label: DataTypes.STRING,
  url: DataTypes.STRING,
  parentMenu: DataTypes.STRING,
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
  updatedBy: { type: DataTypes.STRING, defaultValue: 'system' },
});

export const HeroStat = sequelize.define('HeroStat', {
  id: { type: DataTypes.STRING, primaryKey: true },
  value: DataTypes.STRING,
  label: DataTypes.STRING,
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
  updatedBy: { type: DataTypes.STRING, defaultValue: 'system' },
});

export const Donor = sequelize.define('Donor', {
  id: { type: DataTypes.STRING, primaryKey: true },
  name: DataTypes.STRING,
  image: DataTypes.STRING, // Path to uploaded logo/thumbnail
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
});

export const PresenceLocation = sequelize.define('PresenceLocation', {
  id: { type: DataTypes.STRING, primaryKey: true },
  name: DataTypes.STRING,
  hq: DataTypes.STRING,
  volunteers: DataTypes.INTEGER,
  coordinator: DataTypes.STRING,
  phone: DataTypes.STRING,
  programs: DataTypes.JSON,
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
  updatedBy: { type: DataTypes.STRING, defaultValue: 'system' },
});

export const SectionContent = sequelize.define('SectionContent', {
  id: { type: DataTypes.STRING, primaryKey: true },
  title: DataTypes.STRING,
  subtitle: DataTypes.STRING,
  content: DataTypes.TEXT,
  updatedBy: { type: DataTypes.STRING, defaultValue: 'system' },
});

export const Donation = sequelize.define('Donation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  donorName: DataTypes.STRING,
  email: DataTypes.STRING,
  phone: DataTypes.STRING,
  pan: DataTypes.STRING,
  amount: DataTypes.DECIMAL(10, 2),
  txnId: DataTypes.STRING,
  status: { type: DataTypes.STRING, defaultValue: 'Pending' },
  date: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
});

export const ContactSubmission = sequelize.define('ContactSubmission', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  phone: DataTypes.STRING,
  message: DataTypes.TEXT,
  date: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
});

export const ApplicationSubmission = sequelize.define('ApplicationSubmission', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type: DataTypes.STRING,
  position: DataTypes.STRING,
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  phone: DataTypes.STRING,
  resumeUrl: DataTypes.STRING,
  message: DataTypes.TEXT,
  ipAddress: DataTypes.STRING,
  date: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
});

export const CampaignRegistration = sequelize.define('CampaignRegistration', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  campaign: DataTypes.STRING,
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  phone: DataTypes.STRING,
  ipAddress: DataTypes.STRING,
  date: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
});

export const GalleryMedia = sequelize.define('GalleryMedia', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type: DataTypes.STRING,
  title: DataTypes.STRING,
  url: DataTypes.STRING,
  year: DataTypes.STRING,
  month: DataTypes.STRING,
  date: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
});

export const JobOpening = sequelize.define('JobOpening', {
  id: { type: DataTypes.STRING, primaryKey: true },
  title: DataTypes.STRING,
  dept: DataTypes.STRING,
  loc: DataTypes.STRING,
  desc: DataTypes.TEXT,
  active: { type: DataTypes.BOOLEAN, defaultValue: true },
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
});

export const WorkDetail = sequelize.define('WorkDetail', {
  id: { type: DataTypes.STRING, primaryKey: true }, // e.g. 'work-education'
  bannerTitle: DataTypes.STRING,
  whyTitle: DataTypes.STRING,
  whyText: DataTypes.TEXT,
  sdgGrid: DataTypes.JSON,
  impactMedia: DataTypes.JSON,
  reachStats: DataTypes.JSON,
  testimonials: DataTypes.JSON,
  videos: DataTypes.JSON
});

export const CampaignDetail = sequelize.define('CampaignDetail', {
  id: { type: DataTypes.STRING, primaryKey: true },
  title: DataTypes.STRING,
  motto: DataTypes.STRING,
  bannerMsg: DataTypes.TEXT,
  introText: DataTypes.TEXT,
  whyTitle: DataTypes.STRING,
  whyGrid: DataTypes.JSON,
  galleryPhotos: DataTypes.JSON,
  videos: DataTypes.JSON
});
