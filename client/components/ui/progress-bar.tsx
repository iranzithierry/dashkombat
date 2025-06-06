"use client"

import { motion } from "motion/react"
import {
  ProgressBar as ProgressBarPrimitive,
  type ProgressBarProps as ProgressBarPrimitiveProps,
} from "react-aria-components"

import { composeTailwindRenderProps } from "./primitive"
import { Label } from "./label"

interface ProgressBarProps extends ProgressBarPrimitiveProps {
  label?: string
  ref?: React.RefObject<HTMLDivElement>,
  showValueLabel?: boolean
}

const ProgressBar = ({ label, showValueLabel = false, ref, className, ...props }: ProgressBarProps) => {
  return (
    <ProgressBarPrimitive
      ref={ref}
      className={composeTailwindRenderProps(className, "flex flex-col")}
      {...props}
    >
      {({ percentage, valueText, isIndeterminate }) => (
        <>
          <div className="flex justify-between gap-2">
            {label && <Label>{label}</Label>}
            {showValueLabel && <span className="text-muted-fg text-sm tabular-nums">{valueText}</span>}
          </div>
          <div className="-outline-offset-1 relative h-2 min-w-64 overflow-hidden rounded-full bg-secondary outline-1 outline-transparent">
            {!isIndeterminate ? (
              <motion.div
                className="absolute top-0 left-0 h-full rounded-full bg-primary forced-colors:bg-[Highlight]"
                initial={{ width: "0%" }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            ) : (
              <motion.div
                className="absolute top-0 h-full rounded-full bg-primary forced-colors:bg-[Highlight]"
                initial={{ left: "0%", width: "40%" }}
                animate={{ left: ["0%", "100%", "0%"] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 2,
                  ease: "easeInOut",
                }}
              />
            )}
          </div>
        </>
      )}
    </ProgressBarPrimitive>
  )
}

export type { ProgressBarProps }
export { ProgressBar }
