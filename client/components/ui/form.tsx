"use client";

import * as React from "react";
import { Label as LabelPrimitive } from "react-aria-components";
import { Slot } from "@radix-ui/react-slot";
import {
	Controller,
	ControllerProps,
	FieldPath,
	FieldValues,
	FormProvider,
	useFormContext,
} from "react-hook-form";

import { Label, LabelProps } from "ui";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import type { FormProviderProps } from "react-hook-form"

import type { FormProps as FormPrimitiveProps } from "react-aria-components"
import { Form as FormPrimitive } from "react-aria-components"

const Form = FormProvider;

interface FormProps extends FormPrimitiveProps {
	ref?: React.RefObject<HTMLFormElement>
}
const ValidatorForm = ({ ref, ...props }: FormProps) => {
	return <FormPrimitive ref={ref} {...props} />
  }
type FormFieldContextValue<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
	name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

const FormField = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	...props
}: ControllerProps<TFieldValues, TName>) => {
	return (
		<FormFieldContext.Provider value={{ name: props.name }}>
			<Controller {...props} />
		</FormFieldContext.Provider>
	);
};

const useFormField = () => {
	const fieldContext = React.useContext(FormFieldContext);
	const itemContext = React.useContext(FormItemContext);
	const { getFieldState, formState } = useFormContext();

	const fieldState = getFieldState(fieldContext.name, formState);

	if (!fieldContext) {
		throw new Error("useFormField should be used within <FormField>");
	}

	const { id } = itemContext;

	return {
		id,
		name: fieldContext.name,
		formItemId: `${id}-form-item`,
		formDescriptionId: `${id}-form-item-description`,
		formMessageId: `${id}-form-item-message`,
		...fieldState,
	};
};

type FormItemContextValue = {
	id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => {
		const id = React.useId();
		const { name } = useFormField();
		return (
			<FormItemContext.Provider value={{ id }}>
				<div id={name} ref={ref} className={cn("space-y-2", className)} {...props} />
			</FormItemContext.Provider>
		);
	},
);
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
	React.ElementRef<typeof LabelPrimitive>,
	React.ComponentPropsWithoutRef<typeof LabelPrimitive> & LabelProps
>(({ className, ...props }, ref) => {
	const { formItemId } = useFormField();

	return <Label ref={ref} className={cn(className)} htmlFor={formItemId} {...props} />;
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
	React.ElementRef<typeof Slot>,
	React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
	const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
	const { formState } = useFormContext();
	const { isSubmitting } = formState;
	return (
		<Slot
			ref={ref}
			id={formItemId}
			// @ts-ignore
			disabled={isSubmitting}
			invalid={error ? "true" : "false"}
			aria-describedby={
				!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`
			}
			aria-invalid={!!error}
			{...props}
		/>
	);
});
FormControl.displayName = "FormControl";


const FormMessage = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
	const { error, formMessageId } = useFormField();
	const body = error ? String(error?.message) : children;

	if (!body) {
		return null;
	}

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0, height: 0 }}
				animate={{ opacity: 1, height: "auto" }}
				exit={{ opacity: 0, height: 0 }}
				transition={{ duration: 0.1 }}
			>
				<p
					ref={ref}
					id={formMessageId}
					className={cn("text-danger text-sm/6 forced-colors:text-[Mark]", className)}
					{...props}
				>
					{body}
				</p>
			</motion.div>
		</AnimatePresence>
	);
});
FormMessage.displayName = "FormMessage";

const FormAction = React.forwardRef<
	HTMLButtonElement,
	React.ComponentPropsWithoutRef<typeof Button>
>(({ className, children, intent, ...props }, ref) => {
	const { formState } = useFormContext();
	const { isSubmitting } = formState;

	return (
		<Button
			ref={ref}
			className={cn("w-full", className)}
			isPending={isSubmitting}
			isDisabled={isSubmitting}
			type="submit"
			{...props}
		>
			{children}
		</Button>
	);
});
FormAction.displayName = "FormAction";

export {
	useFormField,
	Form,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	FormField,
	FormAction,
	ValidatorForm,
};
