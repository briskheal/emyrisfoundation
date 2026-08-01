const https = require('https');

function poll() {
  https.get('https://emyrisfoundation.com/api/force-update-campaigns', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Response:', data);
      if (data.includes('success')) {
        console.log('Success! Stopping.');
        process.exit(0);
      } else {
        console.log('Not ready, waiting 10s...');
        setTimeout(poll, 10000);
      }
    });
  }).on('error', err => {
    console.error('Error:', err.message);
    setTimeout(poll, 10000);
  });
}

poll();
