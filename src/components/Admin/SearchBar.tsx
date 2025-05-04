interface SearchBarProps {
    placeholder: string;
    onSearch: (query: string) => void;
  }
  
  const SearchBar = ({ placeholder, onSearch }: SearchBarProps) => {
    return (
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input 
          type="text" 
          className="search-input" 
          placeholder={placeholder}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    );
  };
  
  export default SearchBar;