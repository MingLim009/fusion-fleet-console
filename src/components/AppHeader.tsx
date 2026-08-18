type AppHeaderProps = {
  onRefresh: () => void;
  loading: boolean;
};

export function AppHeader({ onRefresh, loading }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">Asian Fusion operations</p>
        <h1>Fleet patch console</h1>
      </div>
      <button type="button" onClick={onRefresh} disabled={loading}>
        {loading ? "Refreshing…" : "Refresh fleet"}
      </button>
    </header>
  );
}
