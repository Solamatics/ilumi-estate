import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ListingCard from "../components/ListingCard";

const Checkbox = ({ id, label, onChange, checked }) => (
  <div className="flex gap-2">
    <input type="checkbox" id={id} checked={checked} onChange={onChange} />
    <span>{label}</span>
  </div>
);
const URL = import.meta.env.VITE_BASE_URL;

const SearchPage = () => {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const navigate = useNavigate();

  const handleTypeChange = (id) => {
    setSidebarData((prev) => ({ ...prev, type: id }));
  };

  const handleCheckboxChange = (id, value) => {
    setSidebarData((prev) => ({
      ...prev,
      [id]: value || value === "true" ? true : false,
    }));
  };

  const handleChange = (e) => {
    const { id, checked, value } = e.target;

    switch (id) {
      case "all":
      case "rent":
      case "sale":
        handleTypeChange(id);
        break;
      case "searchTerm":
        setSidebarData((prev) => ({ ...prev, searchTerm: value }));
        break;

      case "parking":
      case "furnished":
      case "offer":
        handleCheckboxChange(id, checked);
        break;
      case "sort":
        const sort = value.split("_")[0] || "created_at";
        const order = value.split("_")[1] || "desc";
        setSidebarData({ ...sidebarData, sort, order });

      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    // urlParams.set("searchTerm", sidebarData.searchTerm);
    // urlParams.set("type", sidebarData.type);
    // urlParams.set("parking", sidebarData.parking);
    // urlParams.set("furnished", sidebarData.furnished);
    // urlParams.set("offer", sidebarData.offer);
    // urlParams.set("sort", sidebarData.sort);
    // urlParams.set("order", sidebarData.order);

    for (const [key, value] of Object.entries(sidebarData)) {
      urlParams.set(key, value);
    }
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  //fetch listings
  const fetchListings = async () => {
    const urlParams = new URLSearchParams(location.search);
    setLoading(true);
    setShowMore(false);
    const searchQuery = urlParams.toString();
    const response = await axios.get(`${URL}/api/listing/get?${searchQuery}`);
    const data = response.data;
    if (data.length > 8) {
      setShowMore(true);
    } else {
      setShowMore(false);
    }
    setListings(data);
    setLoading(false);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "desc",
      });
    }

    fetchListings();
  }, [location.search]);

  const handleShowMore = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const response = await axios.get(`${URL}/api/listing/get?${searchQuery}`);
    const data = response.data;
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:h-screen">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label htmlFor="searchTerm" className="whitespace-nowrap">
              Search Term
            </label>
            <input
              type="text"
              id="searchTerm"
              onChange={handleChange}
              value={sidebarData.searchTerm}
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
            />
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label>Type :</label>
            <Checkbox
              id="all"
              label="Rent & Sale"
              checked={sidebarData.type === "all"}
              onChange={handleChange}
            />
            <Checkbox
              id="rent"
              label="Rent"
              checked={sidebarData.type === "rent"}
              onChange={handleChange}
            />
            <Checkbox
              id="sale"
              label="Sale"
              checked={sidebarData.type === "sale"}
              onChange={handleChange}
            />
            <Checkbox
              id="offer"
              label="Offer"
              checked={sidebarData.offer}
              onChange={handleChange}
            />
            <Checkbox
              id="parking"
              label="Parking"
              checked={sidebarData.parking}
              onChange={handleChange}
            />
            <Checkbox
              id="furnished"
              label="Furnished"
              checked={sidebarData.furnished}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label>Amenities :</label>
            <Checkbox id="parking" label="Parking" />
            <Checkbox id="furnished" label="Furnished" />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="sort_id">Sort</label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              id="sort"
              className="border rounded-lg p-3"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">latest</option>
              <option value="createdAt_asc">oldest</option>
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
        <div className="p-7 flex flex-wrap gap-4">
          {listings.length === 0 && (
            <p className="text-lg text-center text-slate-700">
              No listing found!
            </p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}
          {listings.length > 0 &&
            listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          {showMore ? (
            <button
              className="text-green-700 text-center w-full"
              onClick={() => handleShowMore()}
            >
              Show more
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
