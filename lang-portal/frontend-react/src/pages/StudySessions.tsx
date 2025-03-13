import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/badge";
import { useStudySessions } from "@/hooks/study-sessions/useStudySessions";

const StudySessions = () => {
  const [mounted, setMounted] = useState(false);
  const { 
    items: sessions, 
    pagination, 
    loading, 
    error, 
    page,
    handlePageChange 
  } = useStudySessions();
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (loading) return <div><h2 className="text-xl font-semibold tracking-tight text-muted-foreground">Loading study sessions...</h2></div>;
  if (error) return <div><h2 className="text-xl font-semibold tracking-tight text-muted-foreground">Error loading study sessions</h2></div>;
  
  const columns = [
    {
      key: "activity_name",
      header: "Activity Name",
      sortable: true,
      cell: (session: any) => (
        <Link 
          to={`/study_activities/${session.study_activity_id}`} 
          className="font-medium text-foreground hover:text-primary transition-colors"
        >
          {session.activity_name}
        </Link>
      ),
    },
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
      cell: (session: any) => (
        <Badge variant="outline">
          {session.correct_count + session.wrong_count}
        </Badge>
      ),
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
    <div className={`${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Study Sessions</h1>
        <p className="text-muted-foreground mt-1">
          View all your completed study sessions
        </p>
      </div>
      
      <DataTable 
        data={sessions} 
        columns={columns}
        pagination={{
          currentPage: page,
          totalPages: pagination?.total_pages || 1,
          onPageChange: handlePageChange
        }}
      />
    </div>
  );
};

export default StudySessions;
