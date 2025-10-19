import { PropsWithChildren } from "react";
import { ClassNameValue } from "tailwind-merge";

// custom
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../tooltip";
import Typography from "./typography";

const ToolTip: React.FC<ToolTipProps> = ({
  children,
  content,
  className,
  side = "bottom",
  align = "center",
}) => {



  // tooltip for desktop
   return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>{children}</TooltipTrigger>
          <TooltipContent
            align={align}
            side={side}
            className={cn("text-justify", className)}
          >
            <Typography variant="small">{content}</Typography>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
};

export default ToolTip;

interface ToolTipProps extends PropsWithChildren {
  content: string;
  className?: ClassNameValue;
  side?: "bottom" | "top" | "right" | "left";
  align?: "center" | "end" | "start";
  hideOnMobile?: boolean;
}
