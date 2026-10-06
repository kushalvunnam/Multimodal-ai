const fs = require('fs');
let dash = fs.readFileSync('frontend/src/pages/Dashboard.jsx', 'utf8');

dash = dash.replace(
  "          ))}\r\n        </div>",
  "          ))\n          )}\n        </div>"
);

dash = dash.replace(
  "          ))}\n        </div>",
  "          ))\n          )}\n        </div>"
);

fs.writeFileSync('frontend/src/pages/Dashboard.jsx', dash);
