import { SearchForm } from "@/app/components/search-form";
import { SearchResults } from "@/app/components/search-results";

export function Search() {
  return (
    <div className="">
      <SearchForm />
      <SearchResults />
    </div>
  );
}
