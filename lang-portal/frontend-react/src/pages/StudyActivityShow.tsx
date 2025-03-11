
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  ExternalLink, 
  FileText, 
  ChevronLeft 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DataTable from "@/components/ui/DataTable";
import { getStudyActivityById, getSessionsByActivityId } from "@/data/mockData";

const StudyActivityShow = () => {
  const { id } = useParams<{ id: string }>();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const studyActivity = getStudyActivityById(Number(id));
  
  if (!studyActivity) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-xl font-medium mb-4">Study activity not found</p>
        <Button asChild>
          <Link to="/study-activities">Back to Study Activities</Link>
        </Button>
      </div>
    );
  }
  
  const sessions = getSessionsByActivityId(Number(id));
  
  const columns = [
    {
      key: "groupName",
      header: "Group Name",
      sortable: true,
      cell: (session: any) => (
        <Link 
          to={`/groups/${session.groupId}`}
          className="font-medium text-primary hover:underline"
        >
          {session.groupName}
        </Link>
      ),
    },
    {
      key: "startTime",
      header: "Start Time",
      sortable: true,
      cell: (session: any) => <span>{session.startTime}</span>,
    },
    {
      key: "endTime",
      header: "End Time",
      sortable: true,
      cell: (session: any) => <span>{session.endTime}</span>,
    },
    {
      key: "reviewItemsCount",
      header: "Review Items",
      sortable: true,
      cell: (session: any) => <span>{session.reviewItemsCount}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      cell: (session: any) => (
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/study_sessions/${session.id}`} className="text-primary">
            View Details
          </Link>
        </Button>
      ),
    },
  ];
  
  return (
    <div className={mounted ? 'animate-fade-in space-y-8' : 'opacity-0'}>
      <div className="flex justify-between items-start">
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            asChild 
            className="mb-2 text-muted-foreground hover:text-foreground"
          >
            <Link to="/study-activities" className="flex items-center gap-1">
              <ChevronLeft size={16} />
              Back to Activities
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{studyActivity.title}</h1>
        </div>
        
        <Button 
          className="flex items-center gap-1.5" 
          onClick={() => window.open(`/study_activities/${id}/launch?group_id=4`, "_blank")}
        >
          <ExternalLink size={16} />
          Launch Activity
        </Button>
      </div>
      
      <Card className="overflow-hidden">
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={studyActivity.thumbnail} 
            alt={studyActivity.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <CardHeader>
          <CardTitle>{studyActivity.title}</CardTitle>
          <CardDescription>{studyActivity.description}</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Calendar size={16} className="text-muted-foreground" />
              <span className="text-sm">First released: 2024</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={16} className="text-muted-foreground" />
              <span className="text-sm">Average duration: 20 min</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText size={16} className="text-muted-foreground" />
              <span className="text-sm">Best for vocabulary</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Activity Sessions</h2>
        
        {sessions.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <p className="text-muted-foreground mb-4">No sessions found for this activity</p>
              <Button onClick={() => window.open(`/study_activities/${id}/launch?group_id=4`, "_blank")}>
                Start Your First Session
              </Button>
            </CardContent>
          </Card>
        ) : (
          <DataTable data={sessions} columns={columns} />
        )}
      </div>
    </div>
  );
};

export default StudyActivityShow;
