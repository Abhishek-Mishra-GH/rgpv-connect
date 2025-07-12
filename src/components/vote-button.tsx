"use client";

import { Button } from "./ui/button";
import { ArrowUp } from "lucide-react";
import { useFormStatus } from "react-dom";

export function VoteButton({ voteCount }: { voteCount: number }) {
    const { pending } = useFormStatus();

    return (
        <Button 
            variant="outline" 
            size="sm" 
            type="submit" 
            aria-disabled={pending}
            disabled={pending}
            className="flex items-center gap-2 data-[disabled]:opacity-70"
        >
            <ArrowUp className={`h-4 w-4 ${pending ? '' : 'text-primary'}`} />
            <span className="font-bold">{voteCount}</span>
        </Button>
    )
}
