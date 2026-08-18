import { formatStamp } from "../lib/format";
import type { Terminal } from "../types";

type DetailPanelProps = {
  terminal: Terminal | null;
  busy: boolean;
  onPatch: (terminalId: string) => void;
};

export function DetailPanel({ terminal, busy, onPatch }: DetailPanelProps) {
  if (!terminal) {
    return (
      <aside className="detail-panel" aria-label="Terminal details">
        <h2>Details</h2>
        <p>Select a terminal to inspect patch status.</p>
      </aside>
    );
  }

  const canPatch = terminal.patchStatus !== "offline" && terminal.patchStatus !== "current";

  return (
    <aside className="detail-panel" aria-label="Terminal details">
      <h2>{terminal.hostname}</h2>
      <dl>
        <div>
          <dt>Windows SKU</dt>
          <dd>{terminal.windowsSku}</dd>
        </div>
        <div>
          <dt>Last patched</dt>
          <dd>{formatStamp(terminal.lastPatchedAt)}</dd>
        </div>
        <div>
          <dt>Last seen</dt>
          <dd>{formatStamp(terminal.lastSeenAt)}</dd>
        </div>
        <div>
          <dt>Internet exposed</dt>
          <dd>{terminal.internetExposed ? "Yes" : "No"}</dd>
        </div>
      </dl>
      <button
        type="button"
        className="primary"
        disabled={!canPatch || busy}
        onClick={() => onPatch(terminal.id)}
      >
        Queue patch
      </button>
    </aside>
  );
}
