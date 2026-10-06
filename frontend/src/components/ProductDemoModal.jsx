import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, CheckCircle, Image as ImageIcon, FileText, Mic, BrainCircuit, Car, AlertTriangle, ChevronRight, Activity, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STEPS = [
  { id: 1, title: 'MULTIMODAL INPUT', desc: 'Collecting multimodal evidence...' },
  { id: 2, title: 'AI VISION', desc: 'AI Vision is inspecting the visual evidence...' },
  { id: 3, title: 'CROSS-MODAL REASONING', desc: 'Cross-modal intelligence is connecting evidence...' },
  { id: 4, title: 'DAMAGE DETECTION', desc: 'Relevant findings extracted from the evidence.' },
  { id: 5, title: 'ACTIONABLE REPORT', desc: 'Final unified intelligence report.' }
];

export default function ProductDemoModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setIsPaused(false);
      return;
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);

    let timer;
    if (!isPaused && currentStep < 5) {
      timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 3500);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, currentStep, isPaused]);

  if (!isOpen) return null;

  const handleNext = () => currentStep < 5 && setCurrentStep(prev => prev + 1);
  const handlePrev = () => currentStep > 1 && setCurrentStep(prev => prev - 1);
  
  const handleStartAnalysis = () => {
    onClose();
    navigate('/analysis/new');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-8">
      {/* Click outside to close (optional, but good UX) */}
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative w-full max-w-5xl bg-[#F7F7FF] rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-white/50 h-[85vh] max-h-[800px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-indigo-100/50 bg-white/50 backdrop-blur-md z-20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow shadow-indigo-500/30 flex items-center justify-center text-white font-black text-lg">O</div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900">OMNISENSE</h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">See Beyond the Surface.</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden sm:flex space-x-1.5">
              {[1, 2, 3, 4, 5].map(step => (
                <div key={step} className={`h-1.5 rounded-full transition-all duration-500 ${step === currentStep ? 'w-8 bg-indigo-600' : step < currentStep ? 'w-4 bg-indigo-300' : 'w-4 bg-slate-200'}`} />
              ))}
            </div>
            <span className="text-sm font-bold text-slate-500 tabular-nums bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">0{currentStep} / 05</span>
            <button onClick={onClose} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shadow-sm border border-slate-100 focus:outline-none">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 relative overflow-hidden bg-gradient-to-b from-white to-[#F7F7FF]">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8"
            >
              <div className="mb-8 text-center">
                <h3 className="text-sm font-black tracking-widest text-indigo-500 mb-2">{STEPS[currentStep - 1].title}</h3>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">{STEPS[currentStep - 1].desc}</p>
              </div>

              <div className="w-full max-w-3xl flex-1 relative flex items-center justify-center mt-4">
                
                {/* STEP 1: Multimodal Input */}
                {currentStep === 1 && (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="absolute w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl animate-pulse"></div>
                    <div className="w-32 h-32 bg-white rounded-full shadow-2xl border-4 border-indigo-50 flex items-center justify-center z-10 relative">
                      <BrainCircuit className="w-12 h-12 text-indigo-600" />
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute inset-[-10px] rounded-full border-2 border-dashed border-indigo-200"></motion.div>
                    </div>
                    <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: -40, opacity: 1 }} transition={{ delay: 0.2 }} className="absolute left-[10%] top-[20%] bg-white p-4 rounded-2xl shadow-xl flex items-center space-x-3 border border-slate-100 rotate-[-5deg]">
                      <div className="bg-blue-50 p-3 rounded-xl"><ImageIcon className="w-6 h-6 text-blue-500" /></div>
                      <div><p className="font-bold text-slate-800 text-sm">Vehicle Image</p><p className="text-xs text-slate-400">visual_ev.jpg</p></div>
                    </motion.div>
                    <motion.div initial={{ y: -100, opacity: 0 }} animate={{ y: -40, opacity: 1 }} transition={{ delay: 0.4 }} className="absolute right-[15%] top-[10%] bg-white p-4 rounded-2xl shadow-xl flex items-center space-x-3 border border-slate-100 rotate-[5deg]">
                      <div className="bg-purple-50 p-3 rounded-xl"><FileText className="w-6 h-6 text-purple-500" /></div>
                      <div><p className="font-bold text-slate-800 text-sm">PDF Document</p><p className="text-xs text-slate-400">claim_form.pdf</p></div>
                    </motion.div>
                    <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 40, opacity: 1 }} transition={{ delay: 0.6 }} className="absolute bottom-[10%] bg-white p-4 rounded-2xl shadow-xl flex items-center space-x-3 border border-slate-100">
                      <div className="bg-emerald-50 p-3 rounded-xl"><Mic className="w-6 h-6 text-emerald-500" /></div>
                      <div><p className="font-bold text-slate-800 text-sm">Audio Voice</p><p className="text-xs text-slate-400">statement.wav</p></div>
                    </motion.div>
                  </div>
                )}

                {/* STEP 2: AI Vision */}
                {currentStep === 2 && (
                  <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl border border-slate-100 p-8 flex flex-col md:flex-row gap-8 items-center">
                    <div className="relative w-64 h-48 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-200 shadow-inner flex items-center justify-center">
                      <Car className="w-24 h-24 text-slate-300" />
                      {/* Scanning Line */}
                      <motion.div animate={{ y: [-10, 200] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)] z-10" />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-500/10 pointer-events-none"></div>
                    </div>
                    <div className="flex-1 space-y-4 w-full">
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                        <span className="font-bold text-slate-700 text-sm">Image received</span>
                      </motion.div>
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }} className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                        <span className="font-bold text-slate-700 text-sm">Vehicle detected</span>
                      </motion.div>
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.3 }} className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                        <span className="font-bold text-slate-700 text-sm">Damage regions identified</span>
                      </motion.div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Cross-Modal Reasoning */}
                {currentStep === 3 && (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 800 400">
                      <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }} d="M 200 100 L 400 200 M 200 300 L 400 200 M 600 200 L 400 200" stroke="#818cf8" strokeWidth="3" strokeDasharray="6 6" fill="none" />
                    </svg>
                    
                    <div className="absolute left-[15%] top-[20%] bg-white p-5 rounded-2xl shadow-xl border border-indigo-100 z-10">
                      <div className="font-bold text-slate-800 flex items-center"><ImageIcon className="w-4 h-4 mr-2 text-indigo-500" /> Vehicle Image</div>
                    </div>
                    <div className="absolute left-[15%] bottom-[20%] bg-white p-5 rounded-2xl shadow-xl border border-indigo-100 z-10">
                      <div className="font-bold text-slate-800 flex items-center"><FileText className="w-4 h-4 mr-2 text-purple-500" /> Inspection Report</div>
                    </div>
                    <div className="absolute right-[15%] top-[35%] bg-white p-5 rounded-2xl shadow-xl border border-indigo-100 z-10">
                      <div className="font-bold text-slate-800 flex items-center"><Mic className="w-4 h-4 mr-2 text-emerald-500" /> Customer Statement</div>
                    </div>

                    <div className="relative z-20 bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-3xl shadow-2xl text-white text-center border-4 border-white">
                      <BrainCircuit className="w-10 h-10 mx-auto mb-2 text-indigo-200" />
                      <h4 className="font-black text-lg tracking-wide">AI REASONING</h4>
                      <p className="text-xs text-indigo-200 font-medium">Synthesizing data</p>
                    </div>
                  </div>
                )}

                {/* STEP 4: Damage Detection */}
                {currentStep === 4 && (
                  <div className="relative w-full max-w-3xl flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/2 relative bg-slate-100 rounded-[32px] overflow-hidden border border-slate-200 shadow-inner flex items-center justify-center p-8">
                      <Car className="w-32 h-32 text-slate-300" />
                      {/* Highlight Box */}
                      <motion.div initial={{ opacity: 0, scale: 1.2 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="absolute top-[30%] left-[20%] w-32 h-24 bg-rose-500/20 border-2 border-rose-500 rounded-xl shadow-[0_0_20px_rgba(244,63,94,0.3)] flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-rose-600 animate-pulse" />
                      </motion.div>
                    </div>
                    <div className="w-full md:w-1/2 space-y-4">
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-white p-5 rounded-2xl shadow-lg border-l-4 border-rose-500 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3"><div className="bg-rose-50 text-rose-600 font-black text-[10px] px-2 py-1 rounded-md uppercase tracking-widest">High Severity</div></div>
                        <h4 className="font-extrabold text-slate-900 text-lg mb-1">Front Bumper</h4>
                        <div className="flex items-center space-x-4 mt-3">
                          <div className="flex items-center text-xs font-bold text-slate-500"><Activity className="w-3.5 h-3.5 mr-1" /> Confidence: <span className="text-slate-800 ml-1">94%</span></div>
                        </div>
                      </motion.div>
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">Headlight Assembly</h4>
                          <p className="text-[10px] font-bold text-amber-500 uppercase mt-0.5">Medium Severity</p>
                        </div>
                      </motion.div>
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">Panel Deformation</h4>
                          <p className="text-[10px] font-bold text-amber-500 uppercase mt-0.5">Medium Severity</p>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                )}

                {/* STEP 5: Actionable Report */}
                {currentStep === 5 && (
                  <div className="w-full max-w-2xl bg-white rounded-[32px] shadow-2xl border border-slate-100 p-8 flex flex-col items-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                      <CheckCircle className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full mb-8">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">AI Confidence</p>
                        <p className="text-3xl font-black text-emerald-600">94%</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Damage Detected</p>
                        <p className="text-3xl font-black text-rose-600">3</p>
                      </div>
                    </div>
                    <div className="w-full bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-8">
                      <h4 className="font-bold text-slate-800 text-sm mb-3 uppercase tracking-wider">Recommended Actions</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center text-sm font-medium text-slate-600"><CheckCircle className="w-4 h-4 mr-2 text-emerald-500 shrink-0" /> Inspect bumper assembly</li>
                        <li className="flex items-center text-sm font-medium text-slate-600"><CheckCircle className="w-4 h-4 mr-2 text-emerald-500 shrink-0" /> Check headlight alignment</li>
                        <li className="flex items-center text-sm font-medium text-slate-600"><CheckCircle className="w-4 h-4 mr-2 text-emerald-500 shrink-0" /> Repair affected area</li>
                      </ul>
                    </div>
                    
                    <button onClick={handleStartAnalysis} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold transition-all shadow-[0_8px_25px_rgba(79,70,229,0.3)] hover:-translate-y-1 flex justify-center items-center text-lg">
                      Start Your Analysis <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Controls */}
        <div className="flex items-center justify-between px-8 py-5 border-t border-slate-100 bg-white z-20">
          <button 
            onClick={handlePrev} 
            disabled={currentStep === 1}
            className={`flex items-center font-bold px-4 py-2 rounded-xl transition-colors ${currentStep === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Previous
          </button>
          
          <button onClick={onClose} className="text-sm font-bold text-slate-400 hover:text-slate-700 transition-colors hidden sm:block">
            Skip Demo
          </button>
          
          <button 
            onClick={currentStep === 5 ? handleStartAnalysis : handleNext} 
            className="flex items-center bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-md"
          >
            {currentStep === 5 ? 'Start' : 'Next'} {currentStep < 5 && <ArrowRight className="w-4 h-4 ml-2" />}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
