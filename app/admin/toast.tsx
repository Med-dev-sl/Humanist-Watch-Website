"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import type { ReactNode } from "react";

type Toast = {
  id: number;
  type: "success" | "error";
  title: string;
  message: string;
};

const ToastContext = createContext<{
  showToast: (type: Toast["type"], title: string, message: string) => void;
}>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (type: Toast["type"], title: string, message: string) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, type, title, message }]);
    },
    []
  );

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDone={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDone }: { toast: Toast; onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 4000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="animate-slide-up flex items-start gap-3 rounded-xl border bg-white p-4 shadow-lg">
      <div
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
          toast.type === "success" ? "bg-green-100" : "bg-red-100"
        }`}
      >
        {toast.type === "success" ? (
          <svg className="h-3.5 w-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        ) : (
          <svg className="h-3.5 w-3.5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </div>
      <div>
        <p className="text-sm font-semibold text-primary">{toast.title}</p>
        <p className="text-xs text-zinc-500">{toast.message}</p>
      </div>
      <button onClick={onDone} className="ml-2 text-zinc-300 hover:text-zinc-500">
        ✕
      </button>
    </div>
  );
}
