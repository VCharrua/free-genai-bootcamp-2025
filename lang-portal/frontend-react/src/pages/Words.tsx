
import { useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "@/components/ui/DataTable";
import SoundButton from "@/components/ui/SoundButton";
import { words } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";

const Words = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Calculate pagination
  const totalPages = Math.ceil(words.length / itemsPerPage);
  const paginatedWords = words.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
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
  
  const pagination = {
    currentPage,
    totalPages,
    onPageChange: setCurrentPage,
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Words</h1>
        <p className="text-muted-foreground mt-1">
          Browse and explore all vocabulary words
        </p>
      </div>
      
      <DataTable 
        data={paginatedWords} 
        columns={columns} 
        pagination={pagination}
      />
    </div>
  );
};

export default Words;
