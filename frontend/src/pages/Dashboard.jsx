import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, ImageIcon, FileText, AlertTriangle, ArrowRight, CheckCircle, Clock, Plus, BarChart2, ScanLine, Mic, BrainCircuit, Car } from 'lucide-react';
import { motion } from 'framer-motion';
import AssistantModal from '../components/AssistantModal';

export default function Dashboard() {
  const { user } = useAuth();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  
  const stats = [
    { label: 'Total Analyses', value: '24', icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+12%' },
    { label: 'Damage Detected', value: '12', icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50', trend: '-8%' },
    { label: 'Documents', value: '18', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50', trend: '+24%' },
    { label: 'AI Confidence', value: '94%', icon: BrainCircuit, color: 'text-emerald-500', bg: 'bg-emerald-50', trend: '+5%' },
  ];

  const recent = [
    { id: 'BFDB7B32', type: 'Oct 6, 2026 • 6:24 PM', status: 'Completed', findings: [{label: 'Front Bumper', level: 'High'}], image: 'true' },
    { id: 'A8C1D9F0', type: 'Oct 5, 2026 • 11:12 AM', status: 'Completed', findings: [{label: 'Headlight', level: 'Medium'}], image: 'true' },
  ];

  return (
    <div className="space-y-8 relative max-w-7xl mx-auto">
      
      {/* PREMIUM HERO SECTION */}
      <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between">
        
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-indigo-100/50 via-purple-50/50 to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/4 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/4"></div>

        {/* Hero Left Content */}
        <div className="lg:w-1/2 relative z-10 text-center lg:text-left mb-12 lg:mb-0">
          <p className="text-xs font-black tracking-widest text-indigo-500 uppercase mb-4">Welcome back, {user?.name?.split(' ')[0] || 'User'}</p>
          <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
            See Beyond <br/>the Surface.
          </h1>
          <p className="text-slate-500 text-lg font-medium mb-8 max-w-md mx-auto lg:mx-0">
            OmniSense connects visual, textual and audio evidence into one intelligent analysis.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/analysis/new" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-[0_4px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_8px_30px_rgba(79,70,229,0.4)] flex items-center hover:-translate-y-0.5 w-full sm:w-auto justify-center">
              <Plus className="w-5 h-5 mr-2" /> New Analysis
            </Link>
            <Link to="/reports" className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-3.5 rounded-full font-bold transition-all shadow-sm hover:shadow flex items-center w-full sm:w-auto justify-center">
              Explore Reports <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>

        {/* Hero Right Visualization */}
        <div className="lg:w-1/2 relative z-10 flex justify-center items-center h-[300px] lg:h-[400px] w-full">
          {/* Central 3D Vehicle representation */}
          <div className="relative w-64 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-[5rem] shadow-2xl flex items-center justify-center border border-white">
            <div className="absolute w-40 h-16 bg-white/80 backdrop-blur-sm rounded-t-3xl -top-12 border border-white/50 shadow-sm"></div>
            <div className="absolute -bottom-6 left-8 w-14 h-14 bg-slate-800 rounded-full border-4 border-slate-200 shadow-lg"></div>
            <div className="absolute -bottom-6 right-8 w-14 h-14 bg-slate-800 rounded-full border-4 border-slate-200 shadow-lg"></div>
            {/* Scanner line */}
            <motion.div animate={{ x: [-80, 80, -80] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="absolute w-2 h-32 bg-indigo-500 rounded-full blur-[2px] shadow-[0_0_20px_#4f46e5] opacity-60"></motion.div>
          </div>

          {/* Floating UI Nodes */}
          <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-10 left-0 bg-white/90 backdrop-blur-md border border-slate-100 p-3 rounded-2xl shadow-xl flex items-center space-x-3">
            <div className="bg-indigo-50 p-2.5 rounded-xl"><ScanLine className="w-5 h-5 text-indigo-600" /></div>
            <div><p className="text-xs font-bold text-slate-800 leading-tight">Image Analysis</p><p className="text-[10px] text-slate-500 font-medium">Detect damage</p></div>
          </motion.div>

          <motion.div animate={{ y: [5, -5, 5] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute top-4 right-0 bg-white/90 backdrop-blur-md border border-slate-100 p-3 rounded-2xl shadow-xl flex items-center space-x-3">
            <div className="bg-purple-50 p-2.5 rounded-xl"><FileText className="w-5 h-5 text-purple-600" /></div>
            <div><p className="text-xs font-bold text-slate-800 leading-tight">Document Intel</p><p className="text-[10px] text-slate-500 font-medium">Read & extract data</p></div>
          </motion.div>

          <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-16 right-0 bg-white/90 backdrop-blur-md border border-slate-100 p-3 rounded-2xl shadow-xl flex items-center space-x-3">
            <div className="bg-blue-50 p-2.5 rounded-xl"><Mic className="w-5 h-5 text-blue-600" /></div>
            <div><p className="text-xs font-bold text-slate-800 leading-tight">Audio Transcription</p><p className="text-[10px] text-slate-500 font-medium">Convert to text</p></div>
          </motion.div>

          <motion.div animate={{ y: [4, -4, 4] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md border border-slate-100 p-3 rounded-2xl shadow-xl flex items-center space-x-3">
            <div className="bg-cyan-50 p-2.5 rounded-xl"><BrainCircuit className="w-5 h-5 text-cyan-600" /></div>
            <div><p className="text-xs font-bold text-slate-800 leading-tight">AI Reasoning</p><p className="text-[10px] text-slate-500 font-medium">Cross-modal insights</p></div>
          </motion.div>
        </div>
      </div>

      {/* KPI CARDS & STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const isPositive = stat.trend.startsWith('+');
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                key={i} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full"
              >
                <div className="mb-4">
                  <h3 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">{stat.value}</h3>
                  <p className="text-sm font-bold text-slate-500">{stat.label}</p>
                </div>
                <div className="flex items-center">
                  <span className={`text-xs font-bold flex items-center ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {isPositive ? '↑' : '↓'} {stat.trend}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* SYSTEM STATUS CARD */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
          <h3 className="text-sm font-bold text-slate-900 mb-1 relative z-10">OmniSense AI</h3>
          <div className="flex items-center space-x-2 mb-6 relative z-10">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Systems operational</p>
          </div>
          
          <div className="space-y-3 relative z-10">
            <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-600">Vision</span><span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">● Online</span></div>
            <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-600">Documents</span><span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">● Online</span></div>
            <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-600">Audio</span><span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">● Online</span></div>
            <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-600">Reasoning</span><span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">● Online</span></div>
          </div>
        </div>
      </div>

      {/* RECENT ANALYSES */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 lg:p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">Recent Analyses</h2>
          <Link to="/history" className="text-indigo-600 text-sm font-bold hover:text-indigo-700 flex items-center transition-colors">
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="space-y-4">
          {recent.map((item, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all bg-slate-50/50 group cursor-pointer">
              
              <div className="flex items-center space-x-5 mb-4 sm:mb-0">
                <div className="w-16 h-12 bg-slate-200 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                  <Car className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.id}</h4>
                  <p className="text-xs font-medium text-slate-500 mt-1">{item.type}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 sm:space-x-6">
                <div className="flex flex-wrap gap-2">
                  {item.findings.map((finding, idx) => (
                    <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-white border border-slate-200 text-slate-600 shadow-sm">
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${finding.level === 'High' ? 'bg-rose-500' : 'bg-amber-500'}`}></span>
                      {finding.label}
                    </span>
                  ))}
                </div>
                <span className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <CheckCircle className="w-3 h-3 mr-1.5" /> {item.status}
                </span>
                <div className="hidden sm:flex text-slate-400 group-hover:text-indigo-600 font-bold text-xs items-center transition-colors">
                  View <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
