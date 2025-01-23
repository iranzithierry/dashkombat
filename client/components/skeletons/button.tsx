import React from 'react'
import { Skeleton } from '../ui'
import { cn } from '@/lib/utils'

export default function SkeletonButton({ className, ...props }: React.ComponentProps<typeof Skeleton>) {
    return (
        <Skeleton className={cn("h-8 w-24", className)} {...props} />
    )
}
