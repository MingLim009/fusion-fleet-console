type StatusBannerProps = {
  message: string;
};

export function StatusBanner({ message }: StatusBannerProps) {
  return (
    <div className="status-banner" role="status" aria-live="polite">
      {message}
    </div>
  );
}
