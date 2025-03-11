
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const Breadcrumb = () => {
  const location = useLocation();
  
  const breadcrumbs = useMemo(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    
    // Build breadcrumb items array
    const items = [{ name: "Dashboard", path: "/dashboard" }];
    
    let currentPath = "";
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Skip dashboard since it's already the first item
      if (segment === "dashboard") return;
      
      // Handle path parameters (items with IDs)
      if (segment.match(/^\d+$/) && index > 0) {
        // For path parameters, use the previous segment name + "Details"
        const previousSegment = pathSegments[index - 1];
        let name = "Details";
        
        // Make singular form for detail views
        if (previousSegment === "words") name = "Word Details";
        else if (previousSegment === "groups") name = "Group Details";
        else if (previousSegment === "study_activities") name = "Activity Details";
        else if (previousSegment === "study_sessions") name = "Session Details";
        
        items.push({ name, path: currentPath });
        return;
      }
      
      // Format segment names
      let name = segment.replace(/-|_/g, " ");
      name = name.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
      
      // Special case for launch
      if (segment === "launch") name = "Launch Activity";
      
      items.push({ name, path: currentPath });
    });
    
    return items;
  }, [location.pathname]);
  
  // Only show breadcrumb if we're not on the dashboard
  if (location.pathname === "/dashboard") return null;
  
  return (
    <nav className="bg-background border-b border-border py-3 px-6">
      <ol className="flex items-center space-x-1.5 text-sm">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li 
              key={item.path} 
              className="flex items-center"
            >
              {index === 0 ? (
                <Link
                  to={item.path}
                  className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Dashboard"
                >
                  <Home size={14} />
                </Link>
              ) : (
                <>
                  <ChevronRight size={14} className="mx-1.5 text-muted-foreground" />
                  {isLast ? (
                    <span className="font-medium breadcrumb-active">
                      {item.name}
                    </span>
                  ) : (
                    <Link
                      to={item.path}
                      className="breadcrumb-item"
                    >
                      {item.name}
                    </Link>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
