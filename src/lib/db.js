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
  tax80g: DataTypes.STRING,
  tax12a: DataTypes.STRING,
  fb: DataTypes.STRING,
  insta: DataTypes.STRING,
  linkedin: DataTypes.STRING,
  xUrl: DataTypes.STRING,       // newly added
  youtubeUrl: DataTypes.STRING, // newly added
  accountName: DataTypes.STRING,
  accountNo: DataTypes.STRING,
  ifsc: DataTypes.STRING,
  bankName: DataTypes.STRING,
  bankBranch: DataTypes.STRING,
  upiId: DataTypes.STRING,
  qrCode: DataTypes.TEXT,
  logo: DataTypes.TEXT,
});

export const AdminUser = sequelize.define('AdminUser', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, unique: true },
  passwordHash: DataTypes.STRING,
  role: { type: DataTypes.STRING, defaultValue: 'superadmin' },
});

export const HeroSlide = sequelize.define('HeroSlide', {
  id: { type: DataTypes.STRING, primaryKey: true }, // Using string ID to match existing JSON e.g. "slide-1"
  title: DataTypes.STRING,
  motto: DataTypes.STRING,
  img: DataTypes.STRING,
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
});

export const Campaign = sequelize.define('Campaign', {
  id: { type: DataTypes.STRING, primaryKey: true }, // e.g. "shiksha"
  title: DataTypes.STRING,
  motto: DataTypes.STRING,
  tag: DataTypes.STRING,
  img: DataTypes.STRING,
  desc: DataTypes.TEXT,
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
});

export const WorkActivity = sequelize.define('WorkActivity', {
  id: { type: DataTypes.STRING, primaryKey: true }, // e.g. "work-education"
  title: DataTypes.STRING,
  motto: DataTypes.STRING,
  statVal: DataTypes.STRING,
  statLbl: DataTypes.STRING,
  desc: DataTypes.TEXT,
  bullets: DataTypes.JSON, // Array of strings stored as JSON
  img: DataTypes.STRING,
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
});
export const AboutContent = sequelize.define('AboutContent', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: DataTypes.STRING,
  subtitle: DataTypes.STRING,
  motto: DataTypes.STRING,
  paragraph1: DataTypes.TEXT,
  paragraph2: DataTypes.TEXT,
});

export const Director = sequelize.define('Director', {
  id: { type: DataTypes.STRING, primaryKey: true },
  name: DataTypes.STRING,
  role: DataTypes.STRING,
  bio: DataTypes.TEXT,
  img: DataTypes.STRING,
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
});

export const Mentor = sequelize.define('Mentor', {
  id: { type: DataTypes.STRING, primaryKey: true },
  name: DataTypes.STRING,
  role: DataTypes.STRING,
  bio: DataTypes.TEXT,
  img: DataTypes.STRING,
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
});

export const Publication = sequelize.define('Publication', {
  id: { type: DataTypes.STRING, primaryKey: true },
  title: DataTypes.STRING,
  year: DataTypes.STRING,
  pdfLink: DataTypes.STRING,
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
});

// -- PHASE 3 DYNAMIC MODELS --

export const MenuLink = sequelize.define('MenuLink', {
  id: { type: DataTypes.STRING, primaryKey: true },
  label: DataTypes.STRING,
  url: DataTypes.STRING,
  parentMenu: DataTypes.STRING,
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
});

export const HeroStat = sequelize.define('HeroStat', {
  id: { type: DataTypes.STRING, primaryKey: true },
  value: DataTypes.STRING,
  label: DataTypes.STRING,
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
});

export const SectionContent = sequelize.define('SectionContent', {
  id: { type: DataTypes.STRING, primaryKey: true },
  title: DataTypes.STRING,
  subtitle: DataTypes.STRING,
  content: DataTypes.TEXT,
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
