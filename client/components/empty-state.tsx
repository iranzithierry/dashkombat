import React from 'react'
import { SearchXIcon } from 'lucide-react'
import { ProgressCircle } from './ui'

export default function EmptyState({ title, description, pending = false }: { title?: string, description?: string, pending?: boolean }) {
    return (
        <section className="prose min-h-[20vw] flex flex-col items-center justify-center">
            <span className="flex size-24 items-center justify-center rounded-full bg-wg-red-50/70">
                {pending ? (
                    <ProgressCircle
                        isIndeterminate
                        className="size-12"
                    />
                ) : (
                    <SearchXIcon
                        className="text-wg-red"
                        aria-hidden="true"
                        size={48}
                        strokeWidth={0.75}
                    />
                )}
            </span>

            <p className="max-w-prose text-balance text-center leading-6 text-gray-500">
                {pending ? (
                    `wait the moment....`
                ) : (
                    description || description?.length == 0 ? description : `There are no ${title} available at the moment.`
                )}
            </p>
        </section>
    )
}
