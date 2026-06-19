export default function Icon({
  name,
  className = "text-xl",
}: {
  name: string;
  className?: string;
}) {
  return (
    <span className={`material-symbols-outlined ${className}`}>
      {name}
    </span>
  );
}
