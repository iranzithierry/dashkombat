"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { HelpCircle } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { Label as LabelPrimitive } from "react-aria-components";
import { cva, type VariantProps } from "class-variance-authority";

const labelVariants = cva(
	"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

export interface LabelProps
	extends React.ComponentPropsWithoutRef<typeof LabelPrimitive>,
		VariantProps<typeof labelVariants> {
	helpText?: string;
}

const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitive>, LabelProps>(
	({ className, helpText, children, ...props }, ref) => (
		<div className="flex items-center gap-2">
			<LabelPrimitive ref={ref} className={cn(labelVariants(), className)} {...props}>
				{children}
			</LabelPrimitive>
			{helpText && (
				<Tooltip>
					<Tooltip.Trigger>
						<HelpCircle className="text-muted-foreground h-4 w-4 cursor-pointer" />
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>{helpText}</p>
					</Tooltip.Content>
				</Tooltip>
			)}
		</div>
	),
);
Label.displayName = "Label";

export { Label };
