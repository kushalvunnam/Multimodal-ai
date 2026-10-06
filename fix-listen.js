const fs = require('fs');
let server = fs.readFileSync('backend/server.js', 'utf8');

server = server.replace(/app\.listen\(PORT, \(\) => \{[\s\S]*?\}\);/, `mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(\`Server running on port \${PORT}\`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });`);

fs.writeFileSync('backend/server.js', server);
