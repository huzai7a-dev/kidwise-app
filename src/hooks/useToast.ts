import { ToastContext } from "@src/providers/ToastProvider";
import { useContext } from "react";

export function useToast() {
    return useContext(ToastContext);
} 