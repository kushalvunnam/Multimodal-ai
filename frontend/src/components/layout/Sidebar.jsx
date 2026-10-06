import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, History, FileText, Settings, Layers, Box } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Sidebar() {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'New Analysis', path: '/analysis/new', icon: PlusCircle },
    { name: 'History', path: '/dashboard', icon: History },
    { name: 'Reports', path: '/dashboard', icon: FileText },
    { name: 'Settings', path: '/dashboard', icon: Settings },
  ];

  return (
    <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-gray-100 flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="h-24 flex items-center px-8">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg mr-3">
          <Box className="w-6 h-6 relative z-10" />
          <div className="absolute inset-0 bg-white opacity-20 rounded-xl blur-sm"></div>
        </div>
        <span className="text-xl font-extrabold tracking-tight text-text-main">
          OMNI<span className="text-primary">SENSE</span>
        </span>
      </div>
      
      <nav className="flex-1 py-4 px-4 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm relative overflow-hidden group ` +
                (isActive 
                  ? 'text-primary bg-primary/5 shadow-sm border border-primary/10' 
                  : 'text-text-muted hover:bg-gray-50 hover:text-text-main')
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                    />
                  )}
                  <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`} />
                  <span className="relative z-10">{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
      
      <div className="p-6">
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 bg-accent/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-0 left-0 -ml-4 -mb-4 w-16 h-16 bg-primary/20 rounded-full blur-xl"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center mb-3 text-primary">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
                <Layers className="w-6 h-6" />
              </motion.div>
            </div>
            <p className="text-sm font-bold text-text-main mb-1">OmniSense Pro</p>
            <p className="text-xs text-text-muted mb-3">Enterprise limits active</p>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1.5 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: '65%' }} 
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-gradient-to-r from-primary to-accent h-full rounded-full"
              ></motion.div>
            </div>
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">65% Capacity</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
