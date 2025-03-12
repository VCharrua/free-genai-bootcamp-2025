
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Folder, 
  Clock, 
  Settings, 
  ChevronLeft, 
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  const navigationItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard
    },
    {
      name: "Study Activities",
      path: "/study-activities",
      icon: BookOpen
    },
    {
      name: "Words",
      path: "/words",
      icon: FileText
    },
    {
      name: "Word Groups",
      path: "/groups",
      icon: Folder
    },
    {
      name: "Study Sessions",
      path: "/study_sessions",
      icon: Clock
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings
    }
  ];
  
  return (
    <aside className={cn(
      "w-60 h-full bg-white dark:bg-sidebar border-r border-border transition-all duration-300 flex flex-col z-20",
      isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16"
    )}>
      <div className="p-4 border-b border-border flex items-center justify-between h-16">
        <div className={cn("overflow-hidden transition-all duration-300", 
          isOpen ? "w-full opacity-100" : "w-0 opacity-0 md:hidden"
        )}>
          <h1 className="font-semibold tracking-tight text-lg">
            My Language Portal
          </h1>
        </div>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-md bg-secondary text-muted-foreground hover:text-foreground 
            hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
      
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-2 px-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
              
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2.5 text-sm rounded-md transition-all duration-300 group",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <item.icon size={18} className={cn(
                    isActive ? "" : "group-hover:text-foreground", 
                    "transition-transform group-hover:scale-110 duration-300"
                  )} />
                  <span className={cn(
                    "ml-3 transition-all duration-300",
                    isOpen ? "opacity-100" : "opacity-0 w-0 md:hidden"
                  )}>
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className={cn(
        "p-4 border-t border-border flex items-center justify-center",
        isOpen ? "opacity-100" : "opacity-0 md:hidden"
      )}>
        <div className="text-xs text-muted-foreground">
          © 2025 Vitor Charrua
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
