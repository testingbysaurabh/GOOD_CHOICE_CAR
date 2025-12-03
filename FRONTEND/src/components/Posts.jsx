import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AdminPanel } from "./AdminPanel";
import axios from "axios";
import toast from "react-hot-toast";
import { removePost } from "../utils/store/UserSlice";
import { useNavigate } from "react-router-dom";

const Posts = () => {
  const userData = useSelector((store) => store.User.posts);
  const [deletingId, setDeletingId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [imageIndexes, setImageIndexes] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const posts = useSelector((s) => s.User?.posts || []);

  function convertDateTime(isoString) {
    const date = new Date(isoString);

    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    const time = `${hours}:${minutes} ${ampm}`;

    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();

    const finalDate = `${day} ${month} ${year}`;

    return `${finalDate} • ${time}`;
  }

  const deletefnhandler = async (id) => {
    try {
      setDeletingId(id);
      const res = await axios.delete(
        `${import.meta.env.VITE_DOMAIN}/api/admin/posts/delete/${id}`,
        { withCredentials: true }
      );
      toast.success("Post deleted successfully ");
      dispatch(removePost(id));
    } catch (error) {
      toast.error(error.message || "Failed to delete post ");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  // Image navigator
  const prevImage = (postId, length) => {
    setImageIndexes((prev) => {
      const current = typeof prev[postId] === "number" ? prev[postId] : 0;
      const nextIndex = (current - 1 + length) % length;
      return { ...prev, [postId]: nextIndex };
    });
  };

  const nextImage = (postId, length) => {
    setImageIndexes((prev) => {
      const current = typeof prev[postId] === "number" ? prev[postId] : 0;
      const nextIndex = (current + 1) % length;
      return { ...prev, [postId]: nextIndex };
    });
  };

  const getCurrentImage = (post) => {
    const imgs = post.images || [];
    if (!imgs.length) return null;
    const idx =
      typeof imageIndexes[post._id] === "number" ? imageIndexes[post._id] : 0;
    const safeIdx = Math.max(0, Math.min(idx, imgs.length - 1));
    return imgs[safeIdx];
  };

  return (
    <div>
      <AdminPanel />

      <div className="absolute mt-20 ml-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-5 w-[93%] shadow-inner max-md:w-fit max-md:mt-14">
        {userData && userData.length > 0 ? (
          userData.map((item) => {
            const imagesLength = (item.images && item.images.length) || 0;
            const currentIdx =
              typeof imageIndexes[item._id] === "number"
                ? imageIndexes[item._id]
                : 0;
            const displaySrc = getCurrentImage(item) || item.images?.[0] || "";

            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
              >
                <div className="relative">
                  <img
                    src={displaySrc}
                    className="w-full h-48 object-cover"
                    alt={item.model}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/40 pointer-events-none" />

                  <div className="absolute top-2 left-2 flex gap-2">
                    <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-white/90 text-gray-800 font-semibold">
                      {item.registrationYear || "Year N/A"}
                    </span>
                    {item.fuelType && (
                      <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-black/60 text-white font-medium">
                        {item.fuelType}
                      </span>
                    )}
                  </div>

                  {item.variant && (
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end text-xs text-white">
                      <p className="font-medium line-clamp-1">{item.variant}</p>
                      {item.kilometersDriven != null && (
                        <p className="text-[11px] bg-black/50 px-2 py-0.5 rounded-full">
                          {item.kilometersDriven?.toLocaleString("en-IN")} km
                        </p>
                      )}
                    </div>
                  )}

                  {imagesLength > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage(item._id, imagesLength);
                        }}
                        className="pointer-events-auto opacity-30 bg-white/90 hover:bg-white rounded-full w-9 h-9 flex items-center justify-center text-sm font-semibold shadow"
                        aria-label="Previous image"
                        title="Previous image"
                      >
                        ‹
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage(item._id, imagesLength);
                        }}
                        className="pointer-events-auto opacity-30 bg-white/90 hover:bg-white rounded-full w-9 h-9 flex items-center justify-center text-sm font-semibold shadow"
                        aria-label="Next image"
                        title="Next image"
                      >
                        ›
                      </button>
                    </div>
                  )}

                  {/* small image counter */}
                  {imagesLength > 0 && (
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full pointer-events-none">
                      {currentIdx + 1}/{imagesLength}
                    </div>
                  )}
                </div>

                <div className="p-3 flex flex-col gap-2 flex-1">
                  <p className="font-semibold text-gray-900 text-sm line-clamp-1">
                    {item.brand} {item.model}
                  </p>

                  <div className="flex items-center justify-between gap-2">
                    <p className="text-lg font-bold text-emerald-600">
                      ₹ {item.price?.amount?.toLocaleString("en-IN") || "—"}
                    </p>
                    {item.color && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {item.color}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    {item.registrationYear && (
                      <span className="px-2 py-0.5 rounded-full bg-gray-50 border border-gray-100 text-gray-600">
                        Reg. {item.registrationYear}
                      </span>
                    )}
                    {item.fuelType && (
                      <span className="px-2 py-0.5 rounded-full bg-gray-50 border border-gray-100 text-gray-600">
                        {item.fuelType}
                      </span>
                    )}
                    {item.variant && (
                      <span className="px-2 py-0.5 rounded-full bg-gray-50 border border-gray-100 text-gray-600 line-clamp-1">
                        {item.variant}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-400">
                    Uploaded on {convertDateTime(item.createdAt)}
                  </p>
                </div>

                <div className="px-3 pb-3 pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div className="flex flex-col text-[11px] text-gray-500 leading-tight">
                    {item.kilometersDriven != null && (
                      <span>
                        {item.kilometersDriven?.toLocaleString("en-IN")} km
                        driven
                      </span>
                    )}
                    {item.fuelType && <span>{item.fuelType}</span>}
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => deletefnhandler(item._id)}
                      type="button"
                      disabled={deletingId === item._id}
                      className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all border active:scale-[0.97]
                                            ${
                                              deletingId === item._id
                                                ? "bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed opacity-70"
                                                : "bg-red-50 border-red-100 text-red-600 hover:bg-red-100 hover:border-red-200 cursor-pointer"
                                            }`}
                    >
                      {deletingId === item._id ? "Deleting..." : "Delete"}
                    </button>

                    <button
                      onClick={() => navigate(`/postedit/${item._id}`)}
                      type="button"
                      disabled={editId === item._id}
                      className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all border active:scale-[0.97]
                                                       ${
                                                         editId === item._id
                                                           ? "bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed opacity-70"
                                                           : "bg-red-50 border-red-100 text-red-600 hover:bg-red-100 hover:border-red-200 cursor-pointer"
                                                       }`}
                    >
                      {editId === item._id ? "Editing..." : "Edit"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 col-span-full text-sm text-center py-10">
            No posts found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Posts;
