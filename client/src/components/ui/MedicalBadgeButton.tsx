
import { Shield, Plus } from "lucide-react";

interface MedicalBadgeButtonProps {
  onClick?: () => void;
  title?: string;
  className?: string;
  size?: number;
}

export default function MedicalBadgeButton({
  onClick,
  title = "Medical badges",
  className = "",
  size = 20
}: MedicalBadgeButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`
        bg-amber-500 hover:bg-amber-600
        border-2 border-amber-300
        text-black rounded-xl
        flex items-center justify-center
        transition-colors
        ${className}
      `}
      style={{
        width: `${size}px`,
        height: `${size}px`
      }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <Shield className="w-4 h-4 text-black" strokeWidth={2} />
        <Plus className="w-2 h-2 text-red-600 absolute" strokeWidth={3} />
      </div>
    </button>
  );
}
