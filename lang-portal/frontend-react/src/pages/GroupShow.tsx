import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DataTable from "@/components/ui/DataTable";
import SoundButton from "@/components/ui/SoundButton";
import { Badge } from "@/components/ui/badge";
import { useGroup, useGroupWords } from "@/hooks/groups/useGroups";

const GroupShow = () => {
  const { id } = useParams<{ id: string }>();
  const [mounted, setMounted] = useState(false);
  
  const { group, loading: loadingGroup, error: groupError } = useGroup(Number(id));
  const { 
    items: words, 
    pagination, 
    loading: loadingWords, 
    error: wordsError, 
    page,
    handlePageChange 
  } = useGroupWords(Number(id));
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Loading states
  if (loadingGroup || loadingWords) 
    return <div><h2 className="text-xl font-semibold tracking-tight text-muted-foreground">Loading group data...</h2></div>;
  
  // Error states
  if (groupError) 
    return <div><h2 className="text-xl font-semibold tracking-tight text-muted-foreground">Error loading group</h2></div>;
  
  // Group not found
  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-xl font-medium mb-4">Group not found</p>
        <Button asChild>
          <Link to="/groups">Back to Groups</Link>
        </Button>
      </div>
    );
  }
  
  const columns = [
    {
      key: "portuguese",
      header: "Portuguese",
      sortable: true,
      cell: (word: any) => (
        <div className="flex items-center gap-2">
          <SoundButton word={word.portuguese} language="portuguese" />
          <Link 
            to={`/words/${word.id}`} 
            className="font-medium text-foreground hover:text-primary transition-colors"
          >
            {word.portuguese}
          </Link>
        </div>
      ),
    },
    {
      key: "kimbundu",
      header: "Kimbundu",
      sortable: true,
      cell: (word: any) => (
        <div className="flex items-center gap-2">
          <SoundButton word={word.kimbundu} language="kimbundu" />
          <span>{word.kimbundu}</span>
        </div>
      ),
    },
    {
      key: "english",
      header: "English",
      sortable: true,
      cell: (word: any) => <span>{word.english}</span>,
    },
    {
      key: "correct_count",
      header: "Correct Count",
      sortable: true,
      cell: (word: any) => (
        <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50 border-green-200">
          {word.correct_count}
        </Badge>
      ),
    },
    {
      key: "wrong_count",
      header: "Wrong Count",
      sortable: true,
      cell: (word: any) => (
        <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50 border-red-200">
          {word.wrong_count}
        </Badge>
      ),
    },
  ];
  
  return (
    <div className={mounted ? 'animate-fade-in space-y-8' : 'opacity-0'}>
      <div>
        <Button 
          variant="ghost" 
          size="sm" 
          asChild 
          className="mb-2 text-muted-foreground hover:text-foreground"
        >
          <Link to="/groups" className="flex items-center gap-1">
            <ChevronLeft size={16} />
            Back to Groups
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{group.name}</h1>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <h2 className="text-lg font-medium">Group Information</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Words</h3>
              <span className="text-lg font-medium">{group.stats.total_words_count}</span>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Group Review Percentage</h3>
              <span className="text-lg font-medium">{group.stats.reviewed_percentage || 0}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Words in this Group</h2>
        
        {wordsError ? (
          <div className="text-red-500">Error loading words</div>
        ) : (
          <DataTable 
            data={words} 
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

export default GroupShow;
