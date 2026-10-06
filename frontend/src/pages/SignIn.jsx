import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, Eye, EyeOff, AlertCircle, ImageIcon, FileText, Mic, AlignLeft } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Torus, Float, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';

// 3D Glass AI Core Component
function GlassCore() {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer Glass Shell */}
      <Sphere args={[2.2, 64, 64]}>
        <meshPhysicalMaterial 
          transmission={1} 
          opacity={1} 
          roughness={0.05} 
          ior={1.15} 
          thickness={1.5} 
          color="#f5f3ff" 
          clearcoat={1} 
          clearcoatRoughness={0.1}
        />
      </Sphere>
      
      {/* Inner Glowing Core */}
      <Sphere args={[1.2, 32, 32]}>
        <meshStandardMaterial 
          color="#d8b4fe" 
          emissive="#8b5cf6" 
          emissiveIntensity={1.5} 
          roughness={0.4}
        />
      </Sphere>

      {/* Orbital Rings */}
      <Torus args={[3.2, 0.015, 16, 100]} rotation={[Math.PI / 3, 0, 0]}>
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.4} />
      </Torus>
      <Torus args={[3.8, 0.015, 16, 100]} rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
        <meshBasicMaterial color="#818cf8" transparent opacity={0.3} />
      </Torus>
      <Torus args={[4.5, 0.015, 16, 100]} rotation={[0, Math.PI / 3, Math.PI / 8]}>
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.2} />
      </Torus>

      {/* Floating inner particles */}
      <Stars radius={3} depth={1} count={50} factor={2} saturation={1} fade speed={2} />
    </group>
  );
}

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

  // Parallax Mouse Effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    setMousePosition({ x, y });
  };

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
    <div 
      className="min-h-screen flex flex-col-reverse lg:flex-row bg-[#F8F7FF] text-slate-800 overflow-hidden font-sans relative"
      onMouseMove={handleMouseMove}
    >
      {/* Background Soft Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-300/30 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[10%] right-[30%] w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-[150px]"></div>
        <div className="absolute top-[40%] left-[30%] w-[800px] h-[800px] bg-indigo-200/20 rounded-full blur-[150px]"></div>
      </div>

      {/* LEFT SIDE: 3D Visualization & Text (Hidden/Smaller on mobile, full on desktop) */}
      <div className="w-full lg:w-[60%] min-h-[50vh] lg:min-h-screen relative flex flex-col justify-center items-center p-8 lg:p-16 z-10">
        
        {/* Background 3D Canvas */}
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 10, 5]} intensity={2} color="#ffffff" />
            <directionalLight position={[-5, -10, -5]} intensity={1} color="#e0e7ff" />
            <pointLight position={[0, 0, 0]} intensity={2} color="#c084fc" />
            
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
              <GlassCore />
            </Float>
            <Environment preset="city" />
          </Canvas>
        </div>

        {/* Floating Modality Cards over the 3D Canvas */}
        <div className="absolute inset-0 z-10 pointer-events-none hidden md:block">
          
          <motion.div 
            animate={{ x: mousePosition.x * 1.5, y: mousePosition.y * 1.5 + Math.sin(Date.now() / 1000) * 10 }}
            className="absolute top-[20%] left-[15%] bg-white/70 backdrop-blur-xl border border-white/80 p-4 rounded-2xl shadow-[0_10px_30px_rgba(79,70,229,0.08)] flex items-center space-x-3 pointer-events-auto hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(79,70,229,0.15)] hover:border-purple-200 transition-all duration-300 group"
          >
            <div className="bg-indigo-50 p-2.5 rounded-xl group-hover:bg-indigo-100 transition-colors shadow-inner"><ImageIcon className="w-5 h-5 text-indigo-600 group-hover:drop-shadow-md" /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">IMAGE</p>
              <p className="text-sm font-bold text-slate-800">Visual Evidence</p>
            </div>
          </motion.div>

          <motion.div 
            animate={{ x: mousePosition.x * -1, y: mousePosition.y * -1 + Math.cos(Date.now() / 1200) * 8 }}
            className="absolute top-[25%] right-[15%] bg-white/70 backdrop-blur-xl border border-white/80 p-4 rounded-2xl shadow-[0_10px_30px_rgba(79,70,229,0.08)] flex items-center space-x-3 pointer-events-auto hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(79,70,229,0.15)] hover:border-purple-200 transition-all duration-300 group"
          >
            <div className="bg-purple-50 p-2.5 rounded-xl group-hover:bg-purple-100 transition-colors shadow-inner"><FileText className="w-5 h-5 text-purple-600 group-hover:drop-shadow-md" /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">DOCUMENT</p>
              <p className="text-sm font-bold text-slate-800">PDF Records</p>
            </div>
          </motion.div>

          <motion.div 
            animate={{ x: mousePosition.x * 1.2, y: mousePosition.y * 1.2 + Math.sin(Date.now() / 1500) * 12 }}
            className="absolute bottom-[25%] left-[20%] bg-white/70 backdrop-blur-xl border border-white/80 p-4 rounded-2xl shadow-[0_10px_30px_rgba(79,70,229,0.08)] flex items-center space-x-3 pointer-events-auto hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(79,70,229,0.15)] hover:border-purple-200 transition-all duration-300 group"
          >
            <div className="bg-emerald-50 p-2.5 rounded-xl group-hover:bg-emerald-100 transition-colors shadow-inner"><Mic className="w-5 h-5 text-emerald-600 group-hover:drop-shadow-md" /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">AUDIO</p>
              <p className="text-sm font-bold text-slate-800">Customer Audio</p>
            </div>
          </motion.div>

          <motion.div 
            animate={{ x: mousePosition.x * -1.5, y: mousePosition.y * -1.5 + Math.cos(Date.now() / 1100) * 9 }}
            className="absolute bottom-[20%] right-[20%] bg-white/70 backdrop-blur-xl border border-white/80 p-4 rounded-2xl shadow-[0_10px_30px_rgba(79,70,229,0.08)] flex items-center space-x-3 pointer-events-auto hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(79,70,229,0.15)] hover:border-purple-200 transition-all duration-300 group"
          >
            <div className="bg-blue-50 p-2.5 rounded-xl group-hover:bg-blue-100 transition-colors shadow-inner"><AlignLeft className="w-5 h-5 text-blue-600 group-hover:drop-shadow-md" /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">TEXT</p>
              <p className="text-sm font-bold text-slate-800">Context Data</p>
            </div>
          </motion.div>
        </div>

        {/* Text Content overlaying the bottom/top */}
        <div className="absolute top-12 left-12 z-20 hidden lg:block">
          <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/80 shadow-sm mb-6">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">AI Engine Online</p>
          </div>
        </div>

        <div className="absolute bottom-12 left-12 z-20 hidden lg:block max-w-lg pointer-events-none">
          <span className="inline-block px-3 py-1 bg-white/60 backdrop-blur border border-white/80 rounded-lg text-xs font-black tracking-widest text-indigo-600 uppercase mb-4 shadow-sm">
            OmniSense Intelligence Engine
          </span>
          <h1 className="text-4xl xl:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            Turn Every Input <br/>
            Into One <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Intelligent Decision.</span>
          </h1>
          <p className="text-lg text-slate-600 font-medium">
            Analyze images, documents, audio and text with one multimodal intelligence engine.
          </p>
        </div>

      </div>

      {/* RIGHT SIDE: Authentication Card */}
      <div className="w-full lg:w-[40%] flex flex-col justify-center items-center p-6 sm:p-12 relative z-20">
        <div className="w-full max-w-[420px]">
          
          {/* Mobile Header (Visible only on small screens) */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center text-white font-black text-xl">O</div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900">OMNI<span className="text-indigo-600">SENSE</span></span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Welcome back</h1>
            <p className="text-sm text-slate-500 font-medium">Turn real-world evidence into actionable intelligence.</p>
          </div>

          <div className="bg-white/80 backdrop-blur-2xl border border-white rounded-[24px] p-8 sm:p-10 shadow-[0_20px_60px_-15px_rgba(79,70,229,0.15)] relative">
            
            {/* Desktop Header inside card */}
            <div className="hidden lg:block mb-10 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 flex items-center justify-center mb-5 border border-indigo-100">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-md flex items-center justify-center text-white font-black text-xl">O</div>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">Welcome back</h2>
              <p className="text-sm text-slate-500 font-medium px-4">Turn real-world evidence into actionable intelligence.</p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start text-sm font-bold text-rose-600">
                <AlertCircle className="w-5 h-5 mr-3 shrink-0 mt-0.5" /> {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all focus:bg-white placeholder-slate-400"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Password</label>
                  <Link to="/forgot-password" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Forgot password?</Link>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all focus:bg-white pr-10 placeholder-slate-400"
                    placeholder="Enter your password"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.01, y: -2 }}
                whileTap={{ scale: 0.99 }}
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-[0_8px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_12px_25px_rgba(99,102,241,0.4)] flex justify-center items-center mt-8 disabled:opacity-70 border border-transparent"
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
        </div>
      </div>
    </div>
  );
}
