import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setSearchQuery,
  resetPosts,
  setPosts,
  setPagination,
  setLoading,
} from "../utils/store/PublicSlice";
import logo from "../assets/logo2.png";
import defaultimg from "../assets/default.png";
import toast from "react-hot-toast";

const Navbar = () => {
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Guard to prevent double navigation (touch -> click)
  const recentlyNavigatedRef = useRef(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ----- Fetch suggestions (debounced) -----
  useEffect(() => {
    if (searchValue.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const controller = new AbortController();
    const id = setTimeout(async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_DOMAIN
          }/api/posts/search/suggestions?q=${encodeURIComponent(
            searchValue
          )}&limit=5`,
          { signal: controller.signal }
        );
        setSuggestions(res.data.data || []);
        setShowSuggestions((res.data.data || []).length > 0);
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }
    }, 200);

    return () => {
      clearTimeout(id);
      controller.abort();
    };
  }, [searchValue]);

  // ----- Close suggestions when clicking outside -----
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ----- Main search handler -----
  const handleSearch = async (query = searchValue) => {
    if (!query.trim()) {
      dispatch(setSearchQuery(""));
      dispatch(resetPosts());
      setShowSuggestions(false);
      setShowMobileSearch(false);
      return;
    }

    setIsSearching(true);
    dispatch(setLoading(true));
    dispatch(setSearchQuery(query));

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_DOMAIN}/api/posts/search?q=${encodeURIComponent(
          query
        )}`
      );

      dispatch(setPosts(res.data.data || []));
      dispatch(
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalPosts: (res.data.data || []).length,
          hasNextPage: false,
          hasPrevPage: false,
        })
      );
      setShowSuggestions(false);
      setShowMobileSearch(false);

      if (window.location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "No results found");
      dispatch(setPosts([]));
    } finally {
      dispatch(setLoading(false));
      setIsSearching(false);
    }
  };

  // Unified suggestion click handler (sets guard to prevent duplicates)
  const handleSuggestionClick = (suggestion) => {
    if (!suggestion) return;

    // Prevent duplicate navigations for a short period
    if (recentlyNavigatedRef.current) return;
    recentlyNavigatedRef.current = true;
    setTimeout(() => {
      recentlyNavigatedRef.current = false;
    }, 800); // allow next navigation after 800ms

    setShowSuggestions(false);
    setShowMobileSearch(false);
    setSearchValue("");

    // navigate to detail view
    navigate(`/detailview?id=${suggestion._id}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleMobileSearchToggle = () => {
    setShowMobileSearch(!showMobileSearch);
    if (!showMobileSearch) {
      setTimeout(() => {
        const mobileInput = document.getElementById("mobile-search-input");
        if (mobileInput) mobileInput.focus();
      }, 100);
    }
  };

  // ------------------- JSX -------------------
  return (
    <nav className="fixed top-0 w-[100vw] rounded flex items-center justify-between p-1.5 sm:p-2 mx-auto shadow-gray-900 shadow-lg max-md:w-full max-md:fixed bg-slate-50 max-md:top-0 z-30">
      <div id="logo" className="flex items-center min-w-0 flex-shrink-0 gap-1 sm:gap-2" onClick={()=>navigate("/")}>
        <img src={logo} alt="GCC" className="h-7 xs:h-8 sm:h-10 w-auto object-contain" />
        <h1 className="text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-lg font-semibold whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px] xs:max-w-[150px] sm:max-w-none">
          GOOD CHOICE CAR
        </h1>
      </div>

      {/* Desktop Search */}
      <div
        id="search"
        className="relative items-center flex flex-1 max-w-md mx-4 max-md:hidden"
        ref={searchRef}
      >
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search for used car..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyPress}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            className="w-full rounded-lg bg-neutral-100 p-2 pl-10 pr-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          {searchValue && (
            <button
              onClick={() => {
                setSearchValue("");
                setShowSuggestions(false);
                dispatch(setSearchQuery(""));
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <i className="fa-solid fa-times"></i>
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 max-h-80 overflow-y-auto z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {suggestions.map((suggestion) => (
              <div
                key={suggestion._id}
                // Desktop click
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSuggestionClick(suggestion);
                }}
                // Mobile touch handlers
                onTouchStart={(e) => {
                  // don't stop propagation here, just mark - we rely on recentlyNavigatedRef to avoid duplicates
                  e.stopPropagation();
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSuggestionClick(suggestion);
                }}
                className="p-3 hover:bg-gray-50 active:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors touch-manipulation select-none"
                style={{
                  WebkitTapHighlightColor: "transparent",
                  touchAction: "manipulation",
                }}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={suggestion.image || defaultimg}
                    alt={suggestion.title}
                    className="w-12 h-12 object-cover rounded"
                    draggable={false}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {suggestion.title}
                    </p>
                    {suggestion.color && (
                      <p className="text-sm text-gray-500">
                        {suggestion.color}
                      </p>
                    )}
                    {suggestion.price?.amount && (
                      <p className="text-sm font-semibold text-emerald-600">
                        ₹ {suggestion.price.amount.toLocaleString("en-IN")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Search Icon */}
      <div className="md:hidden flex items-center gap-2">
        <button
          onClick={handleMobileSearchToggle}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Search"
        >
          <i className="fa-solid fa-magnifying-glass text-lg"></i>
        </button>
        <a
          href="https://maps.app.goo.gl/K1WkYmiTh5S7yFiG6?g_st=ipc"
          id="area"
          className="flex items-center gap-1 px-2"
        >
          <i className="fa-solid fa-route text-sm"></i>
        </a>
      </div>

      {/* Desktop Location */}
      <a
        href="https://maps.app.goo.gl/K1WkYmiTh5S7yFiG6?g_st=ipc"
        id="area"
        className="hidden md:flex justify-between items-center gap-2 px-2 hover:text-blue-600 transition-colors"
      >
        <i className="fa-solid fa-route"></i>
        <p>Motihari</p>
      </a>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div
          className="fixed inset-0 bg-black/50 z-[100] md:hidden animate-fadeIn"
          onClick={() => setShowMobileSearch(false)}
        >
          <div
            className="bg-white p-3 sm:p-4 shadow-lg animate-slideDown relative z-[101]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  id="mobile-search-input"
                  type="text"
                  placeholder="Search for used car..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowSuggestions(true);
                  }}
                  className="w-full rounded-lg bg-neutral-100 p-2.5 sm:p-3 pl-9 sm:pl-10 pr-9 sm:pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
                <i className="fa-solid fa-magnifying-glass absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                {searchValue && (
                  <button
                    onClick={() => {
                      setSearchValue("");
                      setShowSuggestions(false);
                      dispatch(setSearchQuery(""));
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                    aria-label="Clear search"
                  >
                    <i className="fa-solid fa-times text-sm"></i>
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowMobileSearch(false)}
                className="p-2 text-gray-600 hover:text-gray-900 flex-shrink-0"
                aria-label="Close search"
              >
                <i className="fa-solid fa-times text-lg"></i>
              </button>
            </div>

            {/* Mobile Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                className="mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-y-auto z-[60]"
                onClick={(e) => e.stopPropagation()}
              >
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion._id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSuggestionClick(suggestion);
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSuggestionClick(suggestion);
                    }}
                    className="p-2.5 sm:p-3 hover:bg-gray-50 active:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors touch-manipulation select-none"
                    style={{
                      WebkitTapHighlightColor: "transparent",
                      touchAction: "manipulation",
                    }}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <img
                        src={suggestion.image || defaultimg}
                        alt={suggestion.title}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded flex-shrink-0"
                        draggable={false}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate text-xs sm:text-sm">
                          {suggestion.title}
                        </p>
                        {suggestion.color && (
                          <p className="text-xs text-gray-500 truncate">
                            {suggestion.color}
                          </p>
                        )}
                        {suggestion.price?.amount && (
                          <p className="text-xs font-semibold text-emerald-600">
                            ₹ {suggestion.price.amount.toLocaleString("en-IN")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
