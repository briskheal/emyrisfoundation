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
});
