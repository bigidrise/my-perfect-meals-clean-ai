import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickTourButtonProps {
  onClick: () => void;
  className?: string;
}

export function QuickTourButton({ onClick, className = "" }: QuickTourButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      size="sm"
      className={`h-8 w-8 p-0 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 ${className}`}
      aria-label="How to use this page"
    >
      <HelpCircle className="h-4 w-4 text-white/80" />
    </Button>
  );
}
