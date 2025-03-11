
import { useState, useEffect } from "react";
import { studyActivities } from "@/data/mockData";
import ActivityCard from "@/components/ui/ActivityCard";

const StudyActivities = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <div className={mounted ? 'animate-fade-in' : 'opacity-0'}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Study Activities</h1>
        <p className="text-muted-foreground mt-1">
          Choose an activity to practice your Portuguese and Kimbundu
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {studyActivities.map((activity, index) => (
          <ActivityCard
            key={activity.id}
            id={activity.id}
            title={activity.title}
            thumbnail={activity.thumbnail}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          />
        ))}
      </div>
    </div>
  );
};

export default StudyActivities;
