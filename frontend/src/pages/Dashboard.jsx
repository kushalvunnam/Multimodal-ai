import { Link } from 'react-router-dom';
import { Activity, FileText, Image as ImageIcon, Mic, AlertTriangle, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';

function TinyAICore() {
  return (
    <Float speed={3} rotationIntensity={2} floatIntensity={2}>
      <Sphere args={[1, 32, 32]}>
        <MeshDistortMaterial color="#4F46E5" distort={0.3} speed={2} roughness={0.1} metalness={0.8} clearcoat={1} />
      </Sphere>
    </Float>
  );
}

export default function Dashboard() {
  const stats = [
    { label: 'Total Analyses', value: '1,248', icon: Activity, color: 'text-primary', bg: 'bg-primary/10', trend: '+12%' },
    { label: 'Images Processed', value: '4,892', icon: ImageIcon, color: 'text-blue-500', bg: 'bg-blue-100', trend: '+8%' },
    { label: 'Documents Extracted', value: '2,104', icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-100', trend: '+24%' },
    { label: 'Issues Detected', value: '156', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-100', trend: '-2%' },
  ];

  const recent = [
    { id: 'CLM-1048', type: 'Vehicle Damage Claim', status: 'Completed', risk: 'Medium', inputs: '3 Images, 2 Docs, 1 Voice', time: '2 mins ago' },
    { id: 'INS-9921', type: 'Property Inspection', status: 'Processing', risk: 'Unknown', inputs: '12 Images, 1 Doc', time: '5 mins ago' },
    { id: 'DOC-4412', type: 'Contract Review', status: 'Completed', risk: 'Low', inputs: '1 Doc (45 pages)', time: '1 hour ago' },
  ];

  return (
    <div className="space-y-8 relative">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-text-main mb-1">Good morning, Kushal</h1>
          <p className="text-text-muted text-base font-medium">Here's your AI analysis overview.</p>
        </div>
        <Link to="/analysis/new" className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-full font-bold transition-all shadow-[0_4px_15px_rgba(79,70,229,0.3)] hover:shadow-[0_8px_25px_rgba(79,70,229,0.4)] flex items-center hover:-translate-y-0.5">
          <Activity className="w-4 h-4 mr-2" /> New Analysis
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          const isPositive = stat.trend.startsWith('+');
          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-text-muted text-sm font-semibold mb-1">{stat.label}</p>
              <h3 className="text-3xl font-extrabold text-text-main">{stat.value}</h3>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-bold text-text-main">Recent Analyses</h2>
            <button className="text-primary text-sm font-bold hover:text-primary-hover flex items-center">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-white">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID / Type</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Inputs</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 bg-white">
                {recent.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="font-bold text-text-main group-hover:text-primary transition-colors">{item.id}</div>
                      <div className="text-gray-500 text-xs font-medium mt-1">{item.type}</div>
                    </td>
                    <td className="px-6 py-4">
                      {item.status === 'Completed' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <CheckCircle className="w-3 h-3 mr-1.5" /> Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
                          <Clock className="w-3 h-3 mr-1.5" /> Processing
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium text-sm">{item.inputs}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                        item.risk === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                        item.risk === 'Low' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {item.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-b from-primary/5 to-accent/5 border border-primary/10 rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-10 -top-10 w-40 h-40 opacity-50 pointer-events-none">
            <Canvas>
              <ambientLight intensity={1} />
              <directionalLight position={[2, 2, 2]} />
              <TinyAICore />
            </Canvas>
          </div>
          
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-text-main mb-2">OmniSense Assistant</h3>
            <p className="text-sm text-text-muted font-medium mb-6">Your AI is running perfectly. Cross-modal accuracy is up 4% this week.</p>
            
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 text-sm font-medium text-gray-700">
                <span className="text-primary font-bold">Tip:</span> Upload both voice and images for 30% faster claim resolution.
              </div>
            </div>
          </div>
          
          <button className="w-full mt-6 bg-white border border-gray-200 hover:border-primary text-text-main font-bold py-2.5 rounded-xl transition-colors shadow-sm">
            Ask Assistant
          </button>
        </div>
      </div>
    </div>
  );
}
