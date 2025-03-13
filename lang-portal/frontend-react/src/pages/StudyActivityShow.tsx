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
import { useStudyActivity, useStudyActivitySessions } from "@/hooks/study_activities/useStudyActivities";

const StudyActivityShow = () => {
  const { id } = useParams<{ id: string }>();
  const [mounted, setMounted] = useState(false);
  
  const { activity: studyActivity, loading: loadingActivity, error: activityError } = useStudyActivity(Number(id));
  const { 
    items: sessions, 
    pagination, 
    loading: loadingSessions, 
    error: sessionsError,
    page,
    handlePageChange 
  } = useStudyActivitySessions(Number(id));
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Loading states
  if (loadingActivity || loadingSessions) 
    return <div><h2 className="text-xl font-semibold tracking-tight text-muted-foreground">Loading activity data...</h2></div>;
  
  // Error states
  if (activityError) 
    return <div><h2 className="text-xl font-semibold tracking-tight text-muted-foreground">Error loading study activity</h2></div>;
  
  // Activity not found
  if (!studyActivity) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-xl font-medium mb-4">Study activity not found</p>
        <Button asChild>
          <Link to="/study_activities">Back to Study Activities</Link>
        </Button>
      </div>
    );
  }
  
  const columns = [
    {
      key: "group_name",
      header: "Group Name",
      sortable: true,
      cell: (session: any) => (
        <Link 
          to={`/groups/${session.group_id}`}
          className="font-medium text-primary hover:underline"
        >
          {session.group_name}
        </Link>
      ),
    },
    {
      key: "created_at",
      header: "Start Time",
      sortable: true,
      cell: (session: any) => <span>{new Date(session.created_at).toLocaleString()}</span>,
    },
    {
      key: "end_time",
      header: "End Time",
      sortable: true,
      cell: (session: any) => <span>{session.end_time ? new Date(session.end_time).toLocaleString() : 'N/A'}</span>,
    },
    {
      key: "review_items_count",
      header: "Review Items",
      sortable: true,
      cell: (session: any) => <span>{session.correct_count + session.wrong_count}</span>,
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
            <Link to="/study_activities" className="flex items-center gap-1">
              <ChevronLeft size={16} />
              Back to Activities
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{studyActivity.name}</h1>
        </div>
        
        <Button 
          className="flex items-center gap-1.5" 
          asChild
        >
          <Link to={`/study_activities/${id}/launch`}>
            <ExternalLink size={16} />
            Launch Activity
          </Link>
        </Button>
      </div>
      
      <Card className="overflow-hidden">
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={studyActivity.preview_url} 
            alt={studyActivity.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <CardHeader>
          <CardTitle>{studyActivity.name}</CardTitle>
          <CardDescription>{studyActivity.description}</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Calendar size={16} className="text-muted-foreground" />
              <span className="text-sm">First released: {studyActivity.release_date || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={16} className="text-muted-foreground" />
              <span className="text-sm">Average duration: {studyActivity.average_duration || 'N/A'} minutes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText size={16} className="text-muted-foreground" />
              <span className="text-sm">{studyActivity.focus || 'Learning activity'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Activity Sessions</h2>
        
        {sessionsError && (
          <div className="text-red-500 mb-4">Error loading sessions</div>
        )}
        
        {!sessionsError && sessions.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <p className="text-muted-foreground mb-4">No sessions found for this activity</p>
              <Button onClick={() => window.open(`/study_activities/${id}/launch`, "_blank")}>
                Start Your First Session
              </Button>
            </CardContent>
          </Card>
        ) : (
          <DataTable 
            data={sessions} 
            columns={columns} 
            pagination={{
              currentPage: page,
              totalPages: pagination?.total_pages || 1,
              onPageChange: handlePageChange
            }}
          />
        )}
      </div>
    </div>
  );
};

export default StudyActivityShow;
