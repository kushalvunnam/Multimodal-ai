const fs = require('fs');
let dash = fs.readFileSync('frontend/src/pages/Dashboard.jsx', 'utf8');

// Remove DashboardAICore
const coreStart = dash.indexOf('function DashboardAICore() {');
const coreEnd = dash.indexOf('export default function Dashboard() {');
dash = dash.substring(0, coreStart) + dash.substring(coreEnd);

// Replace the Canvas block
const oldVisual = `<div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
              <ambientLight intensity={1.5} />
              <directionalLight position={[5, 10, 5]} intensity={2} color="#ffffff" />
              <directionalLight position={[-5, -10, -5]} intensity={1} color="#e0e7ff" />
              <pointLight position={[0, 0, 0]} intensity={2} color="#c084fc" />
              <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                <DashboardAICore />
              </Float>
              <Environment preset="city" />
            </Canvas>
          </div>`;

const newVisual = `          {/* Central 3D AI Automotive Visual */}
          <div className="absolute inset-0 z-0 flex items-center justify-center">
            <div className="relative w-[90%] max-w-[500px] flex items-center justify-center">
              {/* Premium 3D Car Asset */}
              <img 
                src="/car-render.jpg" 
                alt="3D AI Automotive Inspection" 
                className="w-full h-auto object-contain z-10"
                style={{ mixBlendMode: 'darken' }} 
              />
              
              {/* AI Scanning FX */}
              <div className="absolute bottom-4 w-[70%] h-12 bg-indigo-500/20 rounded-[100%] blur-xl z-0"></div>
              
              <motion.div 
                animate={{ y: ['-50%', '150%', '-50%'] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/4 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent z-20 opacity-80 shadow-[0_0_15px_rgba(99,102,241,1)]"
              ></motion.div>

              <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} className="absolute top-[35%] left-[30%] w-3 h-3 z-20">
                <div className="absolute inset-0 bg-indigo-500 rounded-full blur-sm"></div>
                <div className="absolute inset-0.5 bg-white rounded-full"></div>
                <div className="absolute -inset-2 border border-indigo-400/50 rounded-full animate-ping"></div>
              </motion.div>
              
              <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }} transition={{ duration: 2.5, repeat: Infinity, delay: 1 }} className="absolute top-[45%] right-[25%] w-3 h-3 z-20">
                <div className="absolute inset-0 bg-purple-500 rounded-full blur-sm"></div>
                <div className="absolute inset-0.5 bg-white rounded-full"></div>
                <div className="absolute -inset-2 border border-purple-400/50 rounded-full animate-ping"></div>
              </motion.div>
            </div>
          </div>`;

dash = dash.replace(oldVisual, newVisual);

fs.writeFileSync('frontend/src/pages/Dashboard.jsx', dash);
