import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, XCircle, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import SoundButton from "@/components/ui/SoundButton";
import { useWord } from "@/hooks/words/useWords";

const WordShow = () => {
  const { id } = useParams<{ id: string }>();
  const [mounted, setMounted] = useState(false);
  
  // Fetch word using hook instead of mock data
  const { word, loading, error } = useWord(Number(id));
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Handle loading state
  if (loading) {
    return <div><h2 className="text-xl font-semibold tracking-tight text-muted-foreground">Loading word data...</h2></div>;
  }
  
  // Handle error state
  if (error) {
    return <div><h2 className="text-xl font-semibold tracking-tight text-muted-foreground">Error loading word data</h2></div>;
  }
  
  // Word not found
  if (!word) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-xl font-medium mb-4">Word not found</p>
        <Button asChild>
          <Link to="/words">Back to Words</Link>
        </Button>
      </div>
    );
  }

  // Extract groups from the word object
  const groups = word.groups || [];
  
  const accuracy = word.stats.correct_count + word.stats.wrong_count > 0
    ? Math.round((word.stats.correct_count / (word.stats.correct_count + word.stats.wrong_count)) * 100)
    : 0;
  
  return (
    <div className={mounted ? 'animate-fade-in space-y-8' : 'opacity-0'}>
      <div>
        <Button 
          variant="ghost" 
          size="sm" 
          asChild 
          className="mb-2 text-muted-foreground hover:text-foreground"
        >
          <Link to="/words" className="flex items-center gap-1">
            <ChevronLeft size={16} />
            Back to Words
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{word.portuguese}</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <h2 className="text-lg font-medium">Word Information</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Portuguese</h3>
              <div className="flex items-center gap-2">
                <SoundButton word={word.portuguese} language="portuguese" />
                <span className="text-lg font-medium">{word.portuguese}</span>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Kimbundu</h3>
              <div className="flex items-center gap-2">
                <SoundButton word={word.kimbundu} language="kimbundu" />
                <span className="text-lg font-medium">{word.kimbundu}</span>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">English</h3>
              <span className="text-lg font-medium">{word.english}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <h2 className="text-lg font-medium">Study Statistics</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                <span className="text-sm font-medium text-muted-foreground">Correct</span>
                <span className="text-2xl font-bold">{word.stats.correct_count}</span>
              </div>
              
              <div className="flex flex-col items-center justify-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <XCircle className="h-8 w-8 text-red-500 mb-2" />
                <span className="text-sm font-medium text-muted-foreground">Wrong</span>
                <span className="text-2xl font-bold">{word.stats.wrong_count}</span>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Accuracy</span>
                <span className="text-sm font-medium">{accuracy}%</span>
              </div>
              <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500" 
                  style={{ width: `${accuracy}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <h2 className="text-lg font-medium">Word Groups</h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {groups.length > 0 ? (
              groups.map(group => (
                <Link key={group.id} to={`/groups/${group.id}`}>
                  <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer transition-colors">
                    {group.name}
                  </Badge>
                </Link>
              ))
            ) : (
              <span className="text-muted-foreground">This word is not in any groups yet.</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WordShow;
