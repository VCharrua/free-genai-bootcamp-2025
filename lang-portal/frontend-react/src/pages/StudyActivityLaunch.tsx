
import { useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getStudyActivityById, getGroupById } from "@/data/mockData";

const StudyActivityLaunch = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get("group_id");
  
  const studyActivity = getStudyActivityById(Number(id));
  const group = groupId ? getGroupById(Number(groupId)) : null;
  
  useEffect(() => {
    // In a real application, this would launch the external activity
    // For now, we just log to the console
    console.log(`Launching activity: ${studyActivity?.title} with group: ${group?.name}`);
    
    // This would be a good place to create a new study session record
  }, [studyActivity, group]);
  
  if (!studyActivity || !group) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <h1 className="text-xl font-bold mb-4">
              {!studyActivity ? "Activity not found" : "Group not found"}
            </h1>
            <p className="text-muted-foreground mb-6">
              {!studyActivity 
                ? "The requested study activity does not exist." 
                : "Please provide a valid group ID to launch this activity."}
            </p>
            <Button asChild>
              <Link to={!studyActivity ? "/study_activities" : `/study_activities/${id}`}>
                Return to {!studyActivity ? "Activities" : studyActivity.title}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">Launching Activity</h1>
            <p className="text-muted-foreground">
              {studyActivity.title} with {group.name} group
            </p>
          </div>
          
          <div className="flex justify-center">
            {/* Animated loading indicator */}
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-r-transparent">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-6">
            The activity should launch automatically. If it doesn't, please check your popup blocker settings.
          </p>
          
          <div className="mt-6 flex justify-center">
            <Button variant="outline" asChild className="flex items-center gap-1.5">
              <Link to={`/study_activities/${id}`}>
                <ArrowLeft size={16} />
                Back to Activity
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyActivityLaunch;
