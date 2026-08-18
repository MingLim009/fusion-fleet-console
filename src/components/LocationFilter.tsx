import type { Location, LocationId } from "../types";

type LocationFilterProps = {
  locations: Location[];
  value: LocationId | "all";
  onChange: (value: LocationId | "all") => void;
};

export function LocationFilter({ locations, value, onChange }: LocationFilterProps) {
  return (
    <div className="filter-row">
      <label htmlFor="location-filter">Location</label>
      <select
        id="location-filter"
        value={value}
        onChange={(event) => onChange(event.target.value as LocationId | "all")}
      >
        <option value="all">All locations</option>
        {locations.map((location) => (
          <option key={location.id} value={location.id}>
            {location.name}
          </option>
        ))}
      </select>
    </div>
  );
}
