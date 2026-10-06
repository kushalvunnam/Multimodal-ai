import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { CheckCircle, Loader2, Image as ImageIcon, FileText, Mic, Brain, Sparkles } from 'lucide-react';
import { processAnalysis, getAnalysisStatus, getAnalysis } from '../services/api';

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
  const { id } = useParams();
  const [status, setStatus] = useState('starting');
  const [steps, setSteps] = useState([]);
  
  
  useEffect(() => {
    let intervalId;
    let mounted = true;
    let isProcessingStarted = false;

    const startProcessing = async () => {
      if (!id) return;
      try {
        // Fetch current analysis
        
        const res = await getAnalysis(id);
        
        if (!mounted) return;

        if (res.success && res.data) {
          const currentStatus = res.data.status;
          setStatus(currentStatus);
          if (res.data.processingStatus && res.data.processingStatus.steps) {
            setSteps(res.data.processingStatus.steps);
          }

          if (currentStatus === 'processed') {
            navigate(`/analysis/${id}/results`);
            return;
          }

          if (currentStatus === 'draft' || currentStatus === 'ready_for_processing') {
            // Only call process if not already processing
            await processAnalysis(id);
            isProcessingStarted = true;
          }
        }

        intervalId = setInterval(async () => {
          if (!mounted) return;
          try {
            const statusRes = await getAnalysisStatus(id);
            if (statusRes.success) {
              setStatus(statusRes.data.status);
              setSteps(statusRes.data.steps || []);
              if (statusRes.data.status === 'processed' || statusRes.data.status === 'failed') {
                clearInterval(intervalId);
                if (statusRes.data.status === 'processed') {
                  setTimeout(() => navigate(`/analysis/${id}/results`), 1000);
                }
              }
            }
          } catch (err) {
            console.error(err);
          }
        }, 1500);

      } catch (error) {
        console.error('Error starting workspace:', error);
      }
    };
    startProcessing();

    return () => {
      mounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [id, navigate]);


  const isCoreActive = status === 'processing';
  const getStepStatus = (name) => { const step = steps.find(s => s.name === name); return step ? step.status : 'pending'; };

  const renderStage = (name, icon, bg, color) => {
    if (!steps.some(s => s.name === name)) return null;
    const stepStatus = getStepStatus(name);
    const isProcessing = stepStatus === 'processing';
    const isDone = stepStatus === 'completed';
    const Icon = icon;

    return (
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} key={name}
        className={`relative flex items-center p-5 rounded-2xl bg-white border ${
          isProcessing ? 'border-indigo-200 shadow-[0_8px_30px_rgba(79,70,229,0.15)] scale-105 z-10' : 
          isDone ? 'border-slate-100 shadow-sm opacity-100' : 'border-slate-100 opacity-40'
        } transition-all duration-300`}
      >
        {isDone && (
          <svg className="absolute -right-20 top-1/2 w-20 h-0.5 overflow-visible -z-10" viewBox="0 0 100 2" preserveAspectRatio="none">
             <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} x1="0" y1="1" x2="100" y2="1" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4,4" />
             <motion.circle initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0], cx: [0, 100] }} transition={{ duration: 1.5, repeat: Infinity }} cy="1" r="3" fill="#6366f1" />
          </svg>
        )}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 shadow-inner ${
          isDone ? 'bg-slate-50 text-emerald-500' : isProcessing ? `${bg} ${color}` : 'bg-slate-50 text-slate-300'
        }`}>
          {isDone ? <CheckCircle className="w-6 h-6" /> : isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Icon className="w-6 h-6" />}
        </div>
        <div>
          <div className={`text-sm font-bold ${isProcessing ? 'text-indigo-600' : isDone ? 'text-slate-800' : 'text-slate-400'}`}>{name}</div>
          <div className="text-xs font-medium text-slate-400 mt-0.5">{isDone ? 'Completed' : isProcessing ? 'Analyzing...' : 'Pending'}</div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center max-w-7xl mx-auto py-10 relative">
      <div className="text-center mb-16 relative z-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">OmniSense AI Engine</h1>
        <p className="text-slate-500 font-medium text-lg">{status === 'failed' ? 'Processing failed.' : 'Running Cross-Modal Reasoning...'}</p>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10 items-center">
        <div className="space-y-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest text-center mb-8">Data Extraction</h3>
          {renderStage("Image Understanding", ImageIcon, "bg-blue-50", "text-blue-500")}
          {renderStage("Document Intelligence", FileText, "bg-emerald-50", "text-emerald-500")}
          {renderStage("Voice Intelligence", Mic, "bg-amber-50", "text-amber-500")}
          {renderStage("Text Understanding", FileText, "bg-purple-50", "text-purple-500")}
        </div>

        <div className="h-[400px] relative flex flex-col items-center justify-center">
          <div className="absolute inset-0 pointer-events-none -z-10">
            <Canvas camera={{ position: [0, 0, 5] }}><ambientLight intensity={1.5} /><directionalLight position={[10, 10, 10]} intensity={2} color="#ffffff" /><AICore active={isCoreActive} /></Canvas>
          </div>
          <motion.div animate={{ scale: isCoreActive ? [1, 1.05, 1] : 1, opacity: isCoreActive ? 1 : 0.5 }} transition={{ duration: 2, repeat: Infinity }}
            className="absolute -bottom-8 px-6 py-2 rounded-full bg-white border border-slate-100 shadow-lg text-sm font-bold text-indigo-600 flex items-center gap-2"
          >
            <Brain className="w-4 h-4" /> 
            {isCoreActive ? 'Cross-Modal Engine Active...' : status === 'processed' ? 'Reasoning Complete' : 'Initializing AI...'}
          </motion.div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest text-center mb-8">Synthesis</h3>
          {renderStage("Cross-Modal Reasoning", Sparkles, "bg-indigo-50", "text-indigo-600")}
          
          <motion.div className={`relative flex items-center p-5 rounded-2xl bg-white border ${
              status === 'processed' ? 'border-emerald-200 shadow-sm opacity-100' : 'border-slate-100 opacity-40'
            } transition-all duration-300`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 shadow-inner ${
              status === 'processed' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-300'
            }`}>
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <div className={`text-sm font-bold ${status === 'processed' ? 'text-slate-800' : 'text-slate-400'}`}>Intelligence Report</div>
              <div className="text-xs font-medium text-slate-400 mt-0.5">{status === 'processed' ? 'Generated' : 'Pending'}</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
