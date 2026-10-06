import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex h-screen bg-background text-text-main font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px] -z-10 pointer-events-none -translate-x-1/3 translate-y-1/3"></div>
        
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8 z-10 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
