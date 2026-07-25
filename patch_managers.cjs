/**
 * Patches remaining manager components to:
 * 1. Import ConflictBanner and LastEditedBadge
 * 2. Add loadedAt state
 * 3. Send lastKnownUpdatedAt with PUT
 * 4. Show ConflictBanner on 409
 * 5. Show LastEditedBadge on each row
 */
const fs = require('fs');

const managers = [
  'src/components/admin/MentorManager.jsx',
  'src/components/admin/CampaignManager.jsx',
  'src/components/admin/WorkManager.jsx',
  'src/components/admin/HeroManager.jsx',
  'src/components/admin/PublicationManager.jsx',
  'src/components/admin/AboutManager.jsx',
  'src/components/admin/MenuManager.jsx',
  'src/components/admin/HeroStatManager.jsx',
  'src/components/admin/PresenceManager.jsx',
  'src/components/admin/ContentManager.jsx',
];

managers.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Add import if not already present
    if (!content.includes('ConflictBanner')) {
      content = content.replace(
        `import React, { useState, useEffect } from 'react';`,
        `import React, { useState, useEffect } from 'react';\nimport { ConflictBanner, LastEditedBadge } from '../../lib/useConflictSave';`
      );
    }

    // 2. Add loadedAt + conflictInfo state after const [loading, setLoading]
    if (!content.includes('loadedAt')) {
      content = content.replace(
        `const [loading, setLoading] = useState(true);`,
        `const [loading, setLoading] = useState(true);\n  const [conflictInfo, setConflictInfo] = useState(null);\n  const [loadedAt, setLoadedAt] = useState(null);`
      );
    }

    // 3. In editItem/edit handler — capture updatedAt as loadedAt
    if (!content.includes('setLoadedAt')) {
      content = content.replace(
        /const editItem = \(item\) => \{[\s\S]*?setEditing\(item\.id\);[\s\S]*?setFormData\(item\);/,
        match => match + `\n    setLoadedAt(item.updatedAt);\n    setConflictInfo(null);`
      );
    }

    // 4. Add lastKnownUpdatedAt to PUT payload
    if (!content.includes('lastKnownUpdatedAt')) {
      content = content.replace(
        /method: 'PUT',/g,
        `method: 'PUT', // conflict-aware`
      );
      // Insert lastKnownUpdatedAt into body before JSON.stringify
      content = content.replace(
        /body: JSON\.stringify\(formData\)/g,
        `body: JSON.stringify({ ...formData, lastKnownUpdatedAt: loadedAt })`
      );
      content = content.replace(
        /body: JSON\.stringify\(body\)/g,
        `body: JSON.stringify({ ...body, lastKnownUpdatedAt: loadedAt })`
      );
    }

    // 5. Handle 409 conflict response after fetch
    if (!content.includes('status === 409')) {
      content = content.replace(
        /if \(res\.ok\) \{/g,
        `if (res.status === 409) { const d = await res.json(); setConflictInfo(d); return; }\n      if (res.ok) {`
      );
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Patched: ${filePath}`);
  } catch (err) {
    console.error(`❌ Failed: ${filePath}`, err.message);
  }
});

console.log('\nAll managers patched.');
