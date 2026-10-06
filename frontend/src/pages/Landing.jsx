import { Link } from 'react-router-dom';
import { Box, ArrowRight, Image as ImageIcon, FileText, Mic, AlignLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Environment, ContactShadows } from '@react-three/drei';
import { useRef } from 'react';

function AICore() {
  const meshRef = useRef();
  useFrame((state) => {
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
  });
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
      <Sphere args={[1.2, 64, 64]} ref={meshRef} scale={1.8}>
        <MeshDistortMaterial
          color="#ffffff"
          emissive="#4F46E5"
          emissiveIntensity={0.3}
          attach="material"
          distort={0.4}
          speed={1.5}
          roughness={0.1}
          metalness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </Sphere>
    </Float>
  );
}

function SmallOrb({ color, position, speed = 2, scale = 1 }) {
  return (
    <Float speed={speed} rotationIntensity={2} floatIntensity={2} position={position}>
      <Sphere args={[0.2, 32, 32]} scale={scale}>
        <meshPhysicalMaterial color={color} roughness={0.2} metalness={0.8} clearcoat={1} emissive={color} emissiveIntensity={0.6} />
      </Sphere>
    </Float>
  );
}

export default function Landing() {
  const [demoOpen, setDemoOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#F8FAFF] text-slate-900 flex flex-col relative overflow-hidden">
      {/* Light Background Gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[120px] -z-10 -translate-x-1/3 translate-y-1/3"></div>
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-cyan-400/10 rounded-full blur-[120px] -z-10 -translate-x-1/2 -translate-y-1/2"></div>

      <header className="container mx-auto px-8 py-6 flex items-center justify-between z-20">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg mr-3 relative">
            <Box className="w-6 h-6 z-10" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">OMNI<span className="text-indigo-600">SENSE</span></span>
        </div>
        <nav className="hidden md:flex space-x-10 text-sm font-bold text-slate-500">
          <a href="#" className="hover:text-indigo-600 transition-colors">Product</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">How It Works</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Use Cases</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Technology</a>
        </nav>
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors px-4 py-2">
            Login
          </Link>
          <Link to="/analysis/new" className="bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-[0_4px_14px_rgba(79,70,229,0.39)]">
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-8 flex flex-col lg:flex-row items-center justify-between z-10 mt-6 mb-20 gap-16">
        
        {/* Left Content */}
        <div className="lg:w-1/2 flex flex-col items-start relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 px-4 py-1.5 rounded-full bg-white border border-indigo-100 shadow-sm flex items-center"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
            <span className="text-xs font-bold tracking-wide text-indigo-600 uppercase">Multimodal AI Platform</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-slate-900"
          >
            One AI.<br/>
            Every Input.<br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-gradient">One Intelligent Decision.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 max-w-lg mb-10 leading-relaxed font-medium"
          >
            Turn images, documents, voice and text into connected intelligence with the most advanced cross-modal reasoning engine.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link to="/analysis/new" className="w-full sm:w-auto flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full text-base font-bold transition-all shadow-[0_8px_30px_rgba(79,70,229,0.3)] hover:-translate-y-1">
              Start Analysis <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <button onClick={() => setDemoOpen(true)} className="w-full sm:w-auto flex items-center justify-center bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-full text-base font-bold transition-all shadow-sm hover:shadow-md cursor-pointer">
              Watch Demo
            </button>
          </motion.div>
        </div>

        {/* Right 3D Visual */}
        <div className="lg:w-1/2 w-full h-[600px] relative">
          
          {/* SVG Connecting Lines */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 500 500" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#c084fc" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut", delay: 1 }}
                d="M 100,100 Q 250,150 250,250" fill="none" stroke="url(#grad1)" strokeWidth="3" strokeDasharray="5,5" 
              />
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut", delay: 1.2 }}
                d="M 400,100 Q 300,150 250,250" fill="none" stroke="url(#grad1)" strokeWidth="3" strokeDasharray="5,5" 
              />
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut", delay: 1.4 }}
                d="M 100,400 Q 250,350 250,250" fill="none" stroke="url(#grad1)" strokeWidth="3" strokeDasharray="5,5" 
              />
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut", delay: 1.6 }}
                d="M 400,400 Q 300,350 250,250" fill="none" stroke="url(#grad1)" strokeWidth="3" strokeDasharray="5,5" 
              />
            </svg>
          </div>

          <div className="absolute inset-0 z-10 pointer-events-none">
             <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <ambientLight intensity={1.5} />
                <directionalLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
                <directionalLight position={[-10, -10, -10]} intensity={1.5} color="#c084fc" />
                <pointLight position={[0, 0, 5]} intensity={1.5} color="#818cf8" />
                
                <AICore />
                
                <SmallOrb color="#22d3ee" position={[-3, 2, -1]} speed={1.5} scale={1.2} />
                <SmallOrb color="#c084fc" position={[3, -1.5, 1]} speed={2.5} scale={1.5} />
                <SmallOrb color="#818cf8" position={[-2, -2.5, 0]} speed={1.2} scale={0.8} />
                <SmallOrb color="#ffffff" position={[2.5, 2.5, -2]} speed={3} scale={0.9} />
                
                <Environment preset="city" />
             </Canvas>
          </div>

          {/* Floating UI Elements over 3D */}
          <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[5%] left-[5%] bg-white/90 backdrop-blur-xl p-4 rounded-2xl flex items-center gap-3 z-20 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-slate-100"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shadow-inner">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 tracking-wider">IMAGE</p>
              <p className="text-sm font-bold text-slate-800">Visual Evidence</p>
            </div>
          </motion.div>

          <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-[5%] right-[5%] bg-white/90 backdrop-blur-xl p-4 rounded-2xl flex items-center gap-3 z-20 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-slate-100"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-inner">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 tracking-wider">DOCUMENT</p>
              <p className="text-sm font-bold text-slate-800">PDF Records</p>
            </div>
          </motion.div>

          <motion.div animate={{ y: [0, -10, 0], x: [0, -5, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[10%] left-[5%] bg-white/90 backdrop-blur-xl p-4 rounded-2xl flex items-center gap-3 z-20 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-slate-100"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shadow-inner">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 tracking-wider">VOICE</p>
              <p className="text-sm font-bold text-slate-800">Customer Audio</p>
            </div>
          </motion.div>

          <motion.div animate={{ y: [0, 10, 0], x: [0, 5, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-[10%] right-[5%] bg-white/90 backdrop-blur-xl p-4 rounded-2xl flex items-center gap-3 z-20 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-slate-100"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 shadow-inner">
              <AlignLeft className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 tracking-wider">TEXT</p>
              <p className="text-sm font-bold text-slate-800">Context Data</p>
            </div>
          </motion.div>

        </div>
      </main>

      <ProductDemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
}

