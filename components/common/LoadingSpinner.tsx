export default function LoadingSpinner({
  className = "border-zinc-400",
}: {
  className?: string;
}) {
  return (
    <div
      className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${className}`}
    ></div>
  );
}
