import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ActivityCard from "@/components/ui/ActivityCard";
import { useStudyActivities } from "@/hooks/study_activities/useStudyActivities";

const StudyActivities = () => {
  const [mounted, setMounted] = useState(false);
  const { activities, loading, error } = useStudyActivities();
  const navigate = useNavigate();
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (loading) return <div><h2 className="text-xl font-semibold tracking-tight text-muted-foreground">Loading activities...</h2></div>;
  if (error) return <div><h2 className="text-xl font-semibold tracking-tight text-muted-foreground">Error loading activities</h2></div>;
  
  return (
    <div className={mounted ? 'animate-fade-in' : 'opacity-0'}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Study Activities</h1>
        <p className="text-muted-foreground mt-1">
          Choose an activity to practice your Portuguese and Kimbundu
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {activities.map((activity, index) => (
          <ActivityCard
            id={activity.id}
            title={activity.name}
            thumbnail={activity.preview_url}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          />
        ))}
      </div>
    </div>
  );
};

export default StudyActivities;
