
import { MenuIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BannerProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isHome: boolean;
}

const Banner = ({ isSidebarOpen, toggleSidebar, isHome }: BannerProps) => {
  return (
    <div className={cn(
      "bg-gradient-to-r from-primary/90 to-primary text-white transition-all duration-300 relative overflow-hidden",
      isHome ? "py-16" : "py-8"
    )}>
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white opacity-10 rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-white opacity-5 rounded-full" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="mr-4 p-2 rounded-md bg-white/10 hover:bg-white/20 
              transition-colors duration-200 md:hidden"
            aria-label="Toggle navigation"
          >
            <MenuIcon size={20} />
          </button>
          
          <div>
            <h1 className={cn(
              "font-bold tracking-tight transition-all duration-300",
              isHome ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl"
            )}>
              Language Fusion Portal
            </h1>
            {isHome && (
              <p className="mt-2 text-white/80 max-w-xl animate-fade-in">
                Master Portuguese and Kimbundu through immersive learning
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
