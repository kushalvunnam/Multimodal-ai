import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { CheckCircle, Loader2, Image as ImageIcon, FileText, Mic, Brain, Sparkles, ArrowRight } from 'lucide-react';

function AICore({ active }) {
  const meshRef = useRef();
  useFrame((state) => {
    meshRef.current.rotation.x = state.clock.getElapsedTime() * (active ? 0.8 : 0.2);
    meshRef.current.rotation.y = state.clock.getElapsedTime() * (active ? 1.2 : 0.3);
  });
  return (
    <Float speed={active ? 6 : 2} rotationIntensity={active ? 4 : 1} floatIntensity={active ? 3 : 1}>
      <Sphere args={[1, 64, 64]} ref={meshRef} scale={1.8}>
        <MeshDistortMaterial color="#4F46E5" emissive="#c084fc" emissiveIntensity={active ? 0.6 : 0.1} distort={active ? 0.6 : 0.3} speed={active ? 5 : 2} roughness={0.1} metalness={0.9} clearcoat={1} />
      </Sphere>
    </Float>
  );
}

export default function AnalysisWorkspace() {
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(0);
  
  const leftStages = [
    { name: "Image Understanding", icon: ImageIcon, color: "text-blue-500", bg: "bg-blue-50" },
    { name: "Document Intelligence", icon: FileText, color: "text-emerald-500", bg: "bg-emerald-50" },
    { name: "Voice Intelligence", icon: Mic, color: "text-amber-500", bg: "bg-amber-50" }
  ];

  const rightStages = [
    { name: "Cross-Modal Correlation", icon: Brain, color: "text-purple-500", bg: "bg-purple-50" },
    { name: "AI Reasoning", icon: Sparkles, color: "text-indigo-500", bg: "bg-indigo-50" },
    { name: "Actionable Intelligence", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" }
  ];

  useEffect(() => {
    if (currentStage < leftStages.length + rightStages.length + 1) {
      const timer = setTimeout(() => {
        setCurrentStage(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => navigate('/analysis/demo-123/results'), 1000);
    }
  }, [currentStage, navigate]);

  const isCoreActive = currentStage >= leftStages.length && currentStage < leftStages.length + rightStages.length;

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center max-w-7xl mx-auto py-10 relative">
      
      <div className="text-center mb-16 relative z-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">OmniSense Processing Pipeline</h1>
        <p className="text-slate-500 font-medium text-lg">Synthesizing multiple modalities into one intelligent decision.</p>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10 items-center">
        
        {/* Left: Modality Understanding */}
        <div className="space-y-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest text-center mb-8">Data Ingestion & Understanding</h3>
          {leftStages.map((stage, i) => {
            const Icon = stage.icon;
            const isProcessing = currentStage === i;
            const isDone = currentStage > i;
            return (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={i} 
                className={`relative flex items-center p-5 rounded-2xl bg-white border ${
                  isProcessing ? 'border-indigo-200 shadow-[0_8px_30px_rgba(79,70,229,0.15)] scale-105 z-10' : 
                  isDone ? 'border-slate-100 shadow-sm opacity-100' : 'border-slate-100 opacity-40'
                } transition-all duration-300`}
              >
                {/* Connecting SVG line to center */}
                {isDone && (
                  <svg className="absolute -right-20 top-1/2 w-20 h-0.5 overflow-visible -z-10" viewBox="0 0 100 2" preserveAspectRatio="none">
                     <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} x1="0" y1="1" x2="100" y2="1" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4,4" />
                     <motion.circle initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0], cx: [0, 100] }} transition={{ duration: 1.5, repeat: Infinity }} cy="1" r="3" fill="#6366f1" />
                  </svg>
                )}

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 shadow-inner ${
                  isDone ? 'bg-slate-50 text-emerald-500' : 
                  isProcessing ? `${stage.bg} ${stage.color}` : 'bg-slate-50 text-slate-300'
                }`}>
                  {isDone ? <CheckCircle className="w-6 h-6" /> : 
                   isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : 
                   <Icon className="w-6 h-6" />}
                </div>
                <div>
                  <div className={`text-sm font-bold ${
                    isProcessing ? 'text-indigo-600' : isDone ? 'text-slate-800' : 'text-slate-400'
                  }`}>
                    {stage.name}
                  </div>
                  <div className="text-xs font-medium text-slate-400 mt-0.5">
                    {isDone ? 'Completed' : isProcessing ? 'Analyzing...' : 'Pending'}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Center: 3D AI Core */}
        <div className="h-[400px] relative flex flex-col items-center justify-center">
          <div className="absolute inset-0 pointer-events-none -z-10">
            <Canvas camera={{ position: [0, 0, 5] }}>
               <ambientLight intensity={1.5} />
               <directionalLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
               <AICore active={isCoreActive} />
            </Canvas>
          </div>
          <motion.div 
            animate={{ scale: isCoreActive ? [1, 1.05, 1] : 1, opacity: isCoreActive ? 1 : 0.5 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -bottom-8 px-6 py-2 rounded-full bg-white border border-slate-100 shadow-lg text-sm font-bold text-indigo-600 flex items-center gap-2"
          >
            <Brain className="w-4 h-4" /> 
            {isCoreActive ? 'Cross-Modal Core Active' : 'Waiting for inputs...'}
          </motion.div>
        </div>

        {/* Right: Reasoning & Insights */}
        <div className="space-y-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest text-center mb-8">Synthesis & Output</h3>
          {rightStages.map((stage, i) => {
            const actualIndex = i + leftStages.length;
            const Icon = stage.icon;
            const isProcessing = currentStage === actualIndex;
            const isDone = currentStage > actualIndex;
            return (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                key={i} 
                className={`relative flex items-center p-5 rounded-2xl bg-white border ${
                  isProcessing ? 'border-indigo-200 shadow-[0_8px_30px_rgba(79,70,229,0.15)] scale-105 z-10' : 
                  isDone ? 'border-slate-100 shadow-sm opacity-100' : 'border-slate-100 opacity-40'
                } transition-all duration-300`}
              >
                {/* Connecting SVG line from center */}
                {(isDone || isProcessing) && (
                  <svg className="absolute -left-20 top-1/2 w-20 h-0.5 overflow-visible -z-10" viewBox="0 0 100 2" preserveAspectRatio="none">
                     <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} x1="0" y1="1" x2="100" y2="1" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4,4" />
                     {isProcessing && <motion.circle initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0], cx: [0, 100] }} transition={{ duration: 1.5, repeat: Infinity }} cy="1" r="3" fill="#6366f1" />}
                  </svg>
                )}

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 shadow-inner ${
                  isDone ? 'bg-emerald-50 text-emerald-500' : 
                  isProcessing ? `${stage.bg} ${stage.color}` : 'bg-slate-50 text-slate-300'
                }`}>
                  {isDone ? <CheckCircle className="w-6 h-6" /> : 
                   isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : 
                   <Icon className="w-6 h-6" />}
                </div>
                <div>
                  <div className={`text-sm font-bold ${
                    isProcessing ? 'text-indigo-600' : isDone ? 'text-slate-800' : 'text-slate-400'
                  }`}>
                    {stage.name}
                  </div>
                  <div className="text-xs font-medium text-slate-400 mt-0.5">
                    {isDone ? 'Completed' : isProcessing ? 'Synthesizing...' : 'Pending'}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
