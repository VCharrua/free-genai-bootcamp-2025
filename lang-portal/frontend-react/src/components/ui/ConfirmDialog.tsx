
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText: string;
  confirmationString: string;
  onConfirm: () => void;
  destructive?: boolean;
}

const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText,
  confirmationString,
  onConfirm,
  destructive = true
}: ConfirmDialogProps) => {
  const [inputValue, setInputValue] = useState("");
  
  const isConfirmDisabled = inputValue !== confirmationString;
  
  const handleConfirm = () => {
    if (inputValue === confirmationString) {
      onConfirm();
      setInputValue("");
      onOpenChange(false);
    }
  };
  
  const handleCancel = () => {
    setInputValue("");
    onOpenChange(false);
  };
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px] animate-scale-in">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4">
          <p className="text-sm mb-2 font-medium">
            Type <span className="font-bold">{confirmationString}</span> to confirm
          </p>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={destructive ? "border-destructive/50 focus-visible:ring-destructive/30" : ""}
            placeholder={confirmationString}
          />
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className={destructive ? "bg-destructive hover:bg-destructive/90" : ""}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDialog;
