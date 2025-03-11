
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DataTable from "@/components/ui/DataTable";
import SoundButton from "@/components/ui/SoundButton";
import { getGroupById, getWordsByGroupId } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";

const GroupShow = () => {
  const { id } = useParams<{ id: string }>();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const group = getGroupById(Number(id));
  
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
  
  const words = getWordsByGroupId(Number(id));
  
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
      key: "correctCount",
      header: "Correct Count",
      sortable: true,
      cell: (word: any) => (
        <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50 border-green-200">
          {word.correctCount}
        </Badge>
      ),
    },
    {
      key: "wrongCount",
      header: "Wrong Count",
      sortable: true,
      cell: (word: any) => (
        <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50 border-red-200">
          {word.wrongCount}
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
              <span className="text-lg font-medium">{group.wordCount}</span>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Category</h3>
              <span className="text-lg font-medium">Vocabulary</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Words in this Group</h2>
        
        <DataTable data={words} columns={columns} />
      </div>
    </div>
  );
};

export default GroupShow;
