const fs = require('fs');

let dash = fs.readFileSync('frontend/src/pages/Dashboard.jsx', 'utf8');

const regex = /export default function Dashboard\(\) \{[\s\S]*?return \(/;

const newCode = `export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  
  const [dashboardData, setDashboardData] = useState({
    totalAnalyses: 0,
    damageDetected: 0,
    documents: 0,
    aiConfidence: 0,
    recentAnalyses: []
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const recent = dashboardData.recentAnalyses || [];

  return (`;

dash = dash.replace(regex, newCode);

fs.writeFileSync('frontend/src/pages/Dashboard.jsx', dash);
