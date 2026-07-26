const fs = require('fs');
let c = fs.readFileSync('src/components/modals/DonateModal.jsx', 'utf8');
c = c.replace(/<span className="amt">.*?\{val/g, '<span className="amt">₹ {val');
c = c.replace(/<strong className="text-orange">.*?\{amount/g, '<strong className="text-orange">₹ {amount');
fs.writeFileSync('src/components/modals/DonateModal.jsx', c);
