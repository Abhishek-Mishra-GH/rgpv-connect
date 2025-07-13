"use client";

import { Button } from "./ui/button";
import { ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

type VoteButtonProps = {
  voteCount?: number;
  type: "up" | "down";
  isActive?: boolean;
  isLoading?: boolean;
  size?: "sm" | "md";
};

export function VoteButton({
  voteCount,
  type,
  isActive = false,
  isLoading = false,
  size = "sm",
}: VoteButtonProps) {
  const { pending } = useFormStatus();
  const isDisabled = pending || isLoading;

  const Icon = type === "up" ? ArrowUp : ArrowDown;
  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  const buttonSize = size === "sm" ? "h-6 w-6" : "h-7 w-7";

  if (voteCount !== undefined) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant={isActive ? "default" : "outline"}
          size="sm"
          type="submit"
          aria-disabled={isDisabled}
          disabled={isDisabled}
          className={cn(
            "flex items-center gap-2 data-[disabled]:opacity-70 transition-all duration-200",
            isActive &&
              type === "up" &&
              "bg-green-500 hover:bg-green-600 text-white border-green-500",
            isActive &&
              type === "down" &&
              "bg-red-500 hover:bg-red-600 text-white border-red-500",
            !isActive &&
              type === "up" &&
              "hover:bg-green-50 hover:border-green-300 hover:text-green-600",
            !isActive &&
              type === "down" &&
              "hover:bg-red-50 hover:border-red-300 hover:text-red-600"
          )}
        >
          {isLoading ? (
            <Loader2 className={cn(iconSize, "animate-spin")} />
          ) : (
            <Icon
              className={cn(
                iconSize,
                isActive && "text-white",
                !isActive && type === "up" && "text-green-500",
                !isActive && type === "down" && "text-red-500"
              )}
            />
          )}
        </Button>
        <span className="font-bold">{voteCount}</span>
      </div>
    );
  }

  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="icon"
      type="submit"
      aria-disabled={isDisabled}
      disabled={isDisabled}
      className={cn(
        buttonSize,
        "data-[disabled]:opacity-70 transition-all duration-200",
        isActive &&
          type === "up" &&
          "bg-green-500 hover:bg-green-600 text-white",
        isActive && type === "down" && "bg-red-500 hover:bg-red-600 text-white",
        !isActive &&
          type === "up" &&
          "text-green-500 hover:text-green-600 hover:bg-green-500/10",
        !isActive &&
          type === "down" &&
          "text-red-500 hover:text-red-600 hover:bg-red-500/10"
      )}
    >
      {isLoading ? (
        <Loader2 className={cn(iconSize, "animate-spin")} />
      ) : (
        <Icon className={iconSize} />
      )}
    </Button>
  );
}
