const icons: Record<string, React.ReactNode> = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
  ),
  group: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
  ),
  assignment: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7z"/></svg>
  ),
  article: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7z"/></svg>
  ),
  photo_library: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"/></svg>
  ),
  volunteer_activism: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 13c3.09-2.81 6-5.44 6-7.7C22 3.45 20.55 2 18.7 2c-1.04 0-2.05.49-2.7 1.25C15.35 2.49 14.34 2 13.3 2 11.45 2 10 3.45 10 5.3c0 2.26 2.91 4.89 6 7.7zm-2.27-8.02c.32-.7 1.11-1.13 1.94-.98.65.12 1.18.64 1.31 1.29.06.31.04.63-.07.92l-1.21 2.41-1.15-2.3c-.21-.42-.18-.92.03-1.31l.15-.33zM5 15v6h6.5c.66 0 1.3-.13 1.89-.37l5.22-2.01c.54-.21.89-.73.89-1.31 0-.83-.67-1.5-1.5-1.5h-4.11l-1.63-.66c-.17-.07-.34-.14-.52-.14H5z"/></svg>
  ),
  badge: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 7V3c0-.55-.45-1-1-1H7c-.55 0-1 .45-1 1v4H4c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V8c0-.55-.45-1-1-1h-2zm-7-3h2v3h-2V4zm-4 0h2v3H9V4zm-2 4h12v10H7V8zm2 4h8v2H9v-2zm0 3h6v2H9v-2z"/></svg>
  ),
  work: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
  ),
  handshake: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.48 10.41c-.39.39-1.04.39-1.43 0l-2.47-2.47-2.46 2.47c-.39.39-1.04.39-1.43 0-.39-.39-.39-1.04 0-1.43l3.17-3.18c.39-.39 1.04-.39 1.43 0l3.18 3.18c.4.4.4 1.04.01 1.43zM6.76 9.45l2.47 2.47c.39.39.39 1.04 0 1.43-.39.39-1.04.39-1.43 0l-3.17-3.18c-.39-.39-.39-1.04 0-1.43l3.17-3.18c.39-.39 1.04-.39 1.43 0l.93.93-3.17 3.18c-.31.31-.31.82-.13 1.13zM12 22c3.31-2.55 6.5-5.81 6.5-9.5 0-3.59-2.91-6.5-6.5-6.5S5.5 8.91 5.5 12.5c0 3.69 3.19 6.95 6.5 9.5z"/></svg>
  ),
  payments: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 14V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-2 0H3V6h14v8zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm13 0v11c0 1.1-.9 2-2 2H4v-2h17V7h2z"/></svg>
  ),
};

export default function Icon({
  name,
  className = "text-xl",
}: {
  name: string;
  className?: string;
}) {
  const svg = icons[name];

  if (!svg) {
    return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
  }

  return <span className={`inline-flex items-center justify-center ${className}`}>{svg}</span>;
}
