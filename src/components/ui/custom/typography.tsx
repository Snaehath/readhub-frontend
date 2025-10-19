"use client";

import { CSSProperties, ReactNode } from "react";
import { ClassNameValue } from "tailwind-merge";
import { useTheme } from "next-themes";

// custom

import { cn } from "@/lib/utils";
import { TYPOGRAPHY_CLASS_NAME, TYPOGRAPHY_COLOR, TYPOGRAPHY_PARENT, TypographyColor, TypographyVariant } from "@/data/component";

const Typography: React.FC<TypographyProps> = ({
  children,
  variant = "p",
  animationDisabled = false,
  className,
  color = "default",
  style,
  onClick,
}) => {
  // hooks
  const { resolvedTheme: appTheme } = useTheme();

  // variables
  const Parent = TYPOGRAPHY_PARENT[variant];
  const defaultClassName = TYPOGRAPHY_CLASS_NAME[variant];
  const textColor = TYPOGRAPHY_COLOR[color];

  return (
    <Parent
      key={`${appTheme}-${children?.toString()}`}
      style={style}
      className={cn(
        defaultClassName,
        textColor,
        !animationDisabled && "animate-fade-in",
        className,
      )}
      onClick={onClick as undefined}
    >
      {children}
    </Parent>
  );
};

export default Typography;

interface TypographyProps {
  children: ReactNode;
  variant?: TypographyVariant;
  color?: TypographyColor;
  className?: ClassNameValue;
  animationDisabled?: boolean;
  style?: CSSProperties;
  onClick?: unknown;
}
