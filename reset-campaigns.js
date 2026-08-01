import { CampaignDetail } from './src/lib/db.js';

async function resetCampaigns() {
  try {
    console.log('Dropping and recreating CampaignDetail table...');
    await CampaignDetail.sync({ force: true });
    console.log('CampaignDetail table successfully reset.');
    process.exit(0);
  } catch (err) {
    console.error('Error resetting CampaignDetail:', err);
    process.exit(1);
  }
}

resetCampaigns();
