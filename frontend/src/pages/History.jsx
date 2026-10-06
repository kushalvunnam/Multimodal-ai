import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserAnalyses } from '../services/api';
import { Loader2, ArrowRight, CheckCircle, Clock } from 'lucide-react';

export default function History() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const res = await getUserAnalyses();
        if (res.success) {
          // Sort by newest first
          const sorted = (res.data || []).filter(a => !(a.status === 'draft' && (!a.inputs || a.inputs.length === 0))).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setAnalyses(sorted);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalyses();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div>
        <h1 className="text-3xl font-extrabold text-text-main">History</h1>
        <p className="text-text-muted mt-1">View your previous OmniSense analyses.</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
      ) : analyses.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-12 shadow-sm text-center">
          <p className="text-slate-500 font-medium mb-6">You haven't created any analyses yet.</p>
          <Link to="/analysis/new" className="inline-flex bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-md transition-all">Start New Analysis</Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Analysis</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 bg-white">
                {analyses.map((item, i) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{item.title || 'Untitled Analysis'}</div>
                      <div className="text-slate-500 text-xs font-medium mt-1">{item.inputs?.length || 0} inputs processed</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {item.status === 'processed' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <CheckCircle className="w-3 h-3 mr-1.5" /> Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
                          <Clock className="w-3 h-3 mr-1.5" /> {item.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {item.status === 'processed' ? (
                        <Link to={`/analysis/${item._id}/results`} className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                          View Results <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      ) : item.status === 'failed' ? (
                        <Link to={`/analysis/${item._id}/workspace`} className="inline-flex items-center text-sm font-bold text-red-600 hover:text-red-800 transition-colors">
                          Retry <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      ) : item.status === 'processing' ? (
                        <Link to={`/analysis/${item._id}/workspace`} className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                          View Progress <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      ) : (
                        <Link to={`/analysis/${item._id}/workspace`} className="inline-flex items-center text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors">
                          Continue Analysis <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
