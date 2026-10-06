import { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, Eye, EyeOff, AlertCircle, Image as ImageIcon, FileText, Mic, BrainCircuit, Car } from 'lucide-react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Torus, Stars, Html, Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

// 3D Orbital Rings
function OrbitalRings() {
  const groupRef = useRef();
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.5;
      groupRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer Ring */}
      <Torus args={[3.5, 0.01, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={2} wireframe />
      </Torus>
      {/* Inner Ring */}
      <Torus args={[2.5, 0.02, 16, 100]} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={1.5} wireframe />
      </Torus>
      {/* Scanning Ring */}
      <Torus args={[3, 0.05, 16, 100]} rotation={[-Math.PI / 6, 0, 0]}>
        <meshStandardMaterial color="#c084fc" emissive="#c084fc" emissiveIntensity={1} transparent opacity={0.3} />
      </Torus>
    </group>
  );
}

function FloatingNodes() {
  const groupRef = useRef();
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Node 1 - Vision */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1.5} position={[2.5, 1.5, 0]}>
        <Sphere args={[0.15, 16, 16]}>
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={2} />
        </Sphere>
        <Html position={[0.3, 0, 0]} center className="pointer-events-none">
          <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-md border border-cyan-500/30 px-3 py-1.5 rounded-lg text-cyan-400 font-bold tracking-widest text-[10px] uppercase">
            <ImageIcon className="w-3 h-3" />
            <span>Vision</span>
          </div>
        </Html>
        {/* Connection Line */}
        <Cylinder args={[0.01, 0.01, 2.8]} position={[-1.25, -0.75, 0]} rotation={[0, 0, Math.PI / 4]}>
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.3} />
        </Cylinder>
      </Float>

      {/* Node 2 - Documents */}
      <Float speed={2.5} rotationIntensity={1} floatIntensity={1} position={[-2.5, -1, 1]}>
        <Sphere args={[0.12, 16, 16]}>
          <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={2} />
        </Sphere>
        <Html position={[-0.3, 0, 0]} center className="pointer-events-none">
          <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-md border border-purple-500/30 px-3 py-1.5 rounded-lg text-purple-400 font-bold tracking-widest text-[10px] uppercase">
            <FileText className="w-3 h-3" />
            <span>Documents</span>
          </div>
        </Html>
      </Float>

      {/* Node 3 - Audio */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={2} position={[1.5, -2, -1]}>
        <Sphere args={[0.1, 16, 16]}>
          <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={2} />
        </Sphere>
        <Html position={[0.3, 0, 0]} center className="pointer-events-none">
          <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-md border border-fuchsia-500/30 px-3 py-1.5 rounded-lg text-fuchsia-400 font-bold tracking-widest text-[10px] uppercase">
            <Mic className="w-3 h-3" />
            <span>Audio</span>
          </div>
        </Html>
      </Float>

      {/* Node 4 - Reasoning */}
      <Float speed={3} rotationIntensity={2} floatIntensity={1.5} position={[-1.5, 2, -1]}>
        <Sphere args={[0.18, 16, 16]}>
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={2} />
        </Sphere>
        <Html position={[-0.3, 0, 0]} center className="pointer-events-none">
          <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-md border border-blue-500/30 px-3 py-1.5 rounded-lg text-blue-400 font-bold tracking-widest text-[10px] uppercase">
            <BrainCircuit className="w-3 h-3" />
            <span>Reasoning</span>
          </div>
        </Html>
      </Float>
    </group>
  );
}

function CoreSphere() {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
      <Sphere args={[1.2, 64, 64]}>
        <MeshDistortMaterial 
          color="#1e1b4b" 
          emissive="#6d28d9" 
          emissiveIntensity={1.5} 
          distort={0.4} 
          speed={1.5} 
          roughness={0.2} 
          metalness={0.8} 
          clearcoat={1} 
          wireframe={false}
        />
      </Sphere>
      {/* Inner bright core */}
      <Sphere args={[0.8, 32, 32]}>
        <meshBasicMaterial color="#c084fc" transparent opacity={0.6} />
      </Sphere>
    </Float>
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
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#030712] text-slate-200 overflow-hidden font-sans">
      
      {/* 3D AI COMMAND CENTER (Top on mobile, Left on desktop) */}
      <div className="w-full lg:w-[55%] h-[35vh] lg:h-screen relative border-b lg:border-b-0 lg:border-r border-white/5 order-1 lg:order-none shrink-0">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#030712] to-[#030712] z-0"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
        
        {/* Subtle Grid overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        {/* 3D Canvas */}
        <div className="absolute inset-0 z-10 cursor-pointer">
          <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
            <color attach="background" args={['#030712']} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#06b6d4" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#a855f7" />
            <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
            
            <CoreSphere />
            <OrbitalRings />
            <FloatingNodes />
          </Canvas>
        </div>

        {/* Decorative Overlay Info */}
        <div className="absolute top-8 left-8 z-20 pointer-events-none hidden lg:block">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            <p className="text-xs font-mono text-cyan-400 tracking-widest uppercase">System Online</p>
          </div>
          <p className="text-[10px] font-mono text-slate-500 tracking-wider">MULTIMODAL_ENGINE_v2.0 // NEURAL_CORE_ACTIVE</p>
        </div>

        {/* Floating Vehicle UI element (Glass panel) */}
        <div className="absolute bottom-12 left-12 z-20 pointer-events-none hidden lg:flex items-center space-x-4 bg-white/5 border border-white/10 backdrop-blur-md px-5 py-3 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
            <Car className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-0.5">Asset Detection</p>
            <div className="w-32 h-1 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '85%' }}
                transition={{ duration: 2, ease: "easeOut", repeat: Infinity, repeatType: "reverse", repeatDelay: 1 }}
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* LOGIN FORM (Bottom on mobile, Right on desktop) */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center items-center p-6 sm:p-12 relative z-10 order-2 lg:order-none flex-1 overflow-y-auto">
        
        <div className="w-full max-w-[420px] relative">
          
          {/* Glassmorphism Card */}
          <div className="bg-[#0f172a]/60 backdrop-blur-2xl border border-white/10 rounded-[24px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden">
            
            {/* Card inner glow */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-[40px] pointer-events-none"></div>

            <div className="mb-10 text-center relative z-10">
              <div className="inline-flex items-center justify-center space-x-2 mb-6">
                <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]">
                  <span className="text-white font-black text-xl tracking-tighter">O</span>
                </div>
                <span className="text-2xl font-extrabold tracking-tight text-white">
                  OMNI<span className="text-indigo-400">SENSE</span>
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
              <p className="text-sm font-medium text-slate-400">Turn real-world evidence into actionable intelligence.</p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start text-sm font-medium text-rose-400 backdrop-blur-sm relative z-10">
                <AlertCircle className="w-5 h-5 mr-3 shrink-0 mt-0.5" /> {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-widest">Email</label>
                <div className="relative group">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#020617]/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600 group-hover:border-white/20"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest">Password</label>
                  <Link to="/forgot-password" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</Link>
                </div>
                <div className="relative group">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#020617]/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600 group-hover:border-white/20 pr-10"
                    placeholder="Enter your password"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] flex justify-center items-center mt-8 disabled:opacity-70 border border-white/10"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Sign In &rarr;</span>}
              </motion.button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10 text-center relative z-10">
              <p className="text-sm font-medium text-slate-400">
                Don't have an account? <Link to="/signup" className="font-bold text-indigo-400 hover:text-indigo-300 ml-1 transition-colors">Create account</Link>
              </p>
            </div>
          </div>
          
          {/* Below Card Branding */}
          <div className="mt-10 text-center">
            <h3 className="text-sm font-medium text-slate-400 mb-3">Multimodal Intelligence Platform</h3>
            <div className="flex items-center justify-center space-x-3 text-[10px] font-black tracking-[0.2em] text-slate-600 uppercase">
              <span>Vision</span>
              <span className="text-indigo-500">•</span>
              <span>Documents</span>
              <span className="text-indigo-500">•</span>
              <span>Audio</span>
              <span className="text-indigo-500">•</span>
              <span>Reasoning</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

