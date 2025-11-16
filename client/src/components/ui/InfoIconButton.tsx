
import { Eye } from "lucide-react";

interface InfoIconButtonProps {
  onClick?: () => void;
  title?: string;
  className?: string;
  size?: number;
}

export default function InfoIconButton({
  onClick,
  title = "More information",
  className = "",
  size = 18
}: InfoIconButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`
        bg-sky-600 hover:bg-sky-700
        border-2 border-sky-400
        text-white rounded-xl
        flex items-center justify-center
        transition-colors
        ${className}
      `}
      style={{
        width: `${size}px`,
        height: `${size}px`
      }}
    >
      <Eye className="w-3.5 h-3.5" strokeWidth={2.25} />
    </button>
  );
}
