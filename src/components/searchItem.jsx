import React, { useState, useMemo } from "react";
import Fuse from "fuse.js";
import data from "../data.js";
import "../css/SearchInventory.css";

const SearchInventory = ({onSearchResultClick}) => {
  const [query, setQuery] = useState("");

  // useMemo helps in optimizing performance by memoizing the flattened data
  // This expensive calculation now runs only once.
  const allItems = useMemo(() =>
    data.categories.flatMap((cat) =>
      cat.items.map((item) => ({
        category: cat.name,
        name: item,
      }))
    ), []); // Empty dependency array ensures it runs only on mount

  // Memoize the Fuse instance as well for better performance
  const fuse = useMemo(() => new Fuse(allItems, {
    keys: ["name", "category"], // what fields to search in
    includeScore: true,
    threshold: 0.4, // Adjust for stricter or looser search
  }), [allItems]);


  // Perform search only if there's a query
  const results = query
    ? fuse.search(query)
        .slice(0, 3) // <<--- YEH HAI MAIN FIX!
        .map((res) => res.item)
    : [];

  const handleResultClick = (category) => {
    onSearchResultClick(category); // Call parent function  
    setQuery(""); // Clear the search input
  };


  return (
    <div className="search-wrapper">
      <div className="search-container">
        <h2 className="search-title">Welcome Back To Inventory</h2>
        <div className="input-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search for items or categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Show results only if the user has typed something */}
      {query && (
        <ul className="results-list">
          {results.length > 0 ? (
            results.map((item, index) => (
              <li key={`${item.name}-${index}`} onClick={() => handleResultClick(item.category)}  className="result-item">
                <span className="item-name">{item.name}</span>
                <span className="item-category">{item.category}</span>
              </li>
            ))
          ) : (
            <li className="no-results">No items found 😢</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchInventory;