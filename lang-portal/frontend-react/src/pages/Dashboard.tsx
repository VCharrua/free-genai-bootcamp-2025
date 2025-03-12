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
import { useDashboardData } from "@/hooks/dashboard/useDashboardData";
import { calculateDuration } from "@/utils/dateUtils";


const Dashboard = () => {
  const [mounted, setMounted] = useState(false);
  const { isLoading, error, lastSession, studyProgress, quickStats, performanceGraph, continueLearning } = useDashboardData();
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (isLoading) return <div>Loading dashboard data...</div>;
  if (error) return <div>Error loading dashboard data</div>;

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
            title="Study Streak" 
            value={`${quickStats.study_streak_days} ${quickStats.study_streak_days === 1 ? 'day' : 'days'}`}
            icon={FileText}
            className="animate-fade-in" 
            style={{ animationDelay: '0ms' }}
          />
          <StatCard 
            title="Study Sessions" 
            value={quickStats.total_study_sessions}
            icon={Calendar}
            className="animate-fade-in" 
            style={{ animationDelay: '100ms' }}
          />
          <StatCard 
            title="Words Learned" 
            value={`${studyProgress.studied_words}/${studyProgress.total_words}`}
            icon={CheckCircle}
            trend={{ value: studyProgress.studied_words_trend, isPositive: true }}
            className="animate-fade-in" 
            style={{ animationDelay: '200ms' }}
          />
          <StatCard 
            title="Accuracy Rate" 
            value={`${quickStats.success_rate}%`}
            icon={BarChart3}
            trend={{ value: quickStats.success_rate_trend, isPositive: true }}
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
                  {lastSession.start_time}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Activity</p>
                    <p className="font-medium">{lastSession.activity_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Group</p>
                    <p className="font-medium">{lastSession.group_name}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Duration</p>
                    <p className="font-medium">
                      {lastSession.end_time && lastSession.start_time ? (
                        calculateDuration(new Date(lastSession.start_time), new Date(lastSession.end_time))
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Words Reviewed</p>
                    <p className="font-medium">{lastSession.correct_count + lastSession.wrong_count}</p>
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
                  <p className="font-medium">{continueLearning[0].group_name}</p>
                  <p className="text-sm text-muted-foreground">{continueLearning[0].total_words_count - continueLearning[0].review_items_count} words remaining</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="text-sm font-medium">{`${continueLearning[0].review_items_count}/${continueLearning[0].total_words_count}`}</div>
                  <div className="h-2 w-16 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '70%' }}></div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{continueLearning[1].group_name}</p>
                  <p className="text-sm text-muted-foreground">{continueLearning[1].total_words_count - continueLearning[1].review_items_count} words remaining</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="text-sm font-medium">{`${continueLearning[1].review_items_count}/${continueLearning[1].total_words_count}`}</div>
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
