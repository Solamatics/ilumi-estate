import React from "react";

const Checkbox = ({ id, label }) => (
  <div className="flex gap-2">
    <input type="checkbox" id={id} />
    <span>{label}</span>
  </div>
);

const SearchPage = () => {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:h-screen">
        <form className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label htmlFor="searchTerm" className="whitespace-nowrap">
              Search Term
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
            />
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label>Type :</label>
            <Checkbox id="all" label="Rent & Sale" />
            <Checkbox id="rent" label="Rent" />
            <Checkbox id="sale" label="Sale" />
            <Checkbox id="offer" label="Offer" />
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label>Amenities :</label>
            <Checkbox id="parking" label="Parking" />
            <Checkbox id="furnished" label="Furnished" />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="sort_id">Sort</label>
            <select id="sort_id" className="border rounded-lg p-3">
              <option>Price high to low</option>
              <option>Price low to high</option>
              <option>latest</option>
              <option>oldest</option>
            </select>
          </div>

          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="">
        <h1 className="mt-5 text-3xl font-semibold border-b p-3 text-slate-700">
          Listing results:
        </h1>
      </div>
    </div>
  );
};

export default SearchPage;
