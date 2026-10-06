import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, Eye, EyeOff, AlertCircle, ScanLine, FileText, Mic, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F7F7FF] text-slate-800 overflow-hidden font-sans relative">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-400/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* LEFT: BRANDING & VISUALIZATION */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center items-center p-8 lg:p-16 relative z-10">
        <div className="w-full max-w-xl">
          <div className="mb-12">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 flex items-center justify-center text-white font-black text-2xl">O</div>
              <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                OMNI<span className="text-indigo-600">SENSE</span>
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
              Multimodal Intelligence for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Real-World Evidence.</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-md">
              Analyze images, documents, and audio with advanced AI to extract insights, detect damage, and generate actionable reports.
            </p>
          </div>

          {/* 3D Visualization Abstract Representation */}
          <div className="relative h-64 w-full rounded-3xl bg-white/40 backdrop-blur-3xl border border-white/60 shadow-xl overflow-hidden flex items-center justify-center p-8">
            {/* Center Vehicle Placeholder (CSS Based 3D feel) */}
            <div className="relative w-48 h-24 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-[4rem] shadow-inner flex items-center justify-center border border-white">
              <div className="absolute w-32 h-12 bg-white rounded-t-3xl -top-8 border border-white/50 shadow-sm backdrop-blur-sm"></div>
              <div className="absolute -bottom-4 left-6 w-10 h-10 bg-slate-800 rounded-full border-4 border-slate-200 shadow-md"></div>
              <div className="absolute -bottom-4 right-6 w-10 h-10 bg-slate-800 rounded-full border-4 border-slate-200 shadow-md"></div>
              <div className="absolute w-full h-1 bg-cyan-400 top-1/2 blur-sm shadow-[0_0_15px_#06b6d4] opacity-50 animate-pulse"></div>
            </div>

            {/* Floating Nodes */}
            <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-6 left-12 bg-white/90 backdrop-blur border border-indigo-100 p-3 rounded-2xl shadow-lg flex flex-col items-center">
              <div className="bg-indigo-50 p-2 rounded-xl mb-1"><ScanLine className="w-5 h-5 text-indigo-600" /></div>
              <span className="text-[10px] font-bold text-slate-600">AI Vision</span>
            </motion.div>
            
            <motion.div animate={{ y: [5, -5, 5] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-6 left-24 bg-white/90 backdrop-blur border border-purple-100 p-3 rounded-2xl shadow-lg flex flex-col items-center">
              <div className="bg-purple-50 p-2 rounded-xl mb-1"><FileText className="w-5 h-5 text-purple-600" /></div>
              <span className="text-[10px] font-bold text-slate-600">Document Intel</span>
            </motion.div>

            <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }} className="absolute top-10 right-16 bg-white/90 backdrop-blur border border-blue-100 p-3 rounded-2xl shadow-lg flex flex-col items-center">
              <div className="bg-blue-50 p-2 rounded-xl mb-1"><Mic className="w-5 h-5 text-blue-600" /></div>
              <span className="text-[10px] font-bold text-slate-600">Audio Intel</span>
            </motion.div>

            <motion.div animate={{ y: [4, -4, 4] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-8 right-12 bg-white/90 backdrop-blur border border-cyan-100 p-3 rounded-2xl shadow-lg flex flex-col items-center">
              <div className="bg-cyan-50 p-2 rounded-xl mb-1"><BrainCircuit className="w-5 h-5 text-cyan-600" /></div>
              <span className="text-[10px] font-bold text-slate-600">AI Reasoning</span>
            </motion.div>

          </div>
          
          {/* Stats Footer */}
          <div className="flex items-center space-x-12 mt-8">
            <div>
              <p className="text-2xl font-black text-slate-900">10K+</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Analyses</p>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">98%</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Accuracy</p>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">4</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Evidence Types</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: LOGIN FORM */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center items-center p-8 lg:p-12 relative z-10 bg-white/40 backdrop-blur-2xl border-l border-white/60 shadow-[-20px_0_40px_rgba(79,70,229,0.05)]">
        <div className="w-full max-w-[400px]">
          <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-[32px] p-8 shadow-[0_20px_60px_-15px_rgba(79,70,229,0.15)] relative">
            
            <div className="mb-8 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow flex items-center justify-center text-white font-black text-lg">O</div>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h2>
              <p className="text-sm text-slate-500 font-medium">Turn real-world evidence into actionable intelligence.</p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start text-sm font-bold text-rose-600">
                <AlertCircle className="w-5 h-5 mr-3 shrink-0 mt-0.5" /> {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all focus:bg-white"
                  placeholder="you@example.com"
                  required
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Password</label>
                  <Link to="/forgot-password" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Forgot password?</Link>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all focus:bg-white pr-10"
                    placeholder="Enter your password"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/30 flex justify-center items-center mt-8 disabled:opacity-70 border border-transparent"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Sign In &rarr;</span>}
              </motion.button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm font-medium text-slate-500">
                Don't have an account? <Link to="/signup" className="font-bold text-indigo-600 hover:text-indigo-700 ml-1 transition-colors">Create account</Link>
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Multimodal Intelligence Platform</h3>
            <div className="flex items-center justify-center space-x-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
              <span>Vision</span><span className="text-indigo-300">•</span>
              <span>Documents</span><span className="text-indigo-300">•</span>
              <span>Audio</span><span className="text-indigo-300">•</span>
              <span>Reasoning</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
