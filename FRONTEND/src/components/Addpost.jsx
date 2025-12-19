import React, { useState, useRef } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addPost } from "../utils/store/UserSlice";

const AddPost = () => {
  const [form, setForm] = useState({
    brand: "",
    model: "",
    variant: "",
    amount: "",
    kilometersDriven: "",
    manufacturingYear: "",
    registrationYear: "",
    owners: "",
    fuelType: "",
    transmission: "",
    color: "",
    sellerName: "GOOD CHOICE CAR",
    contact: "",
    city: "Motihari",
    area: "Bada Bariyarpur Near Durga Chok",
    pincode: "845401",
    insurance: true,
  });

  

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    if (files.length + selected.length > 10) {
      setMessage({ type: "error", text: "Max 10 images allowed." });
      return;
    }

    setFiles((prev) => [...prev, ...selected]);

    selected.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviews((prev) => [
          ...prev,
          { id: Math.random().toString(36).slice(2), src: ev.target.result },
        ]);
      };
      reader.readAsDataURL(file);
    });

    setMessage(null);
  };

  const removeImage = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const setMain = (index) => {
    if (index === 0) return;

    setFiles((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(index, 1);
      arr.unshift(item);
      return arr;
    });

    setPreviews((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(index, 1);
      arr.unshift(item);
      return arr;
    });
  };

  const handleCancel = () => {
    nav("/posts");
  };
  const validate = () => {
    const newErrors = {};

    if (!form.brand.trim()) newErrors.brand = "Brand is required.";
    if (!form.model.trim()) newErrors.model = "Model is required.";

    const amountNum = Number(form.amount);
    if (!form.amount || isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = "Valid price amount is required.";
    }

    if (!form.registrationYear) {
      newErrors.registrationYear = "Registration year is required.";
    }

    if (form.kilometersDriven !== "" && form.kilometersDriven != null) {
      const kmNum = Number(form.kilometersDriven);
      if (isNaN(kmNum) || kmNum < 0) {
        newErrors.kilometersDriven = "Kilometers cannot be negative.";
      }
    }

    if (form.pincode && !/^\d{6}$/.test(form.pincode.trim())) {
      newErrors.pincode = "Pincode must be 6 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setForm({
      brand: "",
      model: "",
      variant: "",
      amount: "",
      kilometersDriven: "",
      manufacturingYear: "",
      registrationYear: "",
      owners: "",
      fuelType: "",
      transmission: "",
      color: "",
      sellerName: "",
      contact: "",
      city: "",
      area: "",
      pincode: "",
      insurance: true,
    });
    setFiles([]);
    setPreviews([]);
    setErrors({});
    setMessage(null);
    if (inputRef.current) inputRef.current.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!validate()) return;

    setLoading(true);
    try {
      const formData = new FormData();

      Object.entries({
        brand: form.brand,
        model: form.model,
        variant: form.variant,
        amount: form.amount,
        kilometersDriven: form.kilometersDriven,
        manufacturingYear: form.manufacturingYear,
        registrationYear: form.registrationYear,
        owners: form.owners,
        fuelType: form.fuelType,
        transmission: form.transmission,
        color: form.color,
        sellerName: form.sellerName,
        contact: form.contact,
        city: form.city,
        area: form.area,
        pincode: form.pincode,
        insurance: String(form.insurance),
      }).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      files.forEach((file) => formData.append("images", file));

      const res = await axios.post(
        `${import.meta.env.VITE_DOMAIN}/api/admin/posts/create-post`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      const newPost = res?.data?.data;
      if (newPost) {
        dispatch(addPost(newPost));
      }

      setMessage({ type: "success", text: "Post created successfully." });
      resetForm();
      nav("/posts");
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.response?.data?.error || "Failed to create post.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50">
      {/* Background circles */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className=" absolute bg-[#e8f6fef2] rounded-full h-[260px] w-[260px] sm:h-[320px] sm:w-[320px] md:h-[380px] md:w-[380px] top-7 -right-20" />
        <div className="absolute bg-[#a695fd3e] rounded-full h-[260px] w-[260px] sm:h-[320px] sm:w-[320px] md:h-[380px] md:w-[380px] -bottom-10 -left-20 " />
      </div>

      {/* Content */}
      <div className="flex justify-center px-3 py-6 relative z-10">
        <div className="w-full max-w-5xl">
          <div className="mb-4 flex justify-between">
            <h1 className="text-xl font-semibold text-slate-800">Add Post</h1>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 rounded-full border border-slate-200 text-sm text-slate-700 hover:bg-gray-100 active:scale-[0.98] transition cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow border border-slate-200 p-4 md:p-6 space-y-6"
          >
            <section>
              <h2 className="text-sm font-semibold text-slate-700 mb-3">
                Car Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Brand *"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  error={errors.brand}
                />
                <Input
                  label="Model *"
                  name="model"
                  value={form.model}
                  onChange={handleChange}
                  error={errors.model}
                />
                <Input
                  label="Variant"
                  name="variant"
                  value={form.variant}
                  onChange={handleChange}
                />
                <Input
                  label="Price (Amount) *"
                  name="amount"
                  type="number"
                  value={form.amount}
                  onChange={handleChange}
                  error={errors.amount}
                />
                <Input
                  label="Kilometers Driven"
                  type="number"
                  name="kilometersDriven"
                  value={form.kilometersDriven}
                  onChange={handleChange}
                  error={errors.kilometersDriven}
                />
                <Input
                  label="Manufacturing Year"
                  type="number"
                  name="manufacturingYear"
                  value={form.manufacturingYear}
                  onChange={handleChange}
                />
                <Input
                  label="Registration Year *"
                  type="number"
                  name="registrationYear"
                  value={form.registrationYear}
                  onChange={handleChange}
                  error={errors.registrationYear}
                />
                <Input
                  label="Owners *"
                  name="owners"
                  value={form.owners}
                  onChange={handleChange}
                />

                <Select
                  label="Fuel Type"
                  name="fuelType"
                  value={form.fuelType}
                  onChange={handleChange}
                  options={[
                    "Petrol",
                    "Diesel",
                    "CNG",
                    "Electric",
                    "Hybrid",
                    "Other",
                  ]}
                />

                <Select
                  label="Transmission"
                  name="transmission"
                  value={form.transmission}
                  onChange={handleChange}
                  options={["Manual", "Automatic", "Other"]}
                />

                <Input
                  label="Color"
                  name="color"
                  value={form.color}
                  onChange={handleChange}
                />
              </div>

              <div className="mt-3 flex items-center gap-2">
                <input
                  id="insurance"
                  type="checkbox"
                  name="insurance"
                  checked={form.insurance}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded"
                />
                <label htmlFor="insurance" className="text-sm text-slate-700">
                  Has Insurance
                </label>
              </div>
            </section>

            <hr className="border-slate-100" />

            <section>
              <h2 className="text-sm font-semibold text-slate-700 mb-3">
                Seller Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  disabled={true}
                  label="Seller Name"
                  name="sellerName"
                  value={form.sellerName}
                  onChange={handleChange}
                />
                <Input
                  label="Contact"
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                />
                <Input
                  label="Pincode"
                  disabled={true}
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  error={errors.pincode}
                />
                <Input
                  disabled={true}
                  label="City"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                />
                <Input
                  disabled={true}
                  label="Area"
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                />
              </div>
            </section>

            <hr className="border-slate-100" />

            <section>
              <h2 className="text-sm font-semibold text-slate-700 mb-2">
                Images (max 10)
              </h2>
              <input
                type="file"
                ref={inputRef}
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm border border-slate-200 px-3 py-2 rounded-xl file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-blue-600 file:text-white file:text-xs hover:file:bg-blue-700"
              />

              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-3">
                {previews.map((img, idx) => (
                  <div
                    key={img.id}
                    className="relative border border-slate-200 rounded-xl overflow-hidden bg-slate-50"
                  >
                    <img
                      src={img.src}
                      className={`w-full h-24 object-cover ${
                        idx === 0 ? "ring-2 ring-blue-500" : ""
                      }`}
                      alt={`preview-${idx}`}
                    />
                    <div className="absolute top-1 left-1">
                      {idx === 0 ? (
                        <span className="bg-white/90 px-2 py-0.5 text-[10px] rounded-full font-semibold">
                          Main
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setMain(idx)}
                          className="bg-white/90 px-2 py-0.5 text-[10px] rounded-full"
                        >
                          Set
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-white/90 px-2 py-0.5 rounded-full text-[11px] text-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {previews.length === 0 && (
                  <p className="col-span-full text-xs text-slate-400">
                    No images selected.
                  </p>
                )}
              </div>
            </section>

            {message && (
              <div
                className={`p-3 rounded-xl text-sm ${
                  message.type === "error"
                    ? "bg-red-50 text-red-700"
                    : "bg-blue-50 text-blue-700"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-3 justify-end">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-full border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded-full text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Uploading..." : "Create Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

function Input({
  label,
  name,
  disabled,
  value,
  onChange,
  type = "text",
  error,
}) {
  return (
    <label className="text-sm block">
      <span className="block font-medium mb-1 text-slate-700 ">{label}</span>
      <input
        disabled={disabled}
        min={9}
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        className={`w-full border px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 ${
          error ? "border-red-500" : "border-slate-200"
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </label>
  );
}

function Select({ label, name, value, onChange, options = [] }) {
  return (
    <label className="text-sm block">
      <span className="block font-medium mb-1 text-slate-700">{label}</span>
      <select
        name={name}
        value={value ?? ""}
        onChange={onChange}
        className="w-full border border-slate-200 px-3 py-2 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
      >
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}


export default AddPost;
