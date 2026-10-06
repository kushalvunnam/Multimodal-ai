import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Share2, AlertTriangle, CheckCircle, ShieldAlert, Target, Image as ImageIcon, FileText, Mic, Send, Sparkles, ChevronDown, ChevronUp, Brain, Info, ArrowRight, ArrowDown, Loader2, FileJson } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { getAnalysis, sendChatMessage, generateCustomerSummary } from '../services/api';

function TinyAICore() {
  return (
    <Float speed={3} rotationIntensity={2} floatIntensity={2}>
      <Sphere args={[1.5, 32, 32]}>
        <MeshDistortMaterial color="#4F46E5" emissive="#c084fc" emissiveIntensity={0.2} distort={0.2} speed={2} roughness={0.1} metalness={0.9} clearcoat={1} />
      </Sphere>
    </Float>
  );
}

const EvidencePanel = ({ details }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3 text-sm">
      <button onClick={() => setOpen(!open)} className="text-indigo-600 font-bold flex items-center hover:text-indigo-800 transition-colors">
        {open ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
        View Evidence
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="mt-2 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <p className="font-medium text-slate-800"><span className="text-xs font-black tracking-widest text-slate-400 block mb-1">AI REASONING</span> {details.assessment || details.explanation || details.reason}</p>
              <div className="text-xs font-mono text-slate-600 bg-white p-3 rounded-lg border border-slate-100 shadow-inner">
                <div className="mb-2"><strong className="text-indigo-600">SOURCES:</strong> {details.sources?.join(', ') || 'N/A'}</div>
                {details.evidence && <div className="mb-1"><strong className="text-slate-800">EVIDENCE:</strong> {details.evidence.join(' | ')}</div>}
                {details.values && <div className="mb-1"><strong className="text-slate-800">VALUES DETECTED:</strong> {details.values.join(' vs ')}</div>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Results() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'ai', content: "I'm ready to answer questions about this analysis." }]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getAnalysis(id);
        if (res.success) {
          setData(res.data);
          if (res.data.chatHistory?.length > 0) setMessages(res.data.chatHistory);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    if (id) loadData();
  }, [id]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, chatOpen]);

  const showActionMessage = (message) => {
    setActionMessage(message);
    window.setTimeout(() => setActionMessage(''), 2500);
  };

  // Export the exact analysis payload without making another backend/AI request.
  const handleExportJson = () => {
    if (!data) return;
    try {
      const payload = JSON.stringify(data, null, 2);
      const blob = new Blob([payload], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `omnisense-analysis-${id}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      showActionMessage('JSON downloaded successfully');
    } catch (err) {
      console.error('JSON export failed:', err);
      showActionMessage('Unable to export JSON');
    }
  };

  // Use the browser's native, reliable PDF flow. No AI/API call and no extra package required.
  const handleExportPdf = () => {
    const previousTitle = document.title;
    document.title = `OmniSense Report - ${id}`;
    window.setTimeout(() => {
      window.print();
      document.title = previousTitle;
    }, 50);
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = { title: `OmniSense Analysis ${id}`, text: 'OmniSense multimodal analysis report', url: shareUrl };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      showActionMessage('Report link copied to clipboard');
    } catch (err) {
      if (err?.name === 'AbortError') return;
      try {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
        showActionMessage('Report link copied to clipboard');
      } catch (copyErr) {
        console.error('Share failed:', copyErr);
        showActionMessage('Unable to share report');
      }
    }
  };

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput.trim();
    setChatInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setChatLoading(true);
    try {
      const res = await sendChatMessage(id, msg);
      if (res.success) setMessages(prev => [...prev, { role: 'ai', content: res.data.message }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "I couldn't process that request right now." }]);
    } finally { setChatLoading(false); }
  };

  const handleGenerateSummary = async () => {
    setSummaryLoading(true);
    try {
      const res = await generateCustomerSummary(id);
      if (res.success) setData(prev => ({ ...prev, customerSummary: res.data.summary }));
    } catch (err) { console.error(err); }
    finally { setSummaryLoading(false); }
  };

  if (loading) return <div className="min-h-[60vh] flex flex-col items-center justify-center text-indigo-600"><Loader2 className="w-10 h-10 animate-spin mb-4" /> Loading AI Results...</div>;
  if (!data || !data.reasoning) return <div className="p-10 text-center text-red-500 font-bold">Analysis not found or still processing.</div>;

  const { reasoning, inputs, customerSummary, status, createdAt } = data;
  const { correlations = [], contradictions = [], missingInformation = [], riskSignals = [], recommendations = [], overallAssessment } = reasoning;
  const dateObj = new Date(createdAt);

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-32">
      {actionMessage && <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-5 py-3 rounded-full text-sm font-bold shadow-xl">{actionMessage}</div>}

      {/* 1. REPORT HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-6">
        <div>
          <div className="text-xs font-black text-slate-400 tracking-widest mb-2 uppercase">Multimodal Intelligence Report</div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center">{id.split('-')[0].toUpperCase()}</h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center"><CheckCircle className="w-3 h-3 mr-1.5" /> {status === 'processed' ? 'Completed' : 'Processing'}</span>
          </div>
          <p className="text-slate-500 font-medium text-sm">Created {dateObj.toLocaleDateString()} {dateObj.toLocaleTimeString()}</p>
        </div>
        <div className="flex space-x-3 print:hidden">
          <button type="button" onClick={handleExportJson} className="bg-white hover:bg-slate-50 border border-slate-200 px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center text-slate-700 shadow-sm hover:shadow-md">
            <FileJson className="w-4 h-4 mr-2" /> JSON
          </button>
          <button type="button" onClick={handleShare} className="bg-white hover:bg-slate-50 border border-slate-200 px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center text-slate-700 shadow-sm hover:shadow-md">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </button>
          <button type="button" onClick={handleExportPdf} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center shadow-[0_4px_15px_rgba(79,70,229,0.3)] hover:-translate-y-0.5">
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </button>
        </div>
      </div>

      {/* 2. EXECUTIVE SUMMARY & 3. INTELLIGENCE OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 shadow-lg text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 opacity-20 pointer-events-none"><Canvas><ambientLight intensity={1.5}/><TinyAICore /></Canvas></div>
          <h2 className="text-xs font-black tracking-widest text-indigo-200 mb-4 flex items-center"><Target className="w-4 h-4 mr-2" /> EXECUTIVE SUMMARY</h2>
          <p className="text-xl font-medium leading-relaxed mb-8 relative z-10">{overallAssessment?.summary || "Analysis completed successfully."}</p>
          <div className="flex flex-wrap gap-4 relative z-10">
            {inputs.filter(i => i.type === 'image').length > 0 && <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold flex items-center"><ImageIcon className="w-4 h-4 mr-2" /> {inputs.filter(i => i.type === 'image').length} Images</div>}
            {inputs.filter(i => i.type === 'document').length > 0 && <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold flex items-center"><FileText className="w-4 h-4 mr-2" /> {inputs.filter(i => i.type === 'document').length} Documents</div>}
            {inputs.filter(i => i.type === 'audio').length > 0 && <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold flex items-center"><Mic className="w-4 h-4 mr-2" /> {inputs.filter(i => i.type === 'audio').length} Audio</div>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm flex flex-col justify-center items-center text-center"><CheckCircle className="w-8 h-8 text-emerald-500 mb-2" /><span className="text-2xl font-black text-slate-800">{correlations.length}</span><span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Consistent<br/>Findings</span></div>
          <div className="bg-white border border-amber-100 rounded-2xl p-5 shadow-sm flex flex-col justify-center items-center text-center"><AlertTriangle className="w-8 h-8 text-amber-500 mb-2" /><span className="text-2xl font-black text-slate-800">{contradictions.length}</span><span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Potential<br/>Contradictions</span></div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-center items-center text-center"><Info className="w-8 h-8 text-slate-400 mb-2" /><span className="text-2xl font-black text-slate-800">{missingInformation.length}</span><span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Missing<br/>Items</span></div>
          <div className="bg-white border border-indigo-100 rounded-2xl p-5 shadow-sm flex flex-col justify-center items-center text-center"><ArrowRight className="w-8 h-8 text-indigo-500 mb-2" /><span className="text-2xl font-black text-slate-800">{recommendations.length}</span><span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Recommended<br/>Actions</span></div>
        </div>
      </div>

      {/* 4. CROSS-MODAL FINDINGS */}
      <div className="space-y-6">
        <div className="text-center"><h2 className="text-2xl font-extrabold text-slate-900 flex items-center justify-center mb-2"><Brain className="w-6 h-6 mr-3 text-indigo-600" /> Cross-Modal Intelligence</h2><p className="text-slate-500 font-medium">OmniSense dynamically compared evidence across all available inputs.</p></div>
        {correlations.length === 0 && contradictions.length === 0 && <div className="bg-slate-50 p-10 rounded-3xl text-center text-slate-500 font-medium">No cross-modal relationships detected.</div>}
        <div className="space-y-8">
          {correlations.map((corr, i) => (
            <div key={i} className="bg-white border border-emerald-100 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4"><div className="flex-1 flex flex-col md:flex-row items-center gap-4 w-full">
                {corr.sources.map((src, j) => <div key={j} className="flex items-center w-full md:w-auto"><div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center flex-1 md:flex-initial min-w-[140px]"><span className="text-[10px] font-black text-slate-400 tracking-widest uppercase block mb-1">{src}</span><span className="text-sm font-bold text-slate-700 truncate block">{corr.evidence[j] ? corr.evidence[j].substring(0,25) + '...' : 'Evidence mapped'}</span></div>{j < corr.sources.length - 1 && <ArrowRight className="w-5 h-5 text-slate-300 mx-2 hidden md:block" />}{j < corr.sources.length - 1 && <ArrowDown className="w-5 h-5 text-slate-300 my-2 block md:hidden" />}</div>)}
                <ArrowRight className="w-6 h-6 text-emerald-400 mx-4 hidden md:block" /><ArrowDown className="w-6 h-6 text-emerald-400 my-4 block md:hidden" />
                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl flex-1 text-center md:text-left"><div className="flex items-center justify-center md:justify-start text-emerald-600 font-bold text-sm mb-1"><CheckCircle className="w-4 h-4 mr-2" /> CONSISTENT FINDING</div><p className="text-slate-800 font-bold">{corr.topic}</p></div>
              </div></div>
              <div className="mt-4 border-t border-slate-100 pt-4"><EvidencePanel details={corr} /></div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center"><AlertTriangle className="w-5 h-5 text-amber-500 mr-2" /> Potential Contradictions</h2>
          <div className="space-y-4">{contradictions.length === 0 ? <p className="text-slate-500 text-sm">No contradictions found.</p> : null}{contradictions.map((contra, i) => <div key={i} className="bg-amber-50 border border-amber-100 rounded-2xl p-5 relative overflow-hidden"><div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400"></div><div className="flex justify-between items-start mb-2"><h4 className="font-bold text-slate-800">{contra.topic}</h4><span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${contra.severity === 'high' ? 'bg-red-100 text-red-600' : 'bg-amber-200 text-amber-800'}`}>{contra.severity} RISK</span></div><div className="flex items-center space-x-4 mb-3 text-xs font-mono text-slate-600 bg-white p-3 rounded-lg border border-amber-100"><div className="flex-1"><strong>{contra.sources[0]?.toUpperCase()}</strong><br/>{contra.values[0] || 'Unknown'}</div><div className="text-amber-400 font-bold">VS</div><div className="flex-1"><strong>{contra.sources[1]?.toUpperCase()}</strong><br/>{contra.values[1] || 'Unknown'}</div></div><EvidencePanel details={contra} /></div>)}</div>
        </div>

        <div className="space-y-8">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm"><h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center"><Info className="w-5 h-5 text-slate-400 mr-2" /> Missing Information</h2><div className="space-y-4">{missingInformation.length === 0 ? <p className="text-slate-500 text-sm">No missing information.</p> : null}{missingInformation.map((info, i) => <div key={i} className="flex items-start"><div className="w-2 h-2 rounded-full bg-slate-300 mt-2 mr-3 shrink-0"></div><div><h4 className="text-sm font-bold text-slate-800">{info.topic}</h4><p className="text-xs text-slate-500 mt-1">{info.reason}</p><p className="text-xs font-bold text-indigo-600 mt-1">Recommend: {info.recommendedAction}</p></div></div>)}</div></div>
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm"><h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center"><ShieldAlert className="w-5 h-5 text-orange-500 mr-2" /> Risk Signals</h2><div className="space-y-4">{riskSignals.length === 0 ? <p className="text-slate-500 text-sm">No major risks identified.</p> : null}{riskSignals.map((risk, i) => <div key={i} className="bg-orange-50 border border-orange-100 rounded-xl p-4"><h4 className="text-sm font-bold text-slate-800 mb-1">{risk.reason}</h4><p className="text-xs text-slate-600">{risk.evidence}</p></div>)}</div></div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-10 shadow-sm"><h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center"><Target className="w-6 h-6 text-indigo-600 mr-3" /> Recommended Next Actions</h2><p className="text-slate-500 font-medium mb-8">Actionable steps derived entirely from the evidence across all modalities.</p><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{recommendations.length === 0 ? <p className="text-slate-500 text-sm">No specific actions recommended.</p> : null}{recommendations.map((rec, i) => <div key={i} className="bg-white border border-slate-200 hover:border-indigo-300 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all"><div className="text-3xl font-black text-slate-100 mb-2">0{i+1}</div><h4 className="font-bold text-slate-800 text-base mb-2">{rec.action}</h4><p className="text-sm text-slate-500">{rec.reason}</p></div>)}</div></div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between shadow-sm"><div className="mb-4 md:mb-0"><h2 className="text-lg font-bold text-indigo-900 mb-1">Customer-Facing Summary</h2><p className="text-sm text-indigo-700">Generate a non-technical, simple explanation of these findings suitable for the end-user.</p></div>{!customerSummary ? <button onClick={handleGenerateSummary} disabled={summaryLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-bold shadow-md transition-all flex items-center disabled:opacity-50">{summaryLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />} Generate Summary</button> : null}{customerSummary && <div className="w-full mt-6 bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm"><h4 className="text-sm font-black tracking-widest text-indigo-400 mb-3">GENERATED SUMMARY</h4><p className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">{customerSummary}</p></div>}</div>

      <motion.div className="fixed bottom-8 right-8 w-[400px] bg-white/95 backdrop-blur-2xl rounded-3xl overflow-hidden flex flex-col z-50 shadow-[0_20px_50px_rgba(79,70,229,0.15)] border border-slate-100 print:hidden">
        <div onClick={() => setChatOpen(!chatOpen)} className="bg-white/80 px-6 py-5 border-b border-slate-100 flex justify-between items-center relative overflow-hidden cursor-pointer"><div className="absolute right-0 top-0 w-24 h-24 pointer-events-none"><Canvas><ambientLight intensity={1.5}/><directionalLight position={[2, 2, 2]} intensity={2}/><TinyAICore /></Canvas></div><div className="relative z-10 flex items-center justify-between w-full"><div><div className="font-bold text-slate-900 text-sm flex items-center mb-0.5"><Sparkles className="w-4 h-4 mr-2 text-indigo-600" /> Ask OmniSense</div><div className="text-xs font-medium text-slate-400">Context-aware reasoning assistant</div></div>{chatOpen ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronUp className="w-5 h-5 text-slate-400" />}</div></div>
        <AnimatePresence>{chatOpen && <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}><div className="h-80 p-6 overflow-y-auto bg-slate-50/50 text-sm flex flex-col space-y-4">{messages.map((msg, i) => <div key={i} className={`p-4 rounded-2xl max-w-[85%] font-medium shadow-sm ${msg.role === 'ai' ? 'bg-white border border-slate-100 rounded-tl-none self-start text-slate-700' : 'bg-indigo-600 text-white rounded-tr-none self-end'}`}>{msg.content}</div>)}{chatLoading && <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none self-start text-slate-500 font-medium shadow-sm flex items-center"><Loader2 className="w-4 h-4 animate-spin mr-2" /> Thinking...</div>}<div ref={chatEndRef} /></div><form onSubmit={handleSendChat} className="p-4 bg-white border-t border-slate-100 relative flex items-center"><input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask about this analysis..." className="w-full bg-slate-50 border border-slate-200 rounded-full pl-5 pr-12 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all shadow-inner" /><button type="submit" disabled={!chatInput.trim() || chatLoading} className="absolute right-6 p-2 text-indigo-600 hover:text-indigo-800 bg-white rounded-full shadow-sm border border-slate-100 disabled:opacity-50"><Send className="w-4 h-4" /></button></form></motion.div>}</AnimatePresence>
      </motion.div>
    </div>
  );
}

/* PDF export uses the browser print engine, so the report remains dependency-free. */
