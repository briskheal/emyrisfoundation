const https = require('https');

function poll() {
  https.get('https://emyrisfoundation.com/api/force-update-campaigns', (res1) => {
    res1.on('data', () => {}); // Consume
    res1.on('end', () => {
      // Now check shiksha
      https.get('https://emyrisfoundation.com/api/campaign-details/shiksha', (res2) => {
        let data = '';
        res2.on('data', chunk => data += chunk);
        res2.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (json.narrativeHeading === 'Education as the Bedrock') {
              console.log('SUCCESS! New content is live and seeded!');
              process.exit(0);
            } else {
              console.log('Still old content:', json.narrativeHeading);
              setTimeout(poll, 10000);
            }
          } catch(e) {
            console.log('Error parsing:', e.message);
            setTimeout(poll, 10000);
          }
        });
      });
    });
  }).on('error', err => {
    console.log('Error:', err.message);
    setTimeout(poll, 10000);
  });
}

console.log('Starting poll...');
poll();
