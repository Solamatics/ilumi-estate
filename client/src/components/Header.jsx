import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromURL = urlParams.get("searchTerm");
    if (searchTermFromURL) {
      setSearchTerm(searchTermFromURL);
    }
  }, [location.search]);

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl  mx-auto p-3">
        <Link to="/" className="">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">ilumi</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <div className="flex items-center gap-4">
          <ul className="hidden sm:flex gap-4">
            <li className="text-slate-700 hover:underline">
              <Link to="/">Home</Link>
            </li>
            <li className="text-slate-700 hover:underline">
              <Link to="/about">About</Link>
            </li>
          </ul>
          <Link
            to={currentUser ? "/profile" : "/sign-in"}
            className="text-slate-700 hover:underline"
          >
            {currentUser ? (
              <img
                src={currentUser?.avatar}
                alt=""
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              "Sign in"
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
