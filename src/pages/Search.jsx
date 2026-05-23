import SearchBar from '../components/SearchBar';

export default function Search() {
  return (
    <div className="page search-page">
      <h1 className="page-title">Search</h1>
      <SearchBar placeholder="Search my website..." />
    </div>
  );
}