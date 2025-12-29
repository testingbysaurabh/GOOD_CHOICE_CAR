import axios from "axios";
import React, { useEffect, useRef, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, addPosts, setPagination, setFilters, resetFilters, setLoading, resetPosts, } from "../utils/store/PublicSlice";
import defaultimg from "../assets/default.png";
import trans from "../assets/trans.svg";
import { HomeGridSkeleton } from "./Simmer";
import Nocarfound from "../assets/Nocarfound.png"


const Home = () => {
  const dispatch = useDispatch();
  const { posts, pagination, filters, searchQuery, loading } = useSelector((state) => state.publicSlice || {
    posts: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalPosts: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
    filters: {
      minPrice: "",
      maxPrice: "",
      minYear: "",
      maxYear: "",
      fuelType: "",
      transmission: "",
      color: "",
    },
    searchQuery: "",
    loading: false,
  }
  );

  const [showFilters, setShowFilters] = useState(false);
  const [filterValues, setFilterValues] = useState(filters);
  const observerTarget = useRef(null);
  const [yearError, setYearError] = useState("");


  // Sync filterValues with Redux filters
  useEffect(() => {
    setFilterValues(filters);
  }, [filters]);


  const fetchPosts = useCallback(
    async (page = 1, reset = false, currentFilters = filters, currentSearchQuery = searchQuery) => {
      try {
        dispatch(setLoading(true));
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "12",
        });

        // Add search query if present
        if (currentSearchQuery) {
          params.append("q", currentSearchQuery);
        }

        // Add filters to params
        Object.keys(currentFilters).forEach((key) => {
          if (currentFilters[key]) {
            params.append(key, currentFilters[key]);
          }
        });

        const res = await axios.get(`${import.meta.env.VITE_DOMAIN}/api/feed?${params.toString()}`);
        if (reset) {
          dispatch(setPosts(res.data.data));
        } else {
          dispatch(addPosts(res.data.data));
        }
        dispatch(setPagination(res.data.pagination));
      } catch (error) {
        toast.error(error.response?.data?.error || "Error fetching posts");
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, filters, searchQuery]
  );

  useEffect(() => {
    dispatch(resetPosts());
    const fetchInitialPosts = async () => {
      try {
        dispatch(setLoading(true));
        const params = new URLSearchParams({ page: "1", limit: "12" });

        // Add search query if present
        if (searchQuery) {
          params.append("q", searchQuery);
        }

        // Add filters
        Object.keys(filters).forEach((key) => {
          if (filters[key]) {
            params.append(key, filters[key]);
          }
        });

        const res = await axios.get(`${import.meta.env.VITE_DOMAIN}/api/feed?${params.toString()}`
        );
        dispatch(setPosts(res.data.data));
        dispatch(setPagination(res.data.pagination));
      } catch (error) {
        toast.error(error.response?.data?.error || "Error fetching posts");
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchInitialPosts();
  }, [filters, searchQuery, dispatch]);

  // Infinite scroll observer
  useEffect(() => {
    if (!pagination?.hasNextPage || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pagination?.hasNextPage && !loading) {
          fetchPosts(pagination.currentPage + 1, false, filters, searchQuery);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [pagination?.hasNextPage, loading, pagination?.currentPage, fetchPosts, filters, searchQuery,]);


  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => {
      const updated = { ...prev, [key]: value };

      const minY = parseInt(updated.minYear);
      const maxY = parseInt(updated.maxYear);

      // Reset error
      setYearError("");

      // Validate only when year fields change
      if (key === "minYear" || key === "maxYear") {
        if (value && value.length !== 4) {
          setYearError("Year must be exactly 4 digits.");
        } else if (minY && minY < 1990) {
          setYearError("Min Year cannot be less than 1990.");
        } else if (maxY && maxY > 2099) {
          setYearError("Max Year cannot be greater than 2099.");
        } else if (minY && maxY && minY > maxY) {
          setYearError("Min Year cannot be greater than Max Year.");
        }
      }

      return updated;
    });
  };



  const applyFilters = () => {
    if (yearError) {
      toast.error("Please fix the year input before applying filters.");
      return;
    }

    dispatch(setFilters(filterValues));
    setShowFilters(false);
  };




  const clearFilters = () => {
    setFilterValues({ minPrice: "", maxPrice: "", minYear: "", maxYear: "", fuelType: "", transmission: "", color: "", });
    dispatch(resetFilters());
    setShowFilters(false);
  };

  return (
    <div className="absolute min-w-[100%] min-h-[100%] overflow-hidden">
      <div className="fixed inset-0">
        <div className="h-99 w-99 bg-[#e8f6fef2] rounded-full absolute top-7 -right-20"></div>
        <div className="h-99 w-99 bg-[#a695fd3e] rounded-full absolute -bottom-10 -left-20"></div>
      </div>

      <Navbar />
      <div
        id="con"
        className="w-[85vw]  min-h-screen flex flex-col mx-auto relative max-md:w-[100vw]"
      >
        <div
          id="fn"
          className="md:top-4  fixed max-md:w-full md:w-[85vw] shadow-gray-500 max-md:shadow-inner max-md:rounded-t-sm flex flex-col  max-md:z-10 max-md:bottom-0 md:mt-14 md:fixed z-20"
        >
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-2 bg-gray-50  text-black rounded-md transition-colors flex justify-between items-center border-gray-200 border "
          >
            {showFilters ? (
              <i className="fa-solid fa-angle-up text-blue-600"></i>
            ) : (
              <i className="fa-solid fa-filter"></i>
            )}
            <i className="fa-solid fa-gas-pump"></i>
            <img src={trans} className="h-6 w-6" alt="" />
            <i className="fa-solid fa-up-down"></i>
          </button>

          {showFilters && (
            <div className="bg-white p-4 shadow-lg rounded-md m-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Min Price
                </label>
                <input
                  min={1000}
                  type="number"
                  value={filterValues.minPrice}
                  onChange={(e) =>
                    handleFilterChange("minPrice", e.target.value)
                  }
                  placeholder="Min Price"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price
                </label>
                <input
                  min={1000}
                  type="number"
                  value={filterValues.maxPrice}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", e.target.value)
                  }
                  placeholder="Max Price"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Year
                </label>
                <input
                  min={1990}
                  type="number"
                  value={filterValues.minYear}
                  onChange={(e) =>
                    handleFilterChange("minYear", e.target.value)
                  }
                  placeholder="Min Year"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />{yearError && (<p className="text-red-500 text-xs mt-1">{yearError}</p>)}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Year
                </label>
                <input
                  min={1990}
                  type="number"
                  value={filterValues.maxYear}
                  onChange={(e) =>
                    handleFilterChange("maxYear", e.target.value)
                  }
                  placeholder="Max Year"
                  className=" w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />{yearError && (<p className="text-red-500 text-xs mt-1">{yearError}</p>)}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuel Type
                </label>
                <select
                  value={filterValues.fuelType}
                  onChange={(e) =>
                    handleFilterChange("fuelType", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="CNG">CNG</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transmission
                </label>
                <select
                  value={filterValues.transmission}
                  onChange={(e) =>
                    handleFilterChange("transmission", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="text"
                  value={filterValues.color}
                  onChange={(e) => handleFilterChange("color", e.target.value)}
                  placeholder="Color"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  onClick={applyFilters}
                  className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-600 transition-colors w-full"
                >
                  Apply
                </button>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors w-full"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        <div
          id="mainContent"
          className="md:mt-26 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 pt-1 max-md:mt-15 "
        >
          {loading && posts.length === 0 && <HomeGridSkeleton count={12} />}

          {posts && posts.length > 0 &&
            posts.map((item) => (
              <CarCard key={item._id} car={item} />
            ))}

          {!loading && posts.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center p-8">
              <p className="text-center text-gray-500 text-lg mb-4">
                No Data Found
              </p>
              <img className="w-[70%] max-md:w-[100vw] mt-20 rounded-full h-full object-contain" src={Nocarfound} alt="Nocarfound" />
            </div>
          )}


          <div ref={observerTarget} className="h-10"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;

export const CarCard = ({ car }) => {
  const {
    _id,
    brand,
    model,
    color,
    fuelType,
    images = [],
    kilometersDriven,
    registrationYear,
    variant,
    price,
  } = car || {};
  const nav = useNavigate();

  const imageSrc = images[0] || defaultimg;
  const formattedPrice =
    price?.amount != null ? price.amount.toLocaleString("en-IN") : "—";
  const kmText =
    kilometersDriven != null
      ? `${kilometersDriven.toLocaleString("en-IN")} km`
      : "";
  const imageCount = images.length || 0;

  return (
    <div
      key={_id}
      onClick={() => nav(`/detailview?id=${_id}`)}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden 
                 hover:shadow-xl transition-all duration-200 cursor-pointer
                 w-full"
    >
      {/* Image section */}
      <div className="relative w-full">
        <img
          src={imageSrc}
          alt={model}
          className="w-full h-40 xs:h-48 sm:h-52 md:h-56 object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/40 pointer-events-none" />

        {/* Top-left: year + fuel */}
        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 flex gap-1.5 sm:gap-2">
          {registrationYear && (
            <span
              className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/90 
                             text-[9px] sm:text-[11px] font-semibold tracking-wide uppercase text-gray-800 shadow-sm"
            >
              {registrationYear}
            </span>
          )}

          {fuelType && (
            <span
              className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/70 
                             text-[9px] sm:text-[11px] font-semibold tracking-wide uppercase text-white shadow-sm"
            >
              {fuelType}
            </span>
          )}
        </div>

        {/* Top-right: image count */}
        {imageCount > 0 && (
          <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
            <span
              className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/70 
                             text-[9px] sm:text-[11px] font-medium text-white shadow-sm"
            >
              1/{imageCount}
            </span>
          </div>
        )}

        {/* Bottom-left: variant */}
        {variant && (
          <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2">
            <span
              className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/65 
                             text-[9px] sm:text-[11px] font-medium text-white shadow-sm"
            >
              {variant}
            </span>
          </div>
        )}

        {/* Bottom-right: km */}
        {kmText && (
          <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2">
            <span
              className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/65 
                             text-[9px] sm:text-[11px] font-medium text-white shadow-sm"
            >
              {kmText}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-3 sm:px-4 pt-2.5 sm:pt-3 pb-3 sm:pb-4 flex flex-col gap-1.5 sm:gap-2">
        {/* Title */}
        <p className="text-[13px] sm:text-[15px] font-semibold text-gray-900 leading-snug line-clamp-1 flex items-center justify-between">
          {model && <span className="uppercase">{model}</span>}
          {brand && <span className="capitalize">{brand} </span>}
        </p>

        {/* Price + color */}
        <div className="flex items-center justify-between mt-0.5 sm:mt-1 gap-2">
          <p className="text-lg sm:text-xl font-bold text-emerald-600">
            ₹ {formattedPrice}
          </p>

          {color && (
            <span
              className="px-2.5 sm:px-3 py-0.5 rounded-full bg-gray-100 
                             text-[10px] sm:text-[11px] text-gray-700 whitespace-nowrap"
            >
              {color}
            </span>
          )}
        </div>

        {/* Chips */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1 sm:mt-2">
          {registrationYear && (
            <span
              className="px-2.5 sm:px-3 py-0.5 rounded-full bg-gray-100 
                             text-[10px] sm:text-[11px] text-gray-700"
            >
              Reg. {registrationYear}
            </span>
          )}

          {fuelType && (
            <span
              className="px-2.5 sm:px-3 py-0.5 rounded-full bg-gray-100 
                             text-[10px] sm:text-[11px] text-gray-700"
            >
              {fuelType}
            </span>
          )}

          {variant && (
            <span
              className="px-2.5 sm:px-3 py-0.5 rounded-full bg-gray-100 
                             text-[10px] sm:text-[11px] text-gray-700"
            >
              {variant}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
