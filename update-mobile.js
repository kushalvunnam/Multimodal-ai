const fs = require('fs');

let layout = fs.readFileSync('frontend/src/components/layout/Layout.jsx', 'utf8');

const layoutReplacement = `import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen print:h-auto bg-background text-text-main font-sans overflow-hidden print:overflow-visible print:block">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Responsive */}
      <div className={\`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 h-full \${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}\`}>
        <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0 print:overflow-visible print:block relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none translate-x-1/3 -translate-y-1/3 print:hidden"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px] -z-10 pointer-events-none -translate-x-1/3 translate-y-1/3 print:hidden"></div>
        
        <div className="print:hidden">
          <Navbar onMenuClick={() => setMobileMenuOpen(true)} />
        </div>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto print:overflow-visible p-4 md:p-8 z-10 relative print:p-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}`;

layout = layout.replace(/import \{ Outlet \} from 'react-router-dom';[\s\S]*/, layoutReplacement);
fs.writeFileSync('frontend/src/components/layout/Layout.jsx', layout);

let navbar = fs.readFileSync('frontend/src/components/layout/Navbar.jsx', 'utf8');
navbar = navbar.replace('export default function Navbar() {', 'export default function Navbar({ onMenuClick }) {');

// Add hamburger button to the header
const headerStart = `<header className="h-20 flex items-center justify-between px-4 md:px-8 z-50 backdrop-blur-md bg-white/50 border-b border-white/20 sticky top-0">
      <div className="flex items-center">
        <button 
          onClick={onMenuClick}
          className="lg:hidden mr-4 p-2 rounded-xl bg-white border border-gray-100 text-gray-500 hover:text-primary hover:bg-gray-50"
        >
          <Menu className="w-5 h-5" />
        </button>`;

navbar = navbar.replace(`<header className="h-20 flex items-center justify-between px-8 z-50 backdrop-blur-md bg-white/50 border-b border-white/20 sticky top-0">`, headerStart);
navbar = navbar.replace(`import { Search, Bell, User, Settings, LogOut, CheckCircle, XCircle, Sparkles, Loader2 } from 'lucide-react';`, `import { Search, Bell, User, Settings, LogOut, CheckCircle, XCircle, Sparkles, Loader2, Menu } from 'lucide-react';`);

// Fix search bar width on mobile
navbar = navbar.replace(`className="flex items-center bg-white/80 rounded-full px-4 py-2.5 w-80`, `className="flex items-center bg-white/80 rounded-full px-4 py-2.5 w-full md:w-80`);

fs.writeFileSync('frontend/src/components/layout/Navbar.jsx', navbar);
