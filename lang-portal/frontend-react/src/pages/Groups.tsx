
import { useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "@/components/ui/DataTable";
import { groups } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Folder } from "lucide-react";

const Groups = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Calculate pagination
  const totalPages = Math.ceil(groups.length / itemsPerPage);
  const paginatedGroups = groups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const columns = [
    {
      key: "name",
      header: "Group Name",
      sortable: true,
      cell: (group: any) => (
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded-md">
            <Folder size={16} className="text-primary" />
          </div>
          <Link 
            to={`/groups/${group.id}`} 
            className="font-medium text-foreground hover:text-primary transition-colors"
          >
            {group.name}
          </Link>
        </div>
      ),
    },
    {
      key: "wordCount",
      header: "Words Count",
      sortable: true,
      cell: (group: any) => (
        <Badge variant="outline" className="bg-primary/5 border-primary/20">
          {group.wordCount} {group.wordCount === 1 ? "word" : "words"}
        </Badge>
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
        <h1 className="text-2xl font-bold">Word Groups</h1>
        <p className="text-muted-foreground mt-1">
          Browse and explore word groups and categories
        </p>
      </div>
      
      <DataTable 
        data={paginatedGroups} 
        columns={columns} 
        pagination={pagination}
      />
    </div>
  );
};

export default Groups;
