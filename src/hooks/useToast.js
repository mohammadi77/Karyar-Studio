import { useContext } from "react";
import { ToastContext } from "../contexts/toastContextObject";

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast باید داخل ToastProvider استفاده شود");
  }
  return context;
}
