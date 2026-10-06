import { Bell, User, Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <header className="h-20 flex items-center justify-between px-8 z-20 backdrop-blur-md bg-white/50 border-b border-white/20 sticky top-0">
      <div className="flex items-center bg-white/80 rounded-full px-4 py-2.5 w-80 border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all">
        <Search className="w-4 h-4 text-gray-400 mr-2" />
        <input 
          type="text" 
          placeholder="Search analyses, claims..." 
          className="bg-transparent border-none outline-none text-sm w-full text-text-main placeholder-gray-400"
        />
      </div>
      <div className="flex items-center space-x-5">
        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center px-3 py-1.5 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full border border-primary/20 text-xs font-semibold text-primary cursor-pointer">
          <Sparkles className="w-3.5 h-3.5 mr-1.5" /> AI Ready
        </motion.div>
        <button className="text-gray-400 hover:text-primary transition-colors relative p-2 bg-white rounded-full shadow-sm border border-gray-100">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border border-white"></span>
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-md text-white cursor-pointer hover:shadow-lg transition-all">
          <User className="w-5 h-5" />
        </div>
      </div>
    </header>
  );
}
