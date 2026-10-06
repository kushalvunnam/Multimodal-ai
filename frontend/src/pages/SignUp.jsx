import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';

function AuthAICore() {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
      <Sphere args={[1.8, 64, 64]}>
        <MeshDistortMaterial color="#c084fc" emissive="#4F46E5" emissiveIntensity={0.3} distort={0.5} speed={3} roughness={0.1} metalness={0.9} clearcoat={1} />
      </Sphere>
    </Float>
  );
}

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const reqs = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    match: password === confirmPassword && password.length > 0
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill out all fields.');
      return;
    }
    if (!reqs.length || !reqs.upper || !reqs.lower || !reqs.number) {
      setError('Password does not meet the requirements.');
      return;
    }
    if (!reqs.match) {
      setError('Passwords do not match.');
      return;
    }
    
    setError('');
    setLoading(true);
    try {
      await register({ name, email, password });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* LEFT: FORM */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 xl:px-32 relative z-10 bg-white shadow-[10px_0_30px_rgba(0,0,0,0.02)] py-12">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Create your account</h1>
            <p className="text-slate-500 font-medium">Start turning multimodal data into intelligent decisions.</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start text-sm font-bold text-rose-600">
              <AlertCircle className="w-5 h-5 mr-3 shrink-0 mt-0.5" /> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all focus:bg-white"
                placeholder="Jane Doe"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all focus:bg-white"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative mb-3">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all focus:bg-white pr-10"
                  placeholder="Create a strong password"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs font-medium">
                <div className={`flex items-center ${reqs.length ? 'text-emerald-600' : 'text-slate-400'}`}>
                   {reqs.length ? <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-300 mr-1.5"></div>}
                   At least 8 chars
                </div>
                <div className={`flex items-center ${reqs.upper ? 'text-emerald-600' : 'text-slate-400'}`}>
                   {reqs.upper ? <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-300 mr-1.5"></div>}
                   Uppercase letter
                </div>
                <div className={`flex items-center ${reqs.lower ? 'text-emerald-600' : 'text-slate-400'}`}>
                   {reqs.lower ? <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-300 mr-1.5"></div>}
                   Lowercase letter
                </div>
                <div className={`flex items-center ${reqs.number ? 'text-emerald-600' : 'text-slate-400'}`}>
                   {reqs.number ? <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-300 mr-1.5"></div>}
                   Number
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Confirm Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all focus:bg-white ${reqs.match ? 'border-emerald-300' : confirmPassword ? 'border-rose-300' : 'border-slate-200'}`}
                placeholder="Repeat your password"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-all shadow-[0_4px_15px_rgba(79,70,229,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(79,70,229,0.4)] flex justify-center items-center mt-6 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm font-medium text-slate-500">
              Already have an account? <Link to="/signin" className="font-bold text-indigo-600 hover:text-indigo-700 ml-1 transition-colors">Sign In</Link>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT: 3D VISUAL */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-50 to-purple-50 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #4f46e5 0%, transparent 60%)' }}></div>
        <div className="w-full h-full relative z-10">
           <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
             <ambientLight intensity={1.5} />
             <directionalLight position={[2, 5, 2]} intensity={2} />
             <AuthAICore />
           </Canvas>
        </div>
      </div>
    </div>
  );
}
