import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, File, Image as ImageIcon, Mic, X, Layers, Play, AlignLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NewAnalysis() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  
  const loadDemo = () => {
    setFiles([
      { name: 'front_bumper_damage.jpg', type: 'image', size: '2.4 MB' },
      { name: 'side_panel_scratch.jpg', type: 'image', size: '1.8 MB' },
      { name: 'insurance_claim_form.pdf', type: 'document', size: '1.2 MB' },
      { name: 'customer_statement.wav', type: 'audio', size: '4.5 MB' }
    ]);
  };

  const handleStart = () => {
    navigate('/analysis/demo-123/workspace');
  };

  const cards = [
    { type: 'IMAGE', icon: ImageIcon, title: 'Visual Evidence', desc: 'Upload photos, screenshots or visual evidence.', color: 'blue' },
    { type: 'DOCUMENT', icon: File, title: 'Documents', desc: 'PDF, DOCX and structured documents.', color: 'emerald' },
    { type: 'VOICE', icon: Mic, title: 'Audio', desc: 'Record or upload voice input.', color: 'amber' },
    { type: 'TEXT', icon: AlignLeft, title: 'Text Context', desc: 'Add additional textual context.', color: 'purple' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-text-main flex items-center mb-2">
            <Sparkles className="w-8 h-8 mr-3 text-primary" /> New Analysis
          </h1>
          <p className="text-text-muted font-medium text-lg">Upload multiple inputs and let OmniSense understand them together.</p>
        </div>
        <button onClick={loadDemo} className="bg-white border border-gray-200 hover:border-primary text-text-main px-5 py-2.5 rounded-full text-sm font-bold transition-colors flex items-center shadow-sm">
          <Play className="w-4 h-4 mr-2 text-primary fill-primary" /> Load Demo Claim
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              key={i} 
              className={`bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] cursor-pointer flex flex-col items-center text-center group`}
            >
              <div className={`w-16 h-16 rounded-2xl mb-4 flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner
                ${card.color === 'blue' ? 'bg-blue-50 text-blue-500' : 
                  card.color === 'emerald' ? 'bg-emerald-50 text-emerald-500' : 
                  card.color === 'amber' ? 'bg-amber-50 text-amber-500' : 
                  'bg-purple-50 text-purple-500'}`}
              >
                <Icon className="w-8 h-8" />
              </div>
              <h3 className="text-xs font-black tracking-widest text-gray-400 mb-1">{card.type}</h3>
              <h4 className="text-lg font-bold text-text-main mb-2">{card.title}</h4>
              <p className="text-sm font-medium text-text-muted">{card.desc}</p>
              
              <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm font-bold text-primary flex items-center">
                  Upload <UploadCloud className="w-4 h-4 ml-1" />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center min-h-[300px] border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer bg-gray-50/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100 mb-6 z-10 text-primary">
            <UploadCloud className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-text-main mb-2 z-10">Drag & drop files here</h3>
          <p className="text-text-muted font-medium max-w-md text-center z-10 mb-8">
            The OmniSense engine automatically aligns and correlates multiple data modalities.
          </p>
          <div className="flex gap-4 z-10">
            <button className="bg-white border border-gray-200 hover:border-primary px-6 py-2.5 rounded-full text-sm font-bold transition-colors shadow-sm">
              Browse Files
            </button>
            <button className="bg-white border border-gray-200 hover:border-primary px-6 py-2.5 rounded-full text-sm font-bold transition-colors shadow-sm flex items-center">
              <Mic className="w-4 h-4 mr-2 text-primary" /> Record Audio
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm flex flex-col overflow-hidden h-[450px]">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h3 className="font-bold text-text-main">Input Bag</h3>
            <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2.5 py-1 rounded-full">{files.length}</span>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/20">
            {files.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <Box className="w-10 h-10 mb-3 opacity-20" />
                <p className="font-medium text-sm">No sources added yet</p>
              </div>
            ) : (
              files.map((file, i) => (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i*0.1 }} key={i} className="bg-white border border-gray-100 rounded-xl p-3 flex items-center justify-between group shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className={`p-2 rounded-lg shrink-0 
                      ${file.type === 'image' ? 'bg-blue-50 text-blue-500' : 
                        file.type === 'document' ? 'bg-emerald-50 text-emerald-500' : 
                        'bg-amber-50 text-amber-500'}`}>
                      {file.type === 'image' && <ImageIcon className="w-4 h-4" />}
                      {file.type === 'document' && <File className="w-4 h-4" />}
                      {file.type === 'audio' && <Mic className="w-4 h-4" />}
                    </div>
                    <div className="truncate pr-4">
                      <p className="text-sm font-bold text-text-main truncate">{file.name}</p>
                      <p className="text-xs font-medium text-gray-400">Ready • {file.size}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0 bg-gray-50 p-1.5 rounded-md">
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))
            )}
          </div>
          
          <div className="p-5 border-t border-gray-100 bg-white">
            <button 
              onClick={handleStart}
              disabled={files.length === 0}
              className={`w-full py-4 rounded-full font-bold text-base transition-all flex items-center justify-center
                ${files.length > 0 
                  ? 'bg-primary hover:bg-primary-hover text-white shadow-[0_8px_25px_rgba(79,70,229,0.3)] hover:-translate-y-1' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                }`}
            >
              Analyze with OmniSense <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
