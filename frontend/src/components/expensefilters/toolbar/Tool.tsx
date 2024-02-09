import React from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface Props {
    text: string,
    children: React.ReactNode
}

const Tool: React.FC<Props> = ({ text, children }) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className="flex items-center justify-center">
                    {children}
                </TooltipTrigger>
                <TooltipContent>
                    <p>{text}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default Tool