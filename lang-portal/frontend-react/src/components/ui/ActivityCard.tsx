
import { ExternalLink, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface ActivityCardProps {
  id: number;
  title: string;
  thumbnail: string;
  className?: string;
  style?: React.CSSProperties;
}

const ActivityCard = ({ id, title, thumbnail, className, style }: ActivityCardProps) => {
  
  //TODO: Remover esta função
  /*
  const handleLaunch = (groupId = 4) => {
    // Open in a new tab
    window.open(`/study_activities/${id}/launch?group_id=${groupId}`, "_blank");
  };
  */


  return (
    <Card className={cn(
      "overflow-hidden card-hover",
      className
    )} style={style}>
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={thumbnail || "/placeholder.svg"}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
        />
      </div>
      
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button 
          variant="default" 
          size="sm"
          className="transition-all duration-300 gap-1.5"
          //onClick={() => handleLaunch()}
          asChild
        >
          <Link to={`/study_activities/${id}/launch`}>
            <ExternalLink size={15} />
            Launch
          </Link>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="transition-all duration-300 gap-1.5"
          asChild
        >
          <Link to={`/study_activities/${id}`}>
            <Info size={15} />
            View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ActivityCard;
