import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { useDashboardData } from "@/hooks/dashboard/useDashboardData";
import { useResetHistory } from "@/hooks/study_sessions/useStudySessions"; // Add this import

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isConfirmHistoryOpen, setIsConfirmHistoryOpen] = useState(false);
  const [isConfirmFullResetOpen, setIsConfirmFullResetOpen] = useState(false);
  const { toast } = useToast();
  const { fullReset, isResetting, refreshAllData } = useDashboardData();
  
  // Connect the hook and pass the refreshAllData callback
  const { resetHistory, loading: isHistoryResetting, error: historyResetError, success: historyResetSuccess } = useResetHistory();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, this would update the theme
    const newMode = !isDarkMode ? "dark" : "light";
    document.documentElement.classList.toggle("dark", !isDarkMode);

    // document.documentElement.classList.remove('dark');
    // document.documentElement.classList.add('orange-ang');

    toast({
      title: "Theme Updated",
      description: `Theme set to ${newMode} mode`,
    });
  };

  const handleResetHistory = async () => {
    try {
      // Call resetHistory without expecting a return value
      await resetHistory();
      
      // Check the success state from the hook
      if (historyResetSuccess) {
        toast({
          title: "History Reset",
          description: "All study history has been reset",
        });
        
        // Refresh dashboard data after successful reset
        refreshAllData();
      } else if (historyResetError) {
        toast({
          title: "Reset Failed",
          description: historyResetError.message || "An error occurred while resetting history",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Reset Failed",
        description: "An error occurred while resetting history",
        variant: "destructive",
      });
      console.error("History reset error:", error);
    } finally {
      setIsConfirmHistoryOpen(false);
    }
  };

  const handleFullReset = async () => {
    try {
      const success = await fullReset();
      if (success) {
        toast({
          title: "Full Reset Completed",
          description: "The entire database has been reset",
        });
      } else {
        toast({
          title: "Reset Failed",
          description: "An error occurred while resetting the database",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Reset Failed",
        description: "An error occurred while resetting the database",
        variant: "destructive",
      });
      console.error("Full reset error:", error);
    } finally {
      setIsConfirmFullResetOpen(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure your app preferences and data
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Configure how the app looks and feels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground">
                Toggle between light and dark mode
              </p>
            </div>
            <Switch
              checked={isDarkMode}
              onCheckedChange={toggleDarkMode}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertCircle size={18} />
            <span>Danger Zone</span>
          </CardTitle>
          <CardDescription>
            These actions cannot be undone
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="font-medium">Reset History</p>
            <p className="text-sm text-muted-foreground mb-2">
              This will reset all study sessions and word reviews
            </p>
            <Button
              variant="outline"
              className="text-destructive border-destructive/50 hover:bg-destructive/10"
              onClick={() => setIsConfirmHistoryOpen(true)}
            >
              Reset History
            </Button>
          </div>

          <Separator />

          <div>
            <p className="font-medium">Full Reset</p>
            <p className="text-sm text-muted-foreground mb-2">
              This will reset the entire database including all words, groups, and history
            </p>
            <Button
              variant="destructive"
              onClick={() => setIsConfirmFullResetOpen(true)}
            >
              Full Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reset History Confirmation Dialog */}
      <ConfirmDialog
        open={isConfirmHistoryOpen}
        onOpenChange={setIsConfirmHistoryOpen}
        onConfirm={handleResetHistory}
        title="Reset History"
        description="This will permanently erase all your study sessions and word reviews. Type 'reset history' to confirm."
        confirmationString="reset history"
        confirmText={isHistoryResetting ? "Resetting..." : "Reset History"}
        disabled={isHistoryResetting}
      />

      {/* Full Reset Confirmation Dialog */}
      <ConfirmDialog
        open={isConfirmFullResetOpen}
        onOpenChange={setIsConfirmFullResetOpen}
        onConfirm={handleFullReset}
        title="Full Reset"
        description="This will permanently erase ALL data in the database. Type 'full reset' to confirm."
        confirmationString="full reset"
        confirmText={isResetting ? "Resetting..." : "Full Reset"}
        destructive={true}
        disabled={isResetting}
      />
    </div>
  );
};

export default Settings;
