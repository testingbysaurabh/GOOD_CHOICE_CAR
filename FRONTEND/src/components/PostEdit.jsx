import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { updatePost } from "../utils/store/UserSlice";
import { EditPostSkeleton } from "./Simmer";
import { useGlobalContext } from "../utils/context/MyContext";





const PostsEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, setIsLoading } = useGlobalContext();

  const posts = useSelector((s) => s.User.posts);
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
          <p className="text-gray-700 text-sm">Post not found or not loaded yet.</p>
          <button
            onClick={() => navigate(-1)}
            className="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  if (!editData) {
    return <EditPostSkeleton />;
  }

  // Generic setters
  const setField = (key, value) => setEditData((p) => ({ ...p, [key]: value }));
  const setPriceField = (field, value) =>
    setEditData((p) => ({ ...p, price: { ...(p.price || {}), [field]: value } }));
  const setSellerField = (field, value) =>
    setEditData((p) => ({ ...p, seller: { ...(p.seller || {}), [field]: value } }));
  const setSellerLocation = (field, value) =>
    setEditData((p) => ({
      ...p,
      seller: {
        ...(p.seller || {}),
        location: { ...((p.seller && p.seller.location) || {}), [field]: value },
      },
    }));

  // IMAGE helpers: only remove and set-as-main
  const removeImageAt = (index) => {
    setEditData((p) => {
      const imgs = Array.isArray(p.images) ? [...p.images] : [];
      if (index < 0 || index >= imgs.length) return p;
      imgs.splice(index, 1);
      return { ...p, images: imgs };
    });
  };

  const setAsMain = (index) => {
    setEditData((p) => {
      const imgs = Array.isArray(p.images) ? [...p.images] : [];
      if (index <= 0 || index >= imgs.length) return p; // already main or invalid
      const [img] = imgs.splice(index, 1);
      imgs.unshift(img);
      return { ...p, images: imgs };
    });
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
        kilometersDriven:
          editData.kilometersDriven !== "" && editData.kilometersDriven != null
            ? Number(editData.kilometersDriven)
            : undefined,
        manufacturingYear:
          editData.manufacturingYear !== "" && editData.manufacturingYear != null
            ? Number(editData.manufacturingYear)
            : undefined,
        registrationYear:
          editData.registrationYear !== "" && editData.registrationYear != null
            ? Number(editData.registrationYear)
            : undefined,
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
            pincode: editData?.seller?.location?.pincode || "",
          },
        },
        insurance: Boolean(editData.insurance),
        images: Array.isArray(editData.images) ? editData.images : [],
      };

      const res = await axios.patch(
        `${import.meta.env.VITE_DOMAIN}/api/admin/posts/edit/${id}`,
        payload,
        { withCredentials: true }
      );

      const updated = res.data?.data || payload;
      dispatch(updatePost({ id, data: updated }));

      toast.success("Post updated successfully ");
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Failed to update post ");
    } finally {
      setSaving(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
          >
            Back
          </button>
          <h1 className="text-sm font-semibold text-gray-900">
            Edit Post —{" "}
            <span className="text-gray-600 font-normal">
              {editData.brand} {editData.model}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            disabled={saving}
            className="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="text-xs font-medium px-4 py-1.5 rounded-full border border-emerald-200 bg-emerald-500 text-white hover:bg-emerald-600 active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-6 px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid md:grid-cols-[1.7fr,1.3fr] gap-0">
            {/* Left: main image preview */}
            <div className="relative">
              <img
                src={editData.images?.[0] || ""}
                alt={editData.model}
                className="w-full h-64 object-cover bg-gray-100"
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
                      {Number(editData.kilometersDriven).toLocaleString("en-IN")} km
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Right summary */}
            <div className="p-4 flex flex-col justify-between border-l border-gray-100 bg-gray-50/60">
              <div className="space-y-3">
                <p className="font-semibold text-gray-900 text-sm line-clamp-2">
                  {editData.brand} {editData.model} {editData.variant ? `• ${editData.variant}` : ""}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-2xl font-bold text-emerald-600">
                    ₹ {Number(editData?.price?.amount || 0).toLocaleString("en-IN")}
                  </p>
                  {editData.color && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      {editData.color}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {editData.manufacturingYear && <Badge text={`Mfg. ${editData.manufacturingYear}`} />}
                  {editData.registrationYear && <Badge text={`Reg. ${editData.registrationYear}`} />}
                  {editData.transmission && <Badge text={editData.transmission} />}
                  {editData.owners && <Badge text={`${editData.owners} Owner`} />}
                  <Badge text={`Insurance: ${editData.insurance ? "Yes" : "No"}`} />
                </div>
              </div>

              <div className="mt-4 text-[11px] text-gray-500">
                <p className="font-medium text-gray-700 mb-1">Seller: {editData?.seller?.sellerName || "—"}</p>
                <p>
                  {editData?.seller?.location?.area && `${editData.seller.location.area}, `}
                  {editData?.seller?.location?.city}
                  {editData?.seller?.location?.pincode ? ` • ${editData.seller.location.pincode}` : ""}
                </p>
                <p>{editData?.seller?.contact}</p>
              </div>
            </div>
          </div>

          {/* Editable form */}
          <div className="p-5 grid md:grid-cols-2 gap-5 border-t border-gray-100">
            {/* Left column: car details */}
            <div className="space-y-4">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Car Details</h2>

              <div className="space-y-3 text-xs">
                <FormInput label="Brand" value={editData.brand} onChange={(v) => setField("brand", v)} />
                <FormInput label="Model" value={editData.model} onChange={(v) => setField("model", v)} />
                <FormInput label="Variant" value={editData.variant} onChange={(v) => setField("variant", v)} />

                <div className="grid grid-cols-2 gap-3">
                  <FormInput label="Manufacturing Year" type="number" value={editData.manufacturingYear} onChange={(v) => setField("manufacturingYear", v)} />
                  <FormInput label="Registration Year" type="number" value={editData.registrationYear} onChange={(v) => setField("registrationYear", v)} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <FormInput label="Kilometers Driven" type="number" value={editData.kilometersDriven} onChange={(v) => setField("kilometersDriven", v)} />
                  <FormInput label="Owners" value={editData.owners} onChange={(v) => setField("owners", v)} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <SelectInput label="Fuel Type" value={editData.fuelType} onChange={(v) => setField("fuelType", v)} options={["Petrol","Diesel","CNG","Electric","Hybrid","Other"]} />
                  <SelectInput label="Transmission" value={editData.transmission} onChange={(v) => setField("transmission", v)} options={["Manual","Automatic","AMT","Other"]} />
                </div>

                <FormInput label="Color" value={editData.color} onChange={(v) => setField("color", v)} />

                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setField("insurance", !Boolean(editData.insurance))}
                    className={`text-[11px] px-3 py-1.5 rounded-full border transition ${editData.insurance ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-gray-50 border-gray-200 text-gray-600"}`}
                  >
                    Insurance: {editData.insurance ? "Yes" : "No"}
                  </button>
                  <span className="text-[11px] text-gray-400">Toggle if car has valid insurance</span>
                </div>
              </div>
            </div>

            {/* Right column: pricing, seller, images manager (remove + set-as-main only) */}
            <div className="space-y-4">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pricing & Seller</h2>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-[2fr,1fr] gap-3">
                  <FormInput label="Price Amount" type="number" value={editData?.price?.amount || ""} onChange={(v) => setPriceField("amount", v)} />
                  <FormInput label="Currency" value={editData?.price?.currency || "INR"} onChange={(v) => setPriceField("currency", v)} disabled />
                </div>

                <hr />

                <FormInput label="Seller Name" value={editData?.seller?.sellerName || ""} onChange={(v) => setSellerField("sellerName", v)} />
                <FormInput label="Contact" value={editData?.seller?.contact || ""} onChange={(v) => setSellerField("contact", v)} />

                <div className="grid grid-cols-3 gap-3">
                  <FormInput label="City" value={editData?.seller?.location?.city || ""} onChange={(v) => setSellerLocation("city", v)} />
                  <FormInput label="Area" value={editData?.seller?.location?.area || ""} onChange={(v) => setSellerLocation("area", v)} />
                  <FormInput label="Pincode" value={editData?.seller?.location?.pincode || ""} onChange={(v) => setSellerLocation("pincode", v)} />
                </div>

                <hr />

                {/* Images manager: thumbnails, set-as-main, remove */}
                <div>
                  <label className="block text-gray-500 mb-2 text-xs font-medium">Images</label>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {(editData.images || []).map((src, idx) => (
                      <div key={idx} className="relative border rounded overflow-hidden">
                        <img src={src} alt={`img-${idx}`} className="w-full h-20 object-cover" />
                        {/* Main badge */}
                        {idx === 0 && (
                          <div className="absolute top-1 left-1 px-2 py-0.5 rounded bg-white/90 text-[10px] text-gray-800 font-semibold">Main</div>
                        )}

                        <div className="absolute top-1 right-1 flex flex-col gap-1">
                          {idx !== 0 && (
                            <button onClick={() => setAsMain(idx)} className="bg-white/90 text-xs px-2 py-0.5 rounded">Set as Main</button>
                          )}
                          <button onClick={() => { if (confirm("Remove this image?")) removeImageAt(idx); }} className="bg-white/90 text-xs px-2 py-0.5 rounded text-red-600">Remove</button>
                        </div>
                      </div>
                    ))}
                    {!(editData.images && editData.images.length) && (
                      <div className="col-span-3 text-xs text-gray-400">No images available.</div>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-400">Images are managed from backend — here you can remove images or choose which one is the main (first) image.</p>
                </div>
              </div>
            </div>
          </div>

          {/* bottom mobile actions */}
          <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between md:hidden">
            <button onClick={() => navigate(-1)} disabled={saving} className="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 transition disabled:opacity-60 disabled:cursor-not-allowed">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="text-xs font-medium px-4 py-1.5 rounded-full border border-emerald-200 bg-emerald-500 text-white hover:bg-emerald-600 active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- Small UI helpers ---------- */

function FormInput({ label, value, onChange, type = "text", disabled = false, min }) {
  return (
    <div>
      <label className="block text-gray-500 mb-1 text-xs">{label}</label>
      <input
        min={min}
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition ${disabled ? "bg-gray-50" : "bg-white"}`}
      />
    </div>
  );
}

function SelectInput({ label, value, onChange, options = [] }) {
  return (
    <div>
      <label className="block text-gray-500 mb-1 text-xs">{label}</label>
      <select value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500">
        <option value="">Select</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Badge({ text }) {
  return <span className="px-2 py-0.5 rounded-full bg-white border border-gray-100 text-gray-600 text-[11px]">{text}</span>;
}

export default PostsEdit;
