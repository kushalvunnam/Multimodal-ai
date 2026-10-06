const fs = require('fs');
let history = fs.readFileSync('frontend/src/pages/History.jsx', 'utf8');

history = history.replace(
  '<Link to={`/analysis/${item._id}/results`} className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">\n                        View Results <ArrowRight className="w-4 h-4 ml-1" />\n                      </Link>',
  `{item.status === 'processed' ? (
                        <Link to={\`/analysis/\${item._id}/results\`} className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                          View Results <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      ) : item.status === 'failed' ? (
                        <Link to={\`/analysis/\${item._id}/workspace\`} className="inline-flex items-center text-sm font-bold text-red-600 hover:text-red-800 transition-colors">
                          Retry <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      ) : item.status === 'processing' ? (
                        <Link to={\`/analysis/\${item._id}/workspace\`} className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                          View Progress <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      ) : (
                        <Link to={\`/analysis/\${item._id}/workspace\`} className="inline-flex items-center text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors">
                          Continue Analysis <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      )}`
);

fs.writeFileSync('frontend/src/pages/History.jsx', history);
