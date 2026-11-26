import { PropsWithChildren } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";

interface ToolTipProps extends PropsWithChildren {
  content: string;
  side?: "bottom" | "top" | "right" | "left";
  align?: "center" | "end" | "start";
}

/** Thin wrapper over the shadcn Tooltip with a short hover delay. The child must accept a ref (button, link). */
export default function ToolTip({ children, content, side = "bottom", align = "center" }: ToolTipProps) {
  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} align={align} className="max-w-xs">
        {content}
      </TooltipContent>
    </Tooltip>
  );
}
