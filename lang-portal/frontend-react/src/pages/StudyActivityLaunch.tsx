import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { getStudyActivityById, getGroupById, groups } from "@/data/mockData";
import { cn } from "@/lib/utils";

const StudyActivityLaunch = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get("group_id");
  const navigate = useNavigate();
  
  const studyActivity = getStudyActivityById(Number(id));
  const group = groupId ? getGroupById(Number(groupId)) : null;
  
  // New state for group selection
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Get all available groups for the combobox
  const availableGroups = groups;
  
  useEffect(() => {
    if (studyActivity && group) {
      // In a real application, this would launch the external activity
      console.log(`Launching activity: ${studyActivity.title} with group: ${group.name}`);
      
      // This would be a good place to create a new study session record
    }
  }, [studyActivity, group]);
  
  const handleLaunchActivity = () => {
    if (selectedGroup) {
      setLoading(true);
      // Simulate loading for a better UX
      setTimeout(() => {
        navigate(`/study_activities/${id}/launch?group_id=${selectedGroup}`);
      }, 500);
    }
  };
  
  if (!studyActivity) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <h1 className="text-xl font-bold mb-4">Activity not found</h1>
            <p className="text-muted-foreground mb-6">
              The requested study activity does not exist.
            </p>
            <Button asChild>
              <Link to="/study_activities">
                Return to Activities
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // If we have an activity but no group, show the group selection
  if (!group) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">Select a Group of Words</h1>
              <p className="text-muted-foreground">
                Choose a group to start {studyActivity.title}
              </p>
            </div>
            
            <div className="space-y-4 mb-6">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    onClick={() => setOpen(!open)} 
                  >
                    {selectedGroup
                      ? availableGroups.find((group) => group.id === selectedGroup)?.name
                      : "Select group..."}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0"> {/* Increased width for better readability */}
                  <Command>
                    <CommandInput placeholder="Search groups..." />
                    <CommandEmpty>No group found.</CommandEmpty>
                    <CommandList> {/* Add CommandList wrapper around CommandGroup */}
                      <CommandGroup>
                        {availableGroups.map((group) => (
                          <CommandItem
                            key={group.id}
                            value={group.name}
                            onSelect={(currentValue) => {
                              const selected = availableGroups.find(g => g.name.toLowerCase() === currentValue.toLowerCase());
                              setSelectedGroup(selected?.id || null);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedGroup === group.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {group.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              
              <Button 
                className="w-full" 
                onClick={handleLaunchActivity} 
                disabled={!selectedGroup || loading}
              >
                {loading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent"></div>
                    Loading...
                  </>
                ) : (
                  "Launch Activity"
                )}
              </Button>
            </div>
            
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
  }
  
  // If we have both activity and group, show the launching screen
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
