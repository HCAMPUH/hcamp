import * as ToastPrimitives from "@radix-ui/react-toast";
import React from "react";
import { ReactNode } from "react";
declare const ToastProvider: React.FC<ToastPrimitives.ToastProviderProps>;
type GenericToastProps = {
    className?: string;
    children?: ReactNode;
};
declare const ToastViewport: React.ForwardRefExoticComponent<GenericToastProps & React.RefAttributes<HTMLOListElement>>;
declare const Toast: React.ForwardRefExoticComponent<GenericToastProps & {
    variant: "default" | "destructive";
} & React.RefAttributes<HTMLLIElement>>;
declare const ToastClose: React.ForwardRefExoticComponent<GenericToastProps & React.RefAttributes<HTMLButtonElement>>;
declare const ToastTitle: React.ForwardRefExoticComponent<GenericToastProps & React.RefAttributes<HTMLDivElement>>;
declare const ToastDescription: React.ForwardRefExoticComponent<GenericToastProps & React.RefAttributes<HTMLDivElement>>;
export { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose };
