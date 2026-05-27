const fs = require('fs');
const path = require('path');
const d = path.join(__dirname, 'src', 'pages', 'settings');
fs.readdirSync(d).forEach(f => {
  let p = path.join(d, f);
  let c = fs.readFileSync(p, 'utf8');
  c = c.replace(/import api from '\.\.\/\.\.\/api\/axios';/g, "import { httpClient as api } from '../../api/httpClient';");
  if (f === 'SettingsProfilePage.tsx') {
    c = c.replace(/import { useEffect } from 'react';\n/, "");
  }
  if (f === 'AccountSettingsPage.tsx') {
    c = c.replace(/import { useState, useEffect } from 'react';/, "import { useState } from 'react';");
  }
  fs.writeFileSync(p, c);
});
