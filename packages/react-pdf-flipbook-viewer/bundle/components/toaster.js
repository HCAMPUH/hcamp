import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport, } from "./toast";
import { useToast } from "./../hooks/use-toast";
import React from "react";
export function Toaster() {
    const { toasts } = useToast();
    return ((React.createElement(ToastProvider, null,
        toasts.map(function ({ id, title, description, action, ...children }) {
            return ((React.createElement(Toast, { key: id, ...children },
                React.createElement("div", { className: "grid gap-1" },
                    title && React.createElement(ToastTitle, null, title),
                    description && (React.createElement(ToastDescription, null, description))),
                action,
                React.createElement(ToastClose, null))));
        }),
        React.createElement(ToastViewport, null))));
}
