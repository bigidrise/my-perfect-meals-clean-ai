import { Info } from "lucide-react";
import { forwardRef } from "react";

interface InfoIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: number;
}

const InfoIconButton = forwardRef<HTMLButtonElement, InfoIconButtonProps>(
  ({ size = 32, className = "", title = "More information", ...props }, ref) => {
    const iconSize = size * 0.9; // 28.8px icon in 32px button (much larger than the original 24px)

    return (
      <button
        ref={ref}
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
        {...props}
      >
        <Info
          style={{ width: iconSize, height: iconSize }}
          strokeWidth={7.5}
        />
      </button>
    );
  }
);

InfoIconButton.displayName = "InfoIconButton";

export default InfoIconButton;