import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CalendarIcon, ClockIcon, BookOpenIcon, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getSessionById } from "@/data/mockData"; 
import { calculateDuration } from "@/lib/dateUtils";

const StudySessionShow = () => {
  const { id } = useParams<{ id: string }>();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);
  
  useEffect(() => {
    setMounted(true);
    
    // Simulate API call with mock data
    try {
      const sessionData = getSessionById(Number(id));
      setSession(sessionData);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  }, [id]);
  
  // Loading state
  if (loading) 
    return <div><h2 className="text-xl font-semibold tracking-tight text-muted-foreground">Loading session data...</h2></div>;
  
  // Error state
  if (error) 
    return <div><h2 className="text-xl font-semibold tracking-tight text-muted-foreground">Error loading session data</h2></div>;
  
  // Session not found
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
  
  // Calculate session stats
  const totalAnswers = session.correct_count + session.wrong_count;
  const accuracy = totalAnswers > 0 ? Math.round((session.correct_count / totalAnswers) * 100) : 0;
  const duration = session.end_time && session.created_at ? 
    calculateDuration(new Date(session.created_at), new Date(session.end_time)) :
    "N/A";
  
  return (
    <div className={mounted ? 'animate-fade-in' : 'opacity-0'}>
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link to="/study_sessions" className="flex items-center">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Study Session Details</h1>
          <p className="text-muted-foreground">
            Session #{session.id} - {session.activity_name}
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
                  <p className="font-medium">{session.activity_name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Group</p>
                  <Link 
                    to={`/groups/${session.group_id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {session.group_name}
                  </Link>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Start Time</p>
                  <p className="font-medium">{new Date(session.created_at).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">End Time</p>
                  <p className="font-medium">{session.end_time ? new Date(session.end_time).toLocaleString() : 'N/A'}</p>
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
                <p className="font-medium">{duration}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Words Reviewed</p>
                <p className="font-medium">{totalAnswers}</p>
              </div>
              
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Correct</p>
                  <p className="font-medium">{session.correct_count}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5">
                <XCircle className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Incorrect</p>
                  <p className="font-medium">{session.wrong_count}</p>
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
                    style={{ width: `${accuracy}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{accuracy}%</span>
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
