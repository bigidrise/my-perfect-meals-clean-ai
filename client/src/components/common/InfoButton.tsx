import React from "react";
import { InfoIcon } from "./InfoIcon";
import { useCopilot } from "@/components/copilot/CopilotContext";

interface InfoButtonProps {
  featureId: string; // e.g. "fridge-rescue"
  size?: number;
}

export const InfoButton: React.FC<InfoButtonProps> = ({
  featureId,
  size = 17,
}) => {
  const { runAction, open } = useCopilot();

  const handleClick = () => {
    open(); // open copilot sheet
    runAction({
      type: "run-command",
      id: `explain.${featureId}`,
    });
  };

  return <InfoIcon size={size} glow onClick={handleClick} />;
};
