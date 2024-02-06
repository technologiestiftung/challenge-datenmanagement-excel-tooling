export function SearchForm() {
  return (
    <div className="flex flex-col">
      <input
        type="text"
        placeholder="Search..."
        className="input input-bordered"
      />
      <div>
        <label>
          <input type="checkbox" className="checkbox" />
          Suche Filtern
        </label>
        <select className="select">
          <option>Alle</option>
          <option>Neu</option>
          <option>Beliebt</option>
        </select>
      </div>
    </div>
  );
}
