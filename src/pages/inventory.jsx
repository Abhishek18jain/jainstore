import React, { useState } from "react";
import { useSelector } from "react-redux";
import SearchInventory from "../components/searchItem";
import "../css/inventory.css";

const Inventory = () => {
  const { categories } = useSelector((state) => state.inventory);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [items, setItems] = useState({});

  const selectedCatObj = categories.find((c) => c.name === selectedCategory);

  const handleClick = (categoryName) => {
    setSelectedCategory(selectedCategory === categoryName ? null : categoryName);
  };

  const handleItemClick = (catName, itemName) => {
    const key = `${catName}-${itemName}`;
    setItems((prev) => {
      const existing = prev[key];
      if (existing?.checked) {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      } else {
        return {
          ...prev,
          [key]: { checked: true, date: new Date().toLocaleString() },
        };
      }
    });
  };

  return (
    <div className="flex flex-col gap-8 p-5 bg-[#f9f6f2] min-h-screen font-inter text-gray-800">
  
      <SearchInventory onSearchResultClick={handleClick} />

      <div className="flex bg-white rounded-2xl shadow-md p-6 w-full max-h-[80vh]">
        {/* Left Side (Categories) */}
      <div className="flex w-[32vw] flex-col gap-2 overflow-y-auto p-2 md:w-64 md:flex-shrink-0 md:border-r-2 md:border-gray-100 lg:w-72 overflow-x-hidden scrollbar-custom">
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => handleClick(cat.name)}
              className={`text-left px-4 py-2 rounded-lg transition ${
                selectedCategory === cat.name
                  ? "bg-teal-500 text-white"
                  : "bg-[#f3f0ec] hover:bg-[#e8e4df]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Right Side (Items) */}
        <div className="flex-1 bg-[#faf9f7] rounded-xl p-3 overflow-y-auto ml-2 mt-2 max-h-[70vh] scrollbar-custom">
          {selectedCatObj ? (
            <ul className="list-none space-y-2">
              {selectedCatObj.items.map((item, i) => {
                const key = `${selectedCatObj.name}-${item}`;
                const checked = items[key]?.checked || false;
                const date = items[key]?.date || null;
                return (
                  <li
                    key={i}
                    onClick={() => handleItemClick(selectedCatObj.name, item)}
                    className="flex items-center gap-3 py-1 border-b border-gray-200 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      readOnly
                      className="w-5 h-5 accent-teal-500 cursor-pointer"
                    />
                    <span className="text-base text-gray-700">{item}</span>
                    {date && <span className="text-sm text-gray-500">({date})</span>}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-500 italic">Select a category to view items.</p>
          )}
        </div>
      </div>
    </div>
 
    
  );
};

export default Inventory;
