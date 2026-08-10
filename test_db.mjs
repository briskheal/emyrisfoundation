import { NewsActivity } from './src/lib/db.js';
NewsActivity.findAll({order: [['id', 'DESC']], limit: 3}).then(r => {
  console.log(r.map(n => ({ id: n.id, content: n.content })));
  process.exit(0);
});
