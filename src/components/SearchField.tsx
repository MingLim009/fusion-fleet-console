type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchField({ value, onChange }: SearchFieldProps) {
  return (
    <div className="filter-row">
      <label htmlFor="terminal-search">Search terminals</label>
      <input
        id="terminal-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Hostname or Windows SKU"
        autoComplete="off"
      />
    </div>
  );
}
