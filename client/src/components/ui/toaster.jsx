import { useToast } from "../../hooks/use-toast";
import { Toast, ToastProvider, ToastViewport } from "./toast";

/**
 * Toaster component that manages and displays toast notifications
 */
export function Toaster() {
  const { toast, toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <div className="font-medium">{title}</div>}
              {description && <div className="text-sm opacity-90">{description}</div>}
            </div>
            {action}
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}