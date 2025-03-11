
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CalendarIcon, ClockIcon, BookOpenIcon, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { studySessions } from "@/data/mockData";

const StudySessionShow = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  
  // Find the study session from the mock data
  const session = studySessions.find(s => s.id === Number(id));
  
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold mb-4">Session not found</h2>
        <Button asChild>
          <Link to="/study_sessions">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all sessions
          </Link>
        </Button>
      </div>
    );
  }
  
  // Mocked session details
  const sessionDetails = {
    duration: "45 minutes",
    correctAnswers: 18,
    incorrectAnswers: 6,
    accuracy: 75,
    wordsReviewed: session.reviewItemsCount,
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link to="/study_sessions">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Study Session Details</h1>
          <p className="text-muted-foreground">
            Session #{session.id} - {session.studyActivityName}
          </p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Session Overview</CardTitle>
            <CardDescription>
              Key details about this study session
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-y-4">
              <div className="flex items-center gap-2">
                <BookOpenIcon className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Activity</p>
                  <p className="font-medium">{session.studyActivityName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Group</p>
                  <Link 
                    to={`/groups/${session.groupId}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {session.groupName}
                  </Link>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Start Time</p>
                  <p className="font-medium">{session.startTime}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">End Time</p>
                  <p className="font-medium">{session.endTime}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
            <CardDescription>
              Performance metrics for this study session
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{sessionDetails.duration}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Words Reviewed</p>
                <p className="font-medium">{sessionDetails.wordsReviewed}</p>
              </div>
              
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Correct</p>
                  <p className="font-medium">{sessionDetails.correctAnswers}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5">
                <XCircle className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Incorrect</p>
                  <p className="font-medium">{sessionDetails.incorrectAnswers}</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Accuracy Rate</p>
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${sessionDetails.accuracy}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{sessionDetails.accuracy}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Word Review Details</CardTitle>
            <CardDescription>
              Performance breakdown by individual words
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <p>Detailed word review data would be displayed here in a real application</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudySessionShow;
