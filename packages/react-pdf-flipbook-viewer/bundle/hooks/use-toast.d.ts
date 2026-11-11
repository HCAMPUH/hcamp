declare enum actionTypes {
    ADD_TOAST = "ADD_TOAST",
    UPDATE_TOAST = "UPDATE_TOAST",
    DISMISS_TOAST = "DISMISS_TOAST",
    REMOVE_TOAST = "REMOVE_TOAST"
}
interface Toast {
    id: string;
    open: boolean;
    onOpenChange?: (open: boolean) => void;
    message?: string;
    description?: string;
}
interface State {
    toasts: Toast[];
}
export declare const reducer: (state: State, action: {
    type: actionTypes;
    toast?: Toast;
    toastId?: string;
}) => State;
declare function toast({ ...props }: Omit<Toast, "id" | "open">): {
    id: string;
    dismiss: () => void;
    update: (props: Partial<Toast>) => void;
};
declare function useToast(): {
    toast: typeof toast;
    dismiss: (toastId: string) => void;
    toasts: Toast[];
};
export { useToast, toast };
