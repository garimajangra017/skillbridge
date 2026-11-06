const SearchBar = ({
value,
onChange,
placeholder = "Search...",
onSubmit
}) => (

  <form
    className="search-bar"
    onSubmit={(event) => {
      event.preventDefault();
      onSubmit?.(value);
    }}
  >
    <span aria-hidden="true">⌕</span>
    <input
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
    />
    {value && (
      <button type="button" onClick={() => onChange("")} aria-label="Clear search">
        ×
      </button>
    )}
  </form>
);

export default SearchBar;
