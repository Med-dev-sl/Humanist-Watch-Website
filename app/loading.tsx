import LoadingSpinner from "@/app/components/loading-spinner";

export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}
