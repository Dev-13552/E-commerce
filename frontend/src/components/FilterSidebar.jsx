import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

function FilterSidebar({
  search,
  setSearch,
  category,
  setCategory,
  brand,
  setBrand,
  allProducts,
  priceRange,
  setPriceRange,
}) {
  const categories = allProducts.map((p) => p.category);
  const uniqueCategory = ["All", ...new Set(categories)];

  const brands = allProducts.map((p) => p.brand);
  const uniqueBrand = ["All", ...new Set(brands)];

  const handleCategoryClick = (val) => {
    setCategory(val);
  };
  const handleBrandChange = (e) => {
    setBrand(e.target.value);
  };
  const handleMinChange = (e) => {
    const value = Number(e.target.value);
    if (value <= priceRange[1]) setPriceRange([value, priceRange[1]]);
  };
  const handleMaxChange = (e) => {
    const value = Number(e.target.value);
    if (value >= priceRange[0]) setPriceRange([priceRange[0], value]);
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setBrand("All");
    setPriceRange([0, 999999]);
  };

  

  return (
    <div className="bg-gray-100 mt-10 p-4 rounded-md h-max hidden md:block w-64">
      {/* Search */}
      <Input
        type={"text"}
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={"bg-white p-2 rounded-md border-gray-400 border-2 w-full"}
      />
      {/* Category */}
      <h1 className="mt-5 font-semibold text-xl">Category</h1>
      <div className="flex flex-col gap-2 mt-3">
        {uniqueCategory.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="radio"
              checked={category === item}
              onChange={(e) => handleCategoryClick(item)}
            />
            <label htmlFor="">{item}</label>
          </div>
        ))}
      </div>
      {/* Brand */}
      <h1 className="mt-5 font-semibold text-xl">Brand</h1>
      <select
        value={brand}
        onChange={handleBrandChange}
        className="bg-white w-full p-2 border-gray-200 border-2 rounded-md"
      >
        {uniqueBrand.map((item, index) => (
          <option value={item} key={index}>
            {item.toUpperCase()}
          </option>
        ))}
      </select>

      {/* Price Range */}
      <h1 className="mt-5 font-semibold text-xl mb-3">Price Range</h1>
      <div className="flex flex-col gap-2">
        <label>
          Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            min={0}
            max={20000}
            value={priceRange[0]}
            onChange={handleMinChange}
            className="w-20 p-1 border-gray-300 rounded"
          />
          <span>- </span>
          <input
            type="number"
            min={20000}
            max={999999}
            value={priceRange[1]}
            onChange={handleMaxChange}
            className="w-20 p-1 border-gray-300 rounded"
          />
        </div>
        <input
          type="range"
          value={priceRange[0]}
          onChange={handleMinChange}
          min={0}
          max={20000}
          step={100}
          className="w-full"
        />
        <input
          type="range"
          min={20000}
          max={999999}
          step={1000}
          value={priceRange[1]}
          onChange={handleMaxChange}
          className="w-full"
        />
      </div>
      {/*Reset Button*/}

      <Button onClick = {resetFilters} className={"bg-pink-600 text-white mt-5 cursor-pointer w-full"}>
        Reset Filters
      </Button>
    </div>
  );
}

export default FilterSidebar;
