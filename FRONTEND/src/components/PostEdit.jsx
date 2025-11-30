import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import { updatePost } from "../utils/store/UserSlice";
import { EditPostSkeleton } from "./Simmer";
import { useGlobalContext } from "../utils/context/MyContext";

const PostsEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, setIsLoading } = useGlobalContext();

  const posts = useSelector((store) => store.User.posts); // tumne pehle ye structure banaya tha
  const currentPost = posts?.find((p) => p._id === id);

  const [editData, setEditData] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (currentPost) {
      setEditData(JSON.parse(JSON.stringify(currentPost)));
    }
  }, [currentPost]);

  if (!currentPost && !editData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow-md rounded-2xl px-6 py-5 flex flex-col items-center gap-3">
          <p className="text-gray-700 text-sm">
            Post not found or data not loaded.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!editData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-sm">Loading post data...</p>
      </div>
    );
  }

  const handleChange = (key, value) => {
    setEditData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePriceChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      price: {
        ...prev.price,
        [field]: value,
      },
    }));
  };

  const handleSellerChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      seller: {
        ...prev.seller,
        [field]: value,
      },
    }));
  };

  const handleLocationChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      seller: {
        ...prev.seller,
        location: {
          ...prev.seller.location,
          [field]: value,
        },
      },
    }));
  };

  const handleImageChange = (value) => {
    setEditData((prev) => ({
      ...prev,
      images: value ? [value] : [],
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setIsLoading(true);

      const payload = {
        brand: editData.brand,
        model: editData.model,
        variant: editData.variant,
        price: {
          amount: Number(editData?.price?.amount) || 0,
          currency: editData?.price?.currency || "INR",
        },
        kilometersDriven: Number(editData.kilometersDriven) || 0,
        manufacturingYear: Number(editData.manufacturingYear) || null,
        registrationYear: Number(editData.registrationYear) || null,
        owners: editData.owners,
        fuelType: editData.fuelType,
        transmission: editData.transmission,
        color: editData.color,
        seller: {
          sellerName: editData?.seller?.sellerName,
          contact: editData?.seller?.contact,
          location: {
            city: editData?.seller?.location?.city,
            area: editData?.seller?.location?.area,
          },
        },
        insurance: Boolean(editData.insurance),
        images: editData.images || [],
      };

      await axios.patch(
        `${import.meta.env.VITE_DOMAIN}/api/admin/posts/edit/${id}`,
        editData,
        { withCredentials: true }
      );
      dispatch(updatePost({ id, data: editData }));
      toast.success("Post Updated");
      navigate(-1);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to update post ❌");
    } finally {
      setSaving(false);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return isLoading ? (
    <EditPostSkeleton />
  ) : (
    <div className="min-h-screen bg-gray-50 ">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between ">
        <div className="flex items-center gap-2">
          <button
            onClick={handleCancel}
            className="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 transition "
          >
            Back
          </button>
          <h1 className="text-sm font-semibold text-gray-900 max-md:text-[10px] max-md:flex max-md:flex-row">
            <span> Edit Post – </span>
            <span className="text-gray-600">
              {editData.brand} {editData.model}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2 max-md:hidden ">
          <button
            onClick={handleCancel}
            disabled={saving}
            className="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-xs font-medium px-4 py-1.5 rounded-full border border-emerald-200 bg-emerald-500 text-white hover:bg-emerald-600 hover:border-emerald-300 active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-6 mb-10 px-3">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid md:grid-cols-[1.7fr,1.3fr] gap-0">
            <div className="relative">
              <img
                src={editData.images?.[0]}
                alt={editData.model}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/10 pointer-events-none" />

              <div className="absolute top-3 left-3 flex gap-2">
                <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-white/90 text-gray-800 font-semibold">
                  {editData.registrationYear || "Reg. Year"}
                </span>
                {editData.fuelType && (
                  <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-black/60 text-white font-medium">
                    {editData.fuelType}
                  </span>
                )}
              </div>

              {editData.variant && (
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-xs text-white">
                  <p className="font-medium line-clamp-1">
                    {editData.brand} {editData.model} • {editData.variant}
                  </p>
                  {editData.kilometersDriven != null && (
                    <p className="text-[11px] bg-black/50 px-2 py-0.5 rounded-full">
                      {Number(editData.kilometersDriven)?.toLocaleString(
                        "en-IN"
                      )}{" "}
                      km
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 flex flex-col justify-between border-l border-gray-100 bg-gray-50/60">
              <div className="space-y-3">
                <p className="font-semibold text-gray-900 text-sm line-clamp-2">
                  {editData.brand} {editData.model}{" "}
                  {editData.variant && `• ${editData.variant}`}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-2xl font-bold text-emerald-600">
                    ₹{" "}
                    {Number(editData?.price?.amount || 0).toLocaleString(
                      "en-IN"
                    )}
                  </p>
                  {editData.color && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      {editData.color}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {editData.manufacturingYear && (
                    <span className="px-2 py-0.5 rounded-full bg-white border border-gray-100 text-gray-600">
                      Mfg. {editData.manufacturingYear}
                    </span>
                  )}
                  {editData.registrationYear && (
                    <span className="px-2 py-0.5 rounded-full bg-white border border-gray-100 text-gray-600">
                      Reg. {editData.registrationYear}
                    </span>
                  )}
                  {editData.transmission && (
                    <span className="px-2 py-0.5 rounded-full bg-white border border-gray-100 text-gray-600">
                      {editData.transmission}
                    </span>
                  )}
                  {editData.owners && (
                    <span className="px-2 py-0.5 rounded-full bg-white border border-gray-100 text-gray-600">
                      {editData.owners} Owner
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-full bg-white border border-gray-100 text-gray-600">
                    Insurance: {editData.insurance ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              <div className="mt-4 text-[11px] text-gray-500">
                <p className="font-medium text-gray-700 mb-1">
                  Seller: {editData?.seller?.sellerName || "—"}
                </p>
                <p>
                  {editData?.seller?.location?.area &&
                    `${editData.seller.location.area}, `}
                  {editData?.seller?.location?.city}
                </p>
                <p>{editData?.seller?.contact}</p>
              </div>
            </div>
          </div>

          <div className="p-5 grid md:grid-cols-2 gap-5 border-t border-gray-100">
            <div className="space-y-4">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Car Details
              </h2>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-500 mb-1">Brand</label>
                  <input
                    type="text"
                    value={editData.brand || ""}
                    onChange={(e) => handleChange("brand", e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                    placeholder="mahindra-44"
                  />
                </div>

                <div>
                  <label className="block text-gray-500 mb-1">Model</label>
                  <input
                    type="text"
                    value={editData.model || ""}
                    onChange={(e) => handleChange("model", e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                    placeholder="bolero"
                  />
                </div>

                <div>
                  <label className="block text-gray-500 mb-1">Variant</label>
                  <input
                    type="text"
                    value={editData.variant || ""}
                    onChange={(e) => handleChange("variant", e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                    placeholder="ZLX"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-500 mb-1">
                      Manufacturing Year
                    </label>
                    <input
                      type="number"
                      value={editData.manufacturingYear || ""}
                      onChange={(e) =>
                        handleChange("manufacturingYear", e.target.value)
                      }
                      className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                      placeholder="2019"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">
                      Registration Year
                    </label>
                    <input
                      type="number"
                      value={editData.registrationYear || ""}
                      onChange={(e) =>
                        handleChange("registrationYear", e.target.value)
                      }
                      className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                      placeholder="2020"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-500 mb-1">
                      Kilometers Driven
                    </label>
                    <input
                      type="number"
                      value={editData.kilometersDriven || ""}
                      onChange={(e) =>
                        handleChange("kilometersDriven", e.target.value)
                      }
                      className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                      placeholder="45000"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">Owners</label>
                    <input
                      type="text"
                      value={editData.owners || ""}
                      onChange={(e) => handleChange("owners", e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                      placeholder="1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="block text-gray-500">Fuel Type</label>
                    <select
                      value={editData.fuelType || ""}
                      onChange={(e) =>
                        setEditData((p) => ({ ...p, fuelType: e.target.value }))
                      }
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white 
                                     focus:outline-none focus:ring-2 focus:ring-emerald-500/40 
                                   focus:border-emerald-500 text-xs"
                    >
                      {/* <option value="">Select fuel type</option> */}
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="CNG">CNG</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-gray-500">Transmission</label>
                    <select
                      value={editData.transmission || ""}
                      onChange={(e) =>
                        setEditData((p) => ({
                          ...p,
                          transmission: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white 
                                                        focus:outline-none focus:ring-2 focus:ring-emerald-500/40 
                                                        focus:border-emerald-500 text-xs"
                    >
                      {/* <option value="">Select transmission</option> */}
                      <option value="Manual">Manual</option>
                      <option value="Automatic">Automatic</option>
                      <option value="AMT">AMT</option>
                      <option value="DCT">DCT</option>
                      <option value="CVT">CVT</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-500 mb-1">Color</label>
                  <input
                    type="text"
                    value={editData.color || ""}
                    onChange={(e) => handleChange("color", e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                    placeholder="White"
                  />
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleChange("insurance", !Boolean(editData.insurance))
                    }
                    className={`text-[11px] px-3 py-1.5 rounded-full border transition
                            ${
                              editData.insurance
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                : "bg-gray-50 border-gray-200 text-gray-600"
                            }`}
                  >
                    Insurance: {editData.insurance ? "Yes" : "No"}
                  </button>
                  <span className="text-[11px] text-gray-400">
                    Toggle if car has valid insurance
                  </span>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Pricing & Seller
              </h2>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-[2fr,1fr] gap-3">
                  <div>
                    <label className="block text-gray-500 mb-1">
                      Price Amount
                    </label>
                    <input
                      type="number"
                      value={editData?.price?.amount || ""}
                      onChange={(e) =>
                        handlePriceChange("amount", e.target.value)
                      }
                      className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                      placeholder="550000"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">Currency</label>
                    <input
                      disabled
                      type="text"
                      value={editData?.price?.currency || "INR"}
                      onChange={(e) =>
                        handlePriceChange("currency", e.target.value)
                      }
                      className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                      placeholder="INR"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 mt-2" />

                <div>
                  <label className="block text-gray-500 mb-1">
                    Seller Name
                  </label>
                  <input
                    type="text"
                    value={editData?.seller?.sellerName || ""}
                    onChange={(e) =>
                      handleSellerChange("sellerName", e.target.value)
                    }
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                    placeholder="Good Choice Car"
                  />
                </div>

                <div>
                  <label className="block text-gray-500 mb-1">Contact</label>
                  <input
                    type="text"
                    value={editData?.seller?.contact || ""}
                    onChange={(e) =>
                      handleSellerChange("contact", e.target.value)
                    }
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                    placeholder="+91..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-500 mb-1">City</label>
                    <input
                      type="text"
                      value={editData?.seller?.location?.city || ""}
                      onChange={(e) =>
                        handleLocationChange("city", e.target.value)
                      }
                      className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                      placeholder="Motihari"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">Area</label>
                    <input
                      type="text"
                      value={editData?.seller?.location?.area || ""}
                      onChange={(e) =>
                        handleLocationChange("area", e.target.value)
                      }
                      className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                      placeholder="Bada Bariyarpur"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 mt-2" />

                <div>
                  <label className="block text-gray-500 mb-1">
                    Image URL (1st Image)
                  </label>
                  <input
                    type="text"
                    value={editData.images?.[0] || ""}
                    onChange={(e) => handleImageChange(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                    placeholder="https://example.com/car1.jpg"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    Tum multiple images backend se handle kar sakte ho, yaha
                    preview ke liye sirf pehla URL le raha hun.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between md:hidden">
            <button
              onClick={handleCancel}
              disabled={saving}
              className="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-xs font-medium px-4 py-1.5 rounded-full border border-emerald-200 bg-emerald-500 text-white hover:bg-emerald-600 hover:border-emerald-300 active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostsEdit;
