import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DataTable from "@/components/ui/DataTable";
import SoundButton from "@/components/ui/SoundButton";
import { Badge } from "@/components/ui/badge";
import { useWords } from "@/hooks/words/useWords";

const Words = () => {
  const [mounted, setMounted] = useState(false);
  const { 
    items: words, 
    pagination, 
    loading, 
    error, 
    page,
    handlePageChange 
  } = useWords();
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (loading) return <div><h2 className="text-xl font-semibold tracking-tight text-muted-foreground">Loading words...</h2></div>;
  if (error) return <div><h2 className="text-xl font-semibold tracking-tight text-muted-foreground">Error loading words</h2></div>;
  
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
    <div className={`${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Words</h1>
        <p className="text-muted-foreground mt-1">
          Browse and explore all vocabulary words
        </p>
      </div>
      
      <DataTable 
        data={words} 
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

export default Words;
