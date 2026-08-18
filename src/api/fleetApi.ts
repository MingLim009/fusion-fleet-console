import { seedSnapshot } from "../data/seed";
import type { FleetSnapshot, PatchStatus, Terminal } from "../types";

function cloneSnapshot(snapshot: FleetSnapshot): FleetSnapshot {
  return structuredClone(snapshot);
}

let memory = cloneSnapshot(seedSnapshot);

export function resetFleetMemory(): void {
  memory = cloneSnapshot(seedSnapshot);
}

export async function fetchFleet(signal?: AbortSignal): Promise<FleetSnapshot> {
  await delay(40, signal);
  return cloneSnapshot(memory);
}

export async function queuePatch(
  terminalId: string,
  signal?: AbortSignal,
): Promise<Terminal> {
  await delay(60, signal);
  const terminal = memory.terminals.find((item) => item.id === terminalId);
  if (!terminal) {
    throw new Error(`Unknown terminal ${terminalId}`);
  }
  if (terminal.patchStatus === "offline") {
    throw new Error(`${terminal.hostname} is offline and cannot be patched.`);
  }
  terminal.patchStatus = nextStatusAfterQueue(terminal.patchStatus);
  terminal.lastPatchedAt = new Date().toISOString();
  terminal.lastSeenAt = terminal.lastPatchedAt;
  return structuredClone(terminal);
}

function nextStatusAfterQueue(status: PatchStatus): PatchStatus {
  if (status === "current") {
    return "current";
  }
  return "due";
}

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => resolve(), ms);
    const onAbort = () => {
      window.clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    };
    if (signal?.aborted) {
      onAbort();
      return;
    }
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}
