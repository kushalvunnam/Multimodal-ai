const fs = require('fs');
let dash = fs.readFileSync('frontend/src/pages/Dashboard.jsx', 'utf8');

dash = dash.replace(
  "{item.findings.map((finding, idx) => (",
  "{(item?.findings || []).map((finding, idx) => ("
);

fs.writeFileSync('frontend/src/pages/Dashboard.jsx', dash);
