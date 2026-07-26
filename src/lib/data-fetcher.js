import { CorporateProfile, HeroSlide, Campaign, WorkActivity, PresenceLocation } from './db';
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
