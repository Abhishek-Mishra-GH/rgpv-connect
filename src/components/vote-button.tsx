"use client";

import { Button } from "./ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

type VoteButtonProps = {
    voteCount?: number;
    type: 'up' | 'down';
}

export function VoteButton({ voteCount, type }: VoteButtonProps) {
    const { pending } = useFormStatus();

    const Icon = type === 'up' ? ArrowUp : ArrowDown;

    if (voteCount !== undefined) {
        return (
            <Button 
                variant="outline" 
                size="sm" 
                type="submit" 
                aria-disabled={pending}
                disabled={pending}
                className="flex items-center gap-2 data-[disabled]:opacity-70"
            >
                <Icon className={cn('h-4 w-4', type === 'up' ? 'text-primary' : 'text-muted-foreground')} />
                <span className="font-bold">{voteCount}</span>
            </Button>
        )
    }

    return (
        <Button 
            variant="ghost"
            size="icon"
            type="submit"
            aria-disabled={pending}
            disabled={pending}
            className={cn(
                'h-7 w-7 data-[disabled]:opacity-70',
                type === 'up' 
                    ? 'text-green-500 hover:text-green-600 hover:bg-green-500/10' 
                    : 'text-red-500 hover:text-red-600 hover:bg-red-500/10'
            )}
        >
            <Icon className="h-5 w-5" />
        </Button>
    )
}