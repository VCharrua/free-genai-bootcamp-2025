
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/DataTable";
import { studySessions } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";

const StudySessions = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Calculate pagination
  const totalPages = Math.ceil(studySessions.length / itemsPerPage);
  const paginatedSessions = studySessions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const columns = [
    {
      key: "studyActivityName",
      header: "Activity Name",
      sortable: true,
      cell: (session: any) => (
        <Link 
          to={`/study_activities/${session.studyActivityId}`} 
          className="font-medium text-foreground hover:text-primary transition-colors"
        >
          {session.studyActivityName}
        </Link>
      ),
    },
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
      cell: (session: any) => (
        <Badge variant="outline">
          {session.reviewItemsCount}
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
  
  const pagination = {
    currentPage,
    totalPages,
    onPageChange: setCurrentPage,
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Study Sessions</h1>
        <p className="text-muted-foreground mt-1">
          View all your completed study sessions
        </p>
      </div>
      
      <DataTable 
        data={paginatedSessions} 
        columns={columns} 
        pagination={pagination}
      />
    </div>
  );
};

export default StudySessions;
