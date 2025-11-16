
import { Shield, Plus } from "lucide-react";
import { forwardRef, type ButtonHTMLAttributes } from "react";

interface MedicalBadgeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  size?: number;
  showPulse?: boolean;
}

const MedicalBadgeButton = forwardRef<HTMLButtonElement, MedicalBadgeButtonProps>(
  ({ title = "Medical badges", className = "", size = 20, showPulse = false, ...props }, ref) => {
    return (
      <button
        ref={ref}
        title={title}
        className={`
          relative
          bg-amber-500 hover:bg-amber-600
          border-2 border-amber-300
          text-black rounded-xl
          flex items-center justify-center
          transition-colors
          ${showPulse ? "ring-2 ring-red-500 ring-offset-1" : ""}
          ${className}
        `}
        style={{
          width: `${size}px`,
          height: `${size}px`
        }}
        {...props}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <Shield className="w-4 h-4 text-black" strokeWidth={2} />
          <Plus className="w-2 h-2 text-red-600 absolute" strokeWidth={3} />
        </div>
        {showPulse && (
          <span className="absolute inset-0 rounded-xl border-2 border-red-500 shadow-glow-red animate-ping pointer-events-none" />
        )}
      </button>
    );
  }
);

MedicalBadgeButton.displayName = "MedicalBadgeButton";

export default MedicalBadgeButton;
