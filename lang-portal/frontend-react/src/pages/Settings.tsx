
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isConfirmHistoryOpen, setIsConfirmHistoryOpen] = useState(false);
  const [isConfirmFullResetOpen, setIsConfirmFullResetOpen] = useState(false);
  const { toast } = useToast();

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

  const handleResetHistory = () => {
    // In a real app, this would reset the study history
    toast({
      title: "History Reset",
      description: "All study history has been reset",
    });
    setIsConfirmHistoryOpen(false);
  };

  const handleFullReset = () => {
    // In a real app, this would reset the entire database
    toast({
      title: "Full Reset Completed",
      description: "The entire database has been reset",
    });
    setIsConfirmFullResetOpen(false);
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
        isOpen={isConfirmHistoryOpen}
        onClose={() => setIsConfirmHistoryOpen(false)}
        onConfirm={handleResetHistory}
        title="Reset History"
        description="This will permanently erase all your study sessions and word reviews. Type 'reset history' to confirm."
        confirmWord="reset history"
        confirmButtonText="Reset History"
      />

      {/* Full Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmFullResetOpen}
        onClose={() => setIsConfirmFullResetOpen(false)}
        onConfirm={handleFullReset}
        title="Full Reset"
        description="This will permanently erase ALL data in the database. Type 'full reset' to confirm."
        confirmWord="full reset"
        confirmButtonText="Full Reset"
        variant="destructive"
      />
    </div>
  );
};

export default Settings;
