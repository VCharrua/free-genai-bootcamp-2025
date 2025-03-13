
import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Banner from "./Banner";
import Breadcrumb from "./Breadcrumb";

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    // Add a subtle animation when changing routes
    const main = document.getElementById('main-content');
    if (main) {
      main.classList.remove('animate-fade-in');
      // Force a reflow
      void main.offsetWidth;
      main.classList.add('animate-fade-in');
    }
  }, [location.pathname]);
  
  return (
    <div className="flex h-screen overflow-hidden bg-background transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <main 
        id="main-content"
        className="flex-1 flex flex-col overflow-hidden transition-all duration-300 animate-fade-in"
        style={{ 
          marginLeft: isSidebarOpen ? '0' : '-240px',
          width: isSidebarOpen ? 'calc(100% - 240px)' : '100%'
        }}
      >
        <Banner 
          isSidebarOpen={isSidebarOpen} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          isHome={location.pathname === "/dashboard"}
        />
        <Breadcrumb />
        
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
