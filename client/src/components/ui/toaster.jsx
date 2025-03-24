import React from "react"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast"
import { useToast, ToastContext } from "../../hooks/use-toast.jsx"

export function Toaster() {
  const { toast } = useToast()
  // Use ToastContext to access the actual toast state
  const toastContext = React.useContext(ToastContext)
  const toasts = toastContext?.toasts || []
  
  // Add a function to handle toast dismissal
  const handleClose = (id) => {
    if (toastContext && toastContext.dismiss) {
      toastContext.dismiss(id);
    }
  }

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose onClick={() => handleClose(id)} />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}