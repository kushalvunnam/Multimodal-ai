const fs = require('fs');
let history = fs.readFileSync('frontend/src/pages/History.jsx', 'utf8');

history = history.replace(
  "const sorted = (res.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));",
  "const sorted = (res.data || []).filter(a => !(a.status === 'draft' && (!a.inputs || a.inputs.length === 0))).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));"
);

history = history.replace(
  /<Link to=\{\`\/analysis\/\$\{analysis\._id\}\/results\`\}([\s\S]*?)>[\s\S]*?View Results[\s\S]*?<\/Link>/g,
  `{analysis.status === 'processed' ? (
    <Link to={\`/analysis/\${analysis._id}/results\`} $1>
      View Results <ArrowRight className="w-4 h-4 ml-1" />
    </Link>
  ) : analysis.status === 'failed' ? (
    <Link to={\`/analysis/\${analysis._id}/workspace\`} $1>
      Retry <ArrowRight className="w-4 h-4 ml-1" />
    </Link>
  ) : analysis.status === 'processing' ? (
    <Link to={\`/analysis/\${analysis._id}/workspace\`} $1>
      View Progress <ArrowRight className="w-4 h-4 ml-1" />
    </Link>
  ) : (
    <Link to={\`/analysis/\${analysis._id}/workspace\`} $1>
      Continue Analysis <ArrowRight className="w-4 h-4 ml-1" />
    </Link>
  )}`
);

fs.writeFileSync('frontend/src/pages/History.jsx', history);
