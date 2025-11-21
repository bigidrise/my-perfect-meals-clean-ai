import { Info } from "lucide-react";
import { forwardRef } from "react";

interface InfoIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: number;
}

const InfoIconButton = forwardRef<HTMLButtonElement, InfoIconButtonProps>(
  ({ size = 24, className = "", title = "More information", ...props }, ref) => {
    const iconSize = size * 0.9; // 28.8px icon in 32px button (much larger than the original 24px)

    return (
      <button
        ref={ref}
        title={title}
        className={`
          bg-yellow-500 hover:bg-yellow-600
          border-2 border-yellow-400
          text-black rounded-2xl
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