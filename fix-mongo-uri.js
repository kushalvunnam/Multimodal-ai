const fs = require('fs');
let server = fs.readFileSync('backend/server.js', 'utf8');

server = server.replace(
  "mongoose.connect(process.env.MONGODB_URI)",
  "mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI)"
);

fs.writeFileSync('backend/server.js', server);
