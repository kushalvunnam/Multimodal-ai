import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex h-screen print:h-auto bg-background text-text-main font-sans overflow-hidden print:overflow-visible print:block">
      <div className="print:hidden h-full">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden print:overflow-visible print:block relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none translate-x-1/3 -translate-y-1/3 print:hidden"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px] -z-10 pointer-events-none -translate-x-1/3 translate-y-1/3 print:hidden"></div>
        
        <div className="print:hidden">
          <Navbar />
        </div>
        <main className="flex-1 overflow-x-hidden overflow-y-auto print:overflow-visible p-8 z-10 relative print:p-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

