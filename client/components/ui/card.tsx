import * as React from "react";

import { cn } from "@/lib/utils";
import { tv } from "tailwind-variants";

import { Heading } from "./heading";

const card = tv({
    slots: {
        root: [
            "xrkr xkd2 rounded-3xl bg-muted/40  overflow-hidden [&:has(.card-footer)]:overflow-hidden border text-fg shadow-sm",
        ],
        header: "xlw32 card-header flex flex-col space-y-1.5 p-6",
        title: "klda font-semibold text-fg leading-none tracking-tight sm:leading-6",
        description: "dl2 text-base text-muted-fg sm:text-sm",
        content: "yahnba card-content  z-10 relative p-6",
        footer: "ccvgs8x card-footer  z-0 relative flex items-center p-3",
    },
});

const { root, header, title, description, content, footer } = card();

const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return <div className={cn(root({ className }), className)} {...props} />;
};

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    description?: string;
}

const Header = ({ className, title, description, children, ...props }: HeaderProps) => (
    <div className={header({ className: cn(className) })} {...props}>
        {title && <Title>{title}</Title>}
        {description && <Description>{description}</Description>}
        {!title && typeof children === "string" ? <Title>{children}</Title> : children}
    </div>
);

const Title = ({ className, level = 3, ...props }: React.ComponentProps<typeof Heading>) => {
    return <Heading level={level} className={title({ className })} {...props} />;
};

const Description = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return <div {...props} slot="description" className={description({ className })} {...props} />;
};

const Content = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return <div className={cn(content({ className }), className)} {...props} />;
};

const Footer = ({
    className,
    outline = true,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & { outline?: boolean }) => {
    return (
        <div
            className={cn(
                outline && "bg-muted border-t-2 border-muted-fg/10",
                footer({ className }),
            )}
            {...props}
        />
    );
};

Card.Content = Content;
Card.Description = Description;
Card.Footer = Footer;
Card.Header = Header;
Card.Title = Title;

export { Card };
