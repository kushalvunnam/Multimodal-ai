const fs = require('fs');
let navbar = fs.readFileSync('frontend/src/components/layout/Navbar.jsx', 'utf8');

navbar = navbar.replace('<div className="flex items-center">', '');
navbar = navbar.replace('</button>', '</button>\n');

fs.writeFileSync('frontend/src/components/layout/Navbar.jsx', navbar);
