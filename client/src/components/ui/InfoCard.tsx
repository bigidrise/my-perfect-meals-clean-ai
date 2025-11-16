
import { X, Info } from "lucide-react";

interface InfoCardProps {
  title: string;
  content: string | React.ReactNode;
  onClose: () => void;
  className?: string;
}

export default function InfoCard({
  title,
  content,
  onClose,
  className = ""
}: InfoCardProps) {
  return (
    <div 
      className={`
        absolute z-50 right-0 top-9 w-72 
        bg-black/30 text-white rounded-2xl 
        shadow-2xl backdrop-blur-xl 
        border border-white/20 p-4 
        animate-fadeIn
        ${className}
      `}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-sky-300 flex items-center gap-2">
          <Info className="w-4 h-4" />
          {title}
        </h4>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white/90 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="text-xs text-white/80 leading-relaxed">
        {typeof content === 'string' ? <p>{content}</p> : content}
      </div>
    </div>
  );
}
