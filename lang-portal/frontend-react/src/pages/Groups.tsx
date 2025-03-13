import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DataTable from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/badge";
import { Folder } from "lucide-react";
import { useGroups } from "@/hooks/groups/useGroups";

const Groups = () => {
  const [mounted, setMounted] = useState(false);
  const { 
    items: groups, 
    pagination, 
    loading, 
    error, 
    page,
    handlePageChange
  } = useGroups();
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (loading) return <div><h2 className="text-xl font-semibold tracking-tight text-muted-foreground">Loading groups...</h2></div>;
  if (error) return <div><h2 className="text-xl font-semibold tracking-tight text-muted-foreground">Error loading groups data</h2></div>;
  
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
      key: "words_count",
      header: "Words Count",
      sortable: true,
      cell: (group: any) => (
        <Badge variant="outline" className="bg-primary/5 border-primary/20">
          {group.words_count} {group.words_count === 1 ? "word" : "words"}
        </Badge>
      ),
    },
  ];
  
  return (
    <div className={`${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Word Groups</h1>
        <p className="text-muted-foreground mt-1">
          Browse and explore word groups and categories
        </p>
      </div>
      
      <DataTable 
        data={groups} 
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

export default Groups;
