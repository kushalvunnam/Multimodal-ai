import { Download, Copy, Share2, AlertTriangle, CheckCircle, ShieldAlert, Zap, Target, Image as ImageIcon, FileText, Mic, Send, Sparkles, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';

function TinyAICore() {
  return (
    <Float speed={3} rotationIntensity={2} floatIntensity={2}>
      <Sphere args={[1.5, 32, 32]}>
        <MeshDistortMaterial color="#4F46E5" emissive="#c084fc" emissiveIntensity={0.2} distort={0.2} speed={2} roughness={0.1} metalness={0.9} clearcoat={1} />
      </Sphere>
    </Float>
  );
}

export default function Results() {
  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center">
              <Sparkles className="w-8 h-8 mr-3 text-indigo-600" /> Multimodal Report
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm flex items-center">
              <CheckCircle className="w-3 h-3 mr-1.5" /> Intelligence Generated
            </span>
          </div>
          <p className="text-slate-500 font-medium text-lg">Vehicle Damage Claim #CLM-1048</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white hover:bg-slate-50 border border-slate-200 px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm flex items-center text-slate-700 hover:shadow-md">
            <Copy className="w-4 h-4 mr-2" /> Copy Summary
          </button>
          <button className="bg-white hover:bg-slate-50 border border-slate-200 px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm flex items-center text-slate-700 hover:shadow-md">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center shadow-[0_4px_15px_rgba(79,70,229,0.3)] hover:-translate-y-0.5">
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </button>
        </div>
      </div>

      {/* CROSS-MODAL HERO SECTION */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 pointer-events-none"></div>
        
        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg mb-4">
            <Zap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Cross-Modal Reasoning</h2>
          <p className="text-slate-500 font-medium">OmniSense AI correlated information across 3 different modalities to reach its conclusion.</p>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
          
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div whileHover={{ y: -5 }} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm text-center relative z-20">
              <div className="w-12 h-12 mx-auto bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-4 shadow-inner">
                <ImageIcon className="w-6 h-6"/>
              </div>
              <h4 className="text-xs font-black tracking-widest text-slate-400 mb-3">IMAGE FINDING</h4>
              <p className="text-sm font-bold text-slate-800">Front bumper indentation and blue paint transfer detected.</p>
            </motion.div>
            
            <motion.div whileHover={{ y: -5 }} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm text-center relative z-20">
              <div className="w-12 h-12 mx-auto bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center mb-4 shadow-inner">
                <FileText className="w-6 h-6"/>
              </div>
              <h4 className="text-xs font-black tracking-widest text-slate-400 mb-3">DOCUMENT FINDING</h4>
              <p className="text-sm font-bold text-slate-800">Police report notes "struck blue sedan head-on at low speed".</p>
            </motion.div>
            
            <motion.div whileHover={{ y: -5 }} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm text-center relative z-20">
              <div className="w-12 h-12 mx-auto bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center mb-4 shadow-inner">
                <Mic className="w-6 h-6"/>
              </div>
              <h4 className="text-xs font-black tracking-widest text-slate-400 mb-3">VOICE FINDING</h4>
              <p className="text-sm font-bold text-slate-800">"I bumped into a parked blue car in the lot."</p>
            </motion.div>
          </div>

          {/* Animated Connecting Arrows */}
          <div className="h-20 w-full flex justify-center items-center relative my-4">
            <svg className="absolute w-full h-full" preserveAspectRatio="none">
              <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }} d="M 16.6% 0 Q 50% 40 50% 100" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="6,6" />
              <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.2 }} d="M 50% 0 L 50% 100" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="6,6" />
              <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.4 }} d="M 83.3% 0 Q 50% 40 50% 100" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="6,6" />
            </svg>
            <div className="bg-white p-2 rounded-full border border-slate-100 shadow-sm z-10 text-indigo-400">
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </div>
          </div>

          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            transition={{ delay: 1 }}
            className="w-full bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-8 shadow-sm text-center"
          >
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-indigo-600 mr-2" />
              <h4 className="text-sm font-black tracking-widest text-indigo-600">AI CORRELATION & CONCLUSION</h4>
            </div>
            <p className="text-lg font-bold text-slate-800 leading-relaxed">
              High consistency across all modalities. The visual evidence of blue paint transfer perfectly correlates with both the customer's voice statement and the official police document regarding the involved vehicle.
            </p>
          </motion.div>

        </div>
      </div>

      {/* Grid sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Col: Confidence & Inputs */}
        <div className="space-y-8">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm text-center">
            <h3 className="text-xs font-black text-slate-400 mb-6 tracking-widest">OVERALL AI CONFIDENCE</h3>
            <div className="relative w-40 h-40 mx-auto">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                <path className="text-indigo-600" strokeDasharray="92, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-4xl font-black text-slate-900">92<span className="text-2xl text-slate-500">%</span></span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 mb-5 tracking-widest">INPUT SOURCES</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><ImageIcon className="w-4 h-4" /></div>
                <span className="font-bold text-sm text-slate-700">2 Images analyzed</span>
              </div>
              <div className="flex items-center space-x-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><FileText className="w-4 h-4" /></div>
                <span className="font-bold text-sm text-slate-700">1 Document parsed</span>
              </div>
              <div className="flex items-center space-x-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Mic className="w-4 h-4" /></div>
                <span className="font-bold text-sm text-slate-700">1 Audio transcribed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Details */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
            <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex items-center">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mr-3">
                <Target className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-lg text-slate-900">Executive Summary</h2>
            </div>
            <div className="p-8 text-slate-600 text-base leading-relaxed font-medium">
              Based on the cross-modal analysis, this claim involves a low-speed frontal collision resulting in moderate damage to the front bumper and minor scratching on the driver-side panel. All data sources confirm the date, the damage type, and the involved vehicles. Claim is ready for expedited processing.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
              <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center">
                <ShieldAlert className="w-5 h-5 text-amber-500 mr-2" />
                <h2 className="font-bold text-slate-900">Anomalies & Flags</h2>
              </div>
              <div className="p-6">
                <div className="flex items-start space-x-4 bg-amber-50 border border-amber-100 rounded-2xl p-5">
                  <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">Time Discrepancy</h4>
                    <p className="text-sm text-slate-600 font-medium">Audio mentions "morning", document says 2:00 PM.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
              <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center">
                <CheckCircle className="w-5 h-5 text-indigo-600 mr-2" />
                <h2 className="font-bold text-slate-900">Next Actions</h2>
              </div>
              <div className="p-6 space-y-3">
                <button className="w-full text-left bg-white hover:bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl transition-colors text-slate-700 font-bold flex justify-between items-center shadow-sm">
                  Verify time with customer <ArrowRightIcon />
                </button>
                <button className="w-full text-left bg-white hover:bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl transition-colors text-slate-700 font-bold flex justify-between items-center shadow-sm">
                  Approve for payout <ArrowRightIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating AI Chat Assistant */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-8 right-8 w-96 bg-white/95 backdrop-blur-2xl rounded-3xl overflow-hidden flex flex-col z-50 shadow-[0_20px_50px_rgba(79,70,229,0.15)] border border-slate-100"
      >
        <div className="bg-white/80 px-6 py-5 border-b border-slate-100 flex justify-between items-center relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 pointer-events-none">
            <Canvas><ambientLight intensity={1.5}/><directionalLight position={[2, 2, 2]} intensity={2}/><TinyAICore /></Canvas>
          </div>
          <div className="relative z-10">
            <div className="font-bold text-slate-900 text-sm flex items-center mb-0.5">
              <Sparkles className="w-4 h-4 mr-2 text-indigo-600" /> Ask OmniSense
            </div>
            <div className="text-xs font-medium text-slate-400">Ask questions about this analysis.</div>
          </div>
        </div>
        
        <div className="h-72 p-6 overflow-y-auto bg-slate-50/50 text-sm flex flex-col space-y-4">
          <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none self-start text-slate-700 font-medium shadow-sm max-w-[85%]">
            I've analyzed this claim. Try asking:
            <ul className="mt-3 space-y-2 text-xs">
              <li className="text-indigo-600 cursor-pointer hover:underline">What damage was detected?</li>
              <li className="text-indigo-600 cursor-pointer hover:underline">Why was this flagged?</li>
              <li className="text-indigo-600 cursor-pointer hover:underline">Compare the voice with the document.</li>
            </ul>
          </div>
        </div>
        <div className="p-4 bg-white border-t border-slate-100 relative">
          <input 
            type="text" 
            placeholder="Ask OmniSense..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-full pl-5 pr-12 py-3.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all shadow-inner"
          />
          <button className="absolute right-6 top-1/2 -translate-y-1/2 text-indigo-600 hover:text-indigo-800 p-2 bg-white rounded-full shadow-sm border border-slate-100 transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ArrowRightIcon() {
  return <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;
}
