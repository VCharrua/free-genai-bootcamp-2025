
import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SoundButtonProps {
  word: string;
  language: "portuguese" | "kimbundu";
  className?: string;
}

const SoundButton = ({ word, language, className }: SoundButtonProps) => {
  const playSound = () => {
    // In a real app, this would play the actual pronunciation
    // For now, we'll just use the Web Speech API as a placeholder
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = language === "portuguese" ? "pt-PT" : "en-US"; // Using English for Kimbundu as a fallback
    window.speechSynthesis.speak(utterance);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn("sound-button", className)}
            onClick={playSound}
            aria-label={`Hear pronunciation for ${word}`}
          >
            <Volume2 size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Hear {language} pronunciation</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SoundButton;
