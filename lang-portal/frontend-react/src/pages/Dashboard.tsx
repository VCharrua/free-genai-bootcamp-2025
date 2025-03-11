
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Clock, 
  BarChart3, 
  Calendar, 
  FileText,
  ArrowRight, 
  CheckCircle, 
  XCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import StatCard from "@/components/ui/StatCard";
import { studySessions } from "@/data/mockData";

const Dashboard = () => {
  const [mounted, setMounted] = useState(false);
  
  // Animation effect when component mounts
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Get the most recent study session
  const lastSession = studySessions[0];
  
  // Calculate some statistics for display
  const totalWords = 10; // From mock data
  const totalStudySessions = studySessions.length;
  const wordsLearned = 7;
  const correctPercentage = 75;
  
  return (
    <div className={`space-y-8 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
      <section>
        <div className="flex flex-col gap-2 mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
          <p className="text-muted-foreground">
            Track your language learning progress and continue your studies
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Words" 
            value={totalWords}
            icon={FileText}
            className="animate-fade-in" 
            style={{ animationDelay: '0ms' }}
          />
          <StatCard 
            title="Study Sessions" 
            value={totalStudySessions}
            icon={Calendar}
            className="animate-fade-in" 
            style={{ animationDelay: '100ms' }}
          />
          <StatCard 
            title="Words Learned" 
            value={`${wordsLearned}/${totalWords}`}
            icon={CheckCircle}
            trend={{ value: 10, isPositive: true }}
            className="animate-fade-in" 
            style={{ animationDelay: '200ms' }}
          />
          <StatCard 
            title="Accuracy Rate" 
            value={`${correctPercentage}%`}
            icon={BarChart3}
            trend={{ value: 5, isPositive: true }}
            className="animate-fade-in" 
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </section>
      
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Recent Activity</h3>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/study_sessions" className="gap-1.5">
              View all sessions
              <ArrowRight size={14} />
            </Link>
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {lastSession && (
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock size={18} className="text-primary" />
                  <span>Last Study Session</span>
                </CardTitle>
                <CardDescription>
                  {lastSession.startTime}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Activity</p>
                    <p className="font-medium">{lastSession.studyActivityName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Group</p>
                    <p className="font-medium">{lastSession.groupName}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Duration</p>
                    <p className="font-medium">45 minutes</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Words Reviewed</p>
                    <p className="font-medium">{lastSession.reviewItemsCount}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/study_sessions/${lastSession.id}`}>
                    View Session Details
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )}
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen size={18} className="text-primary" />
                <span>Continue Learning</span>
              </CardTitle>
              <CardDescription>
                Pick up where you left off
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Core Verbs</p>
                  <p className="text-sm text-muted-foreground">3 words remaining</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="text-sm font-medium">7/10</div>
                  <div className="h-2 w-16 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '70%' }}></div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Technology Basics</p>
                  <p className="text-sm text-muted-foreground">2 words remaining</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="text-sm font-medium">2/4</div>
                  <div className="h-2 w-16 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '50%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link to="/study-activities">
                  Start a New Session
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
      
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Performance Overview</h3>
        </div>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Vocabulary Progress</CardTitle>
            <CardDescription>
              Your learning performance over time
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <div className="text-muted-foreground text-sm font-medium">
              Progress chart will be displayed here
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;
