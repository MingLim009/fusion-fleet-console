export type LocationId = "downtown" | "lakeside" | "airport";

export type PatchStatus = "current" | "due" | "overdue" | "offline";

export type Location = {
  id: LocationId;
  name: string;
  timezone: string;
};

export type Terminal = {
  id: string;
  hostname: string;
  locationId: LocationId;
  windowsSku: string;
  patchStatus: PatchStatus;
  lastPatchedAt: string;
  lastSeenAt: string;
  internetExposed: boolean;
};

export type FleetSnapshot = {
  fetchedAt: string;
  locations: Location[];
  terminals: Terminal[];
};
