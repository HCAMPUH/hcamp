import { type VariantProps } from "class-variance-authority";
import React, { ButtonHTMLAttributes } from "react";
declare const buttonVariants: (props?: ({
    variant?: "default" | "secondary" | null | undefined;
    size?: "default" | "xs" | "sm" | "lg" | "icon" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}
declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
export { Button, buttonVariants };
