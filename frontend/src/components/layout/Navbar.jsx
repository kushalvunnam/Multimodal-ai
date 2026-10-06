import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, User, Search, Sparkles, Settings, LogOut, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { checkHealth } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'ai', 'notifications', 'profile', null
  const [healthStatus, setHealthStatus] = useState(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const aiRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const { user, logout } = useAuth();

  // Close dropdowns on click outside or escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) setIsSearchOpen(false);
      if (activeDropdown === 'ai' && aiRef.current && !aiRef.current.contains(event.target)) setActiveDropdown(null);
      if (activeDropdown === 'notifications' && notifRef.current && !notifRef.current.contains(event.target)) setActiveDropdown(null);
      if (activeDropdown === 'profile' && profileRef.current && !profileRef.current.contains(event.target)) setActiveDropdown(null);
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [activeDropdown]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setIsSearchOpen(e.target.value.length > 0);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Since there's no real data, searching does nothing but we could navigate if we had hits
  };

  const toggleDropdown = async (dropdown) => {
    if (activeDropdown === dropdown) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdown);
      if (dropdown === 'ai') {
        setIsCheckingHealth(true);
        try {
          const res = await checkHealth();
          setHealthStatus(res.status === 'ok' ? 'ready' : 'error');
        } catch (error) {
          setHealthStatus('error');
        } finally {
          setIsCheckingHealth(false);
        }
      }
    }
  };

  return (
    <header className="h-20 flex items-center justify-between px-8 z-50 backdrop-blur-md bg-white/50 border-b border-white/20 sticky top-0">
      
      {/* SEARCH */}
      <div className="relative z-50" ref={searchRef}>
        <form onSubmit={handleSearchSubmit} className="flex items-center bg-white/80 rounded-full px-4 py-2.5 w-80 border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => { if (searchQuery) setIsSearchOpen(true); }}
            placeholder="Search analyses, claims..." 
            className="bg-transparent border-none outline-none text-sm w-full text-text-main placeholder-gray-400"
          />
        </form>

        <AnimatePresence>
          {isSearchOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
              className="absolute top-full mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-xl p-4 overflow-hidden"
            >
              <div className="text-sm font-medium text-gray-500 text-center py-4">
                No results found for "{searchQuery}"
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center space-x-5">
        
        {/* AI READY */}
        <div className="relative" ref={aiRef}>
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            onClick={() => toggleDropdown('ai')}
            className="flex items-center px-3 py-1.5 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full border border-primary/20 text-xs font-semibold text-primary cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> AI Ready
          </motion.button>

          <AnimatePresence>
            {activeDropdown === 'ai' && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50 p-5"
              >
                <h3 className="text-sm font-bold text-gray-800 mb-3 border-b border-gray-100 pb-2">System Status</h3>
                {isCheckingHealth ? (
                  <div className="flex items-center text-gray-500 text-sm font-medium py-2">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" /> Checking backend...
                  </div>
                ) : healthStatus === 'ready' ? (
                  <div className="space-y-3">
                    <div className="flex items-center text-emerald-600 text-sm font-semibold">
                      <CheckCircle className="w-4 h-4 mr-2" /> Backend Connected
                    </div>
                    <div className="flex items-center text-emerald-600 text-sm font-semibold">
                      <CheckCircle className="w-4 h-4 mr-2" /> AI Engine Ready
                    </div>
                    <div className="flex items-center text-emerald-600 text-sm font-semibold">
                      <CheckCircle className="w-4 h-4 mr-2" /> Vision Analysis Available
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center text-red-500 text-sm font-bold py-2">
                    <XCircle className="w-4 h-4 mr-2" /> Backend unavailable
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* NOTIFICATIONS */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => toggleDropdown('notifications')}
            className="text-gray-400 hover:text-primary transition-colors relative p-2 bg-white rounded-full shadow-sm border border-gray-100"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border border-white"></span>
          </button>
          
          <AnimatePresence>
            {activeDropdown === 'notifications' && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-3 w-72 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50 p-4"
              >
                <h3 className="text-sm font-bold text-gray-800 mb-2 border-b border-gray-100 pb-2">Notifications</h3>
                <div className="text-sm font-medium text-gray-500 text-center py-6">
                  No new notifications
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* PROFILE */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => toggleDropdown('profile')}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-md text-white cursor-pointer hover:shadow-lg transition-all focus:outline-none"
          >
            <User className="w-5 h-5" />
          </button>

          <AnimatePresence>
            {activeDropdown === 'profile' && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-3 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50 py-2"
              >
                <div className="px-4 py-2 border-b border-gray-50 mb-1">
                  <p className="text-sm font-bold text-gray-800 truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
                </div>
                
                <Link to="/settings" onClick={() => setActiveDropdown(null)} className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors">
                  <User className="w-4 h-4 mr-2" /> Profile
                </Link>
                <Link to="/settings" onClick={() => setActiveDropdown(null)} className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors">
                  <Settings className="w-4 h-4 mr-2" /> Settings
                </Link>
                <button onClick={() => { setActiveDropdown(null); logout(); }} className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors mt-1 border-t border-gray-50 pt-2">
                  <LogOut className="w-4 h-4 mr-2" /> Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
}

