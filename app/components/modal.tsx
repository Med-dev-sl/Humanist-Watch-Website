import LoadingSpinner from "@/app/components/loading-spinner";

export default function Modal({
  open,
  type = "success",
  title,
  message,
  onClose,
}: {
  open: boolean;
  type?: "success" | "error";
  title: string;
  message: string;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="animate-scale-in w-full max-w-sm rounded-xl border bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-full ${
              type === "success" ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {type === "success" ? (
              <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              <svg className="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <div>
            <h2 className="font-heading text-lg font-semibold text-primary">{title}</h2>
            <p className="mt-1 text-sm text-zinc-500">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="mt-2 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export function LoadingOverlay({
  open,
  message = "Loading...",
}: {
  open: boolean;
  message?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-white">
      <LoadingSpinner size="lg" />
      <p className="font-alt text-sm font-medium text-primary">{message}</p>
    </div>
  );
}
