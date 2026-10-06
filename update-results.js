const fs = require('fs');
let results = fs.readFileSync('frontend/src/pages/Results.jsx', 'utf8');

// Add error state
results = results.replace(
  "const [loading, setLoading] = useState(true);",
  "const [loading, setLoading] = useState(true);\n  const [errorStatus, setErrorStatus] = useState(null);"
);

// Update fetch logic
results = results.replace(
  /const fetchResults = async \(\) => \{[\s\S]*?catch \(err\) \{[\s\S]*?\} finally \{[\s\S]*?\}\s*\};/m,
  `const fetchResults = async () => {
      try {
        const res = await getAnalysis(id);
        if (res.success && res.data) {
          setData(res.data);
        } else {
          setErrorStatus(404);
        }
      } catch (err) {
        setErrorStatus(err.response?.status || 500);
      } finally {
        setLoading(false);
      }
    };`
);

// Update render logic
const renderLogic = `
  if (loading) return <div className="min-h-[60vh] flex flex-col items-center justify-center text-indigo-600"><Loader2 className="w-10 h-10 animate-spin mb-4" /> Loading AI Results...</div>;
  if (errorStatus === 401) return <div className="p-10 text-center text-red-500 font-bold bg-red-50 rounded-2xl">Your session has expired. Please sign in again.</div>;
  if (errorStatus === 403) return <div className="p-10 text-center text-red-500 font-bold bg-red-50 rounded-2xl">You do not have permission to view this analysis.</div>;
  if (errorStatus === 404 || !data) return <div className="p-10 text-center text-red-500 font-bold bg-red-50 rounded-2xl">This analysis could not be found.</div>;
  
  if (data.status === 'processing') return <div className="p-10 text-center text-blue-500 font-bold bg-blue-50 rounded-2xl">Analysis is still being processed. Please check the workspace.</div>;
  if (data.status === 'failed') return <div className="p-10 text-center text-red-500 font-bold bg-red-50 rounded-2xl">Analysis processing failed. <a href={\`/analysis/\${id}/workspace\`} className="underline">Retry</a></div>;
  
  const { reasoning = {}, inputs = [], customerSummary, status, createdAt, imageAnalysis, documentAnalysis, audioAnalysis, textAnalysis } = data;
  const { correlations = [], contradictions = [], missingInformation = [], riskSignals = [], recommendations = [], overallAssessment = 'Analysis completed, but detailed reasoning was not generated.' } = reasoning;
`;

results = results.replace(
  /if \(loading\) return[\s\S]*?const dateObj = new Date\(createdAt\);/m,
  renderLogic + '\n  const dateObj = new Date(createdAt);'
);

fs.writeFileSync('frontend/src/pages/Results.jsx', results);
