
import { useState, useEffect } from "react";
import { MenuIcon } from "lucide-react";
import { cn } from "@/lib/utils";
// import backgroundImage from "@/images/image1.jpg"; // Import the image

interface BannerProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isHome: boolean;
}

const Banner = ({ isSidebarOpen, toggleSidebar, isHome }: BannerProps) => {
  const [currentImage, setCurrentImage] = useState("");
  
  useEffect(() => {
    // Generate random number between 1 and 10
    const randomNumber = Math.floor(Math.random() * 6) + 1;
    
    // Dynamically import the image
    import(`/images/image${randomNumber}.jpg`)
      .then(imageModule => {
        setCurrentImage(imageModule.default);
      })
      .catch(error => {
        console.error("Error loading background image:", error);
        // Fallback to image1 if there's an error
        import("/images/image1.jpg").then(fallback => {
          setCurrentImage(fallback.default);
        });
      });
  }, []);
  
  return (
    <div className={cn(
      "bg-gradient-to-r from-primary/90 to-primary text-white transition-all duration-300 relative overflow-hidden",
      isHome ? "py-16" : "py-8"
    )}>

      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: currentImage ? `url(${currentImage})` : 'none' }} 
        /* style={{ backgroundImage: `url(${backgroundImage})` }} */
      />
      
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-primary/50 z-10" />
      

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white opacity-10 rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-white opacity-5 rounded-full" />
      </div>
      
    
      {/* Right-aligned image */}
      <div className={cn("absolute right-0 top-0 bottom-0 z-20 flex items-center ", isHome ? "pb-[30px]" : "pb-[15px]")}>
        <img 
          src="/images/made-in-angola-v3.png" 
          alt="Made in Angola" 
          className={cn(
            "h-full object-contain object-right max-w-none transition-all duration-300",
            isHome ? "max-h-48 md:max-h-80" : "max-h-24 md:max-h-40"
          )}
        />
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
