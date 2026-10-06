const fs = require('fs');
let dash = fs.readFileSync('frontend/src/pages/Dashboard.jsx', 'utf8');

dash = dash.replace(
  "import { getUserAnalyses } from '../services/api';",
  "import { getDashboardStats } from '../services/api';"
);

const oldFetch = `  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const res = await getUserAnalyses();
        if (res?.success) {
          setAnalyses(res.data);
        }
      } catch (err) {
        console.error("Error loading analyses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalyses();
  }, []);

  const totalAnalyses = analyses.length;
  const totalDocuments = analyses.filter(a => a.inputs?.some(i => i.type === 'document')).length;
  
  const damageDetected = analyses.filter(a => {
    if (!a.imageAnalysis) return false;
    const damages = Array.isArray(a.imageAnalysis) 
      ? a.imageAnalysis.flatMap(i => i.damage || []) 
      : (a.imageAnalysis.damage || []);
    return damages.length > 0;
  }).length;

  const confidences = [];
  analyses.forEach(a => {
    if (a.imageAnalysis?.confidence) confidences.push(a.imageAnalysis.confidence);
    else if (Array.isArray(a.imageAnalysis)) {
      a.imageAnalysis.forEach(img => { if (img.confidence) confidences.push(img.confidence); });
    }
  });
  const avgConfidence = confidences.length 
    ? Math.round(confidences.reduce((acc, c) => acc + c, 0) / confidences.length * 100) 
    : 0;

  const stats = [
    { label: 'Total Analyses', value: loading ? '-' : totalAnalyses.toString(), icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '' },
    { label: 'Damage Detected', value: loading ? '-' : damageDetected.toString(), icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50', trend: '' },
    { label: 'Documents', value: loading ? '-' : totalDocuments.toString(), icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50', trend: '' },
    { label: 'AI Confidence', value: loading ? '-' : (confidences.length ? \`\${avgConfidence}%\` : '--'), icon: BrainCircuit, color: 'text-emerald-500', bg: 'bg-emerald-50', trend: '' },
  ];

  const recent = analyses
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map(a => {
      const findings = [];
      if (a.imageAnalysis) {
        const damages = Array.isArray(a.imageAnalysis) ? a.imageAnalysis.flatMap(i => i.damage || []) : (a.imageAnalysis.damage || []);
        if (damages.length > 0) findings.push({ label: damages[0].type || 'Damage', level: damages[0].severity === 'High' ? 'High' : 'Medium' });
      }
      let statusString = 'Draft';
      if (a.status === 'processed') statusString = 'Completed';
      else if (a.status === 'processing') statusString = 'Processing';
      else if (a.status === 'failed') statusString = 'Failed';

      return {
        id: a._id.substring(0,8).toUpperCase(),
        originalId: a._id,
        type: new Date(a.createdAt).toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: statusString,
        findings: findings,
        image: a.inputs?.some(i => i.type === 'image') ? 'true' : 'false'
      };
    });`;

const newFetch = `  const [dashboardData, setDashboardData] = useState({
    totalAnalyses: 0,
    damageDetected: 0,
    documents: 0,
    aiConfidence: 0,
    recentAnalyses: []
  });
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchDashboard = async () => {
      try {
        const res = await getDashboardStats();
        if (mounted && res?.success) {
          setDashboardData(res.data);
          setError(false);
        } else if (mounted) {
          setError(true);
        }
      } catch (err) {
        if (mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchDashboard();
    return () => { mounted = false; };
  }, []);

  const stats = [
    { label: 'Total Analyses', value: loading ? '-' : dashboardData.totalAnalyses.toString(), icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '' },
    { label: 'Damage Detected', value: loading ? '-' : dashboardData.damageDetected.toString(), icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50', trend: '' },
    { label: 'Documents', value: loading ? '-' : dashboardData.documents.toString(), icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50', trend: '' },
    { label: 'AI Confidence', value: loading ? '-' : (dashboardData.aiConfidence > 0 ? \`\${dashboardData.aiConfidence}%\` : '--'), icon: BrainCircuit, color: 'text-emerald-500', bg: 'bg-emerald-50', trend: '' },
  ];

  const recent = dashboardData.recentAnalyses;`;

dash = dash.replace(oldFetch, newFetch);

const oldErrorHandle = `{loading ? (
            <div className="text-center py-10 text-slate-500 text-sm font-medium">Loading workspace...</div>
          ) : recent.length === 0 ? (`;

const newErrorHandle = `{loading ? (
            <div className="text-center py-10 text-slate-500 text-sm font-medium">Loading workspace...</div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-red-50/50 rounded-2xl border border-dashed border-red-200">
              <AlertTriangle className="w-8 h-8 text-red-400 mb-4" />
              <h3 className="text-lg font-bold text-red-800 mb-2">Error loading dashboard</h3>
              <p className="text-red-500 text-sm mb-6">We couldn't connect to the server.</p>
              <button onClick={() => window.location.reload()} className="px-6 py-2 bg-white text-red-600 text-sm font-bold rounded-xl border border-red-200 hover:bg-red-50 shadow-sm">Retry</button>
            </div>
          ) : recent.length === 0 ? (`;

dash = dash.replace(oldErrorHandle, newErrorHandle);

fs.writeFileSync('frontend/src/pages/Dashboard.jsx', dash);
