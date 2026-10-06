import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, Image as ImageIcon, Mic, X, Play, AlignLeft, Sparkles, Loader2, AlertTriangle, CheckCircle, Box, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createAnalysis, uploadFile, removeInput, updateContext, updateAnalysisStatus } from '../services/api';

const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024; const dm = decimals < 0 ? 0 : decimals; const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
const getModality = (mimeType) => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.includes('pdf') || mimeType.includes('document')) return 'document';
  return 'unknown';
};

const cards = [
  { icon: ImageIcon, title: "Image Analysis", desc: "Damage, models, layout", type: "VISION", color: "blue" },
  { icon: File, title: "Document Intelligence", desc: "Claims, reports, PDFs", type: "TEXT", color: "emerald" },
  { icon: Mic, title: "Voice Transcription", desc: "Interviews, statements", type: "AUDIO", color: "amber" },
  { icon: Sparkles, title: "Cross-Modal Logic", desc: "Synthesis & contradictions", type: "REASONING", color: "purple" }
];

export default function NewAnalysis() {
  const navigate = useNavigate();
  const [analysisId, setAnalysisId] = useState(null);
  const [files, setFiles] = useState([]);
  const [textContext, setTextContext] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await createAnalysis();
        if (res.success) setAnalysisId(res.data._id);
      } catch (err) {
        setErrorMsg("Could not connect to backend server.");
      }
    };
    init();
  }, []);

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    setErrorMsg(null);
    if (!analysisId) return setErrorMsg("Analysis session not initialized.");

    if (rejectedFiles.length > 0) {
      const err = rejectedFiles[0].errors[0];
      if (err.code === "file-too-large") setErrorMsg(`File too large. Max allowed is 25MB.`);
      else setErrorMsg("Unsupported file type.");
    }

    for (const file of acceptedFiles) {
      const tempId = Math.random().toString(36).substring(7);
      const newFileState = { id: tempId, name: file.name, size: formatBytes(file.size), type: getModality(file.type), status: 'uploading', progress: 0 };
      setFiles(prev => [...prev, newFileState]);

      try {
        const res = await uploadFile(analysisId, file, (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setFiles(prev => prev.map(f => f.id === tempId ? { ...f, progress: percentCompleted } : f));
        });
        if (res.success) setFiles(prev => prev.map(f => f.id === tempId ? { ...f, id: res.data.id, status: 'uploaded', progress: 100 } : f));
      } catch (error) {
        setErrorMsg(error.response?.data?.error?.message || "Upload failed");
        setFiles(prev => prev.map(f => f.id === tempId ? { ...f, status: 'failed' } : f));
      }
    }
  }, [analysisId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, maxSize: 25 * 1024 * 1024,
    accept: {
      'image/jpeg': [], 'image/png': [], 'image/webp': [], 'application/pdf': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
      'audio/mpeg': [], 'audio/wav': [], 'audio/mp4': [], 'audio/x-m4a': [], 'audio/webm': []
    }
  });

  const handleRemove = async (idToRemove) => {
    const file = files.find(f => f.id === idToRemove);
    setFiles(prev => prev.filter(f => f.id !== idToRemove));
    if (file && file.status === 'uploaded' && analysisId && !isDemoMode) {
      try { await removeInput(analysisId, file.id); } catch (err) {}
    }
  };

  const loadDemo = () => {
    setIsDemoMode(true);
    setFiles([
      { id: 'demo1', name: 'front_bumper_damage.jpg', size: '2.4 MB', type: 'image', status: 'uploaded', progress: 100 },
      { id: 'demo2', name: 'insurance_claim_form.pdf', size: '1.1 MB', type: 'document', status: 'uploaded', progress: 100 },
      { id: 'demo3', name: 'customer_statement.mp3', size: '3.5 MB', type: 'audio', status: 'uploaded', progress: 100 }
    ]);
    setTextContext('DEMO_MODE: Standard demo claim configuration.');
  };

  const handleStart = async () => {
    if (textContext) await updateContext(analysisId, textContext);
    await updateAnalysisStatus(analysisId, 'ready_for_processing');
    navigate(`/analysis/${analysisId}/workspace`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">New Analysis</h1>
          <p className="text-slate-500 font-medium mt-1">Upload multiple inputs for cross-modal intelligence.</p>
        </div>
        <div className="flex space-x-4">
          <button onClick={loadDemo} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm flex items-center">
            <Play className="w-4 h-4 mr-2" /> Load Demo Claim
          </button>
        </div>
      </div>
      
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl font-medium flex items-center shadow-sm">
          <AlertTriangle className="w-5 h-5 mr-3" /> {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div whileHover={{ y: -5, scale: 1.02 }} key={i} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center group">
              <div className={`w-16 h-16 rounded-2xl mb-4 flex items-center justify-center shadow-inner ${card.color === 'blue' ? 'bg-blue-50 text-blue-500' : card.color === 'emerald' ? 'bg-emerald-50 text-emerald-500' : card.color === 'amber' ? 'bg-amber-50 text-amber-500' : 'bg-purple-50 text-purple-500'}`}>
                <Icon className="w-8 h-8" />
              </div>
              <h3 className="text-xs font-black tracking-widest text-slate-400 mb-1">{card.type}</h3>
              <h4 className="text-lg font-bold text-slate-800 mb-2">{card.title}</h4>
              <p className="text-sm font-medium text-slate-500">{card.desc}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 pb-32">
        <div className="lg:col-span-2 space-y-6">
          <div {...getRootProps()} className={`bg-white rounded-3xl p-8 flex flex-col items-center justify-center min-h-[300px] border-dashed border-2 transition-colors cursor-pointer relative overflow-hidden shadow-sm ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-400 bg-slate-50/50'}`}>
            <input {...getInputProps()} />
            <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg border mb-6 z-10 transition-colors ${isDragActive ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-white text-indigo-600 border-slate-100'}`}>
              <UploadCloud className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2 z-10">{isDragActive ? "Drop files here..." : "Drag & drop files here"}</h3>
            <p className="text-slate-500 font-medium max-w-md text-center z-10 mb-8">Supports Images, Documents and Audio.</p>
          </div>
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center"><AlignLeft className="w-4 h-4 mr-2 text-purple-500" /> Additional Context</h3>
            <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all min-h-[120px]" placeholder="Describe anything else..." value={textContext} onChange={(e) => setTextContext(e.target.value)}></textarea>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col overflow-hidden h-[500px]">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Input Bag</h3>
            <span className="bg-white border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">{files.length}</span>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/20">
            {files.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Box className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-medium text-sm">No sources added yet</p>
              </div>
            ) : (
              files.map((file) => (
                <div key={file.id} className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className={`p-2 rounded-lg shrink-0 ${file.type === 'image' ? 'bg-blue-50 text-blue-500' : file.type === 'document' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'}`}>
                        {file.type === 'image' && <ImageIcon className="w-4 h-4" />}
                        {file.type === 'document' && <File className="w-4 h-4" />}
                        {file.type === 'audio' && <Mic className="w-4 h-4" />}
                      </div>
                      <div className="truncate pr-4">
                        <p className="text-sm font-bold text-slate-800 truncate" title={file.name}>{file.name}</p>
                        <p className="text-xs font-medium text-slate-400">
                          {file.status === 'uploading' && `Uploading ${file.progress}%`}
                          {file.status === 'uploaded' && <span className="text-emerald-500 flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Uploaded</span>}
                          {file.status === 'failed' && <span className="text-red-500 flex items-center"><AlertTriangle className="w-3 h-3 mr-1" /> Failed</span>}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => handleRemove(file.id)} className="text-slate-400 hover:text-red-500 p-1.5 rounded-md"><X className="w-4 h-4" /></button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-5 border-t border-slate-100 bg-white">
            <button onClick={handleStart} disabled={files.length === 0 || files.some(f => f.status === 'uploading')} className={`w-full py-4 rounded-full font-bold text-base transition-all flex items-center justify-center ${files.length > 0 && !files.some(f => f.status === 'uploading') ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_8px_25px_rgba(79,70,229,0.3)]' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
              Analyze with OmniSense <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
