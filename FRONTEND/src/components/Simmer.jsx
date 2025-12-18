
import React from "react";




export const SendOtpSkeleton = () => {
  return (
    <div className="text-center space-y-6">
      {/* Title Skeleton */}
      <div className="h-10 w-2/3 mx-auto bg-[#393E46] rounded-lg animate-pulse"></div>

      {/* Input Skeleton */}
      <div className="h-12 w-full rounded-xl bg-[#222831] animate-pulse shadow-inner"></div>

      {/* Button Skeleton */}
      <div className="h-12 w-full rounded-xl bg-[#948979] animate-pulse shadow-lg"></div>
    </div>
  );
};




export const VerifyOtpSkeleton = () => {
  return (
    <div className="text-center space-y-6">
      {/* Title skeleton */}
      <div className="h-10 w-2/3 mx-auto bg-[#393E46] rounded-lg animate-pulse"></div>

      {/* Input skeleton */}
      <div className="h-12 w-full rounded-xl bg-[#222831] animate-pulse shadow-inner"></div>

      {/* Button skeleton */}
      <div className="h-12 w-full rounded-xl bg-[#948979] animate-pulse shadow-lg"></div>
    </div>
  );
};



export const SignupSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Title Skeleton */}
      <div className="h-10 w-2/3 mx-auto bg-[#393E46] rounded-lg animate-pulse"></div>

      {/* Input Fields Skeleton */}
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-12 w-full rounded-xl bg-[#222831] animate-pulse shadow-inner"
          ></div>
        ))}
      </div>

      {/* Button Skeleton */}
      <div className="h-12 w-full rounded-xl bg-[#948979] animate-pulse shadow-lg"></div>
    </div>
  );
};




export const PasswordChangeSkeleton = () => {
  return (
    <div className="space-y-6 text-center animate-pulse">
      {/* Heading skeleton */}
      <div className="h-8 w-1/2 mx-auto rounded-lg" style={{ backgroundColor: "#94897940" }}></div>

      {/* Input skeletons */}
      <div className="space-y-3">
        <div className="h-12 w-full rounded-xl" style={{ backgroundColor: "#94897930" }}></div>
        <div className="h-12 w-full rounded-xl" style={{ backgroundColor: "#94897930" }}></div>
        <div className="h-12 w-full rounded-xl" style={{ backgroundColor: "#94897930" }}></div>
        <div className="h-12 w-full rounded-xl" style={{ backgroundColor: "#94897930" }}></div>
      </div>

      {/* Button skeleton */}
      <div className="flex flex-col gap-3 mt-4">
        <div className="h-12 w-full rounded-xl" style={{ backgroundColor: "#94897940" }}></div>
        <div className="h-8 w-1/3 rounded-lg mx-auto" style={{ backgroundColor: "#94897930" }}></div>
      </div>
    </div>
  );
};




export const LoginSkeleton = () => {
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: "#222831" }}>
      <div
        className="w-[90%] max-w-md p-8 rounded-2xl shadow-2xl animate-pulse"
        style={{ backgroundColor: "#393E46" }}
      >
        {/* Heading */}
        <div className="text-center mb-6">
          <div className="h-6 w-3/4 mx-auto rounded-lg" style={{ backgroundColor: "#948979" }}></div>
          <div className="h-4 w-1/2 mx-auto mt-3 rounded-lg" style={{ backgroundColor: "#948979" }}></div>
        </div>

        {/* Email Field */}
        <div className="mb-6">
          <div className="h-4 w-1/3 mb-2 rounded-lg" style={{ backgroundColor: "#948979" }}></div>
          <div
            className="h-10 w-full rounded-xl shadow-inner"
            style={{
              backgroundColor: "#222831",
              border: "1px solid #948979",
            }}
          ></div>
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <div className="h-4 w-1/3 mb-2 rounded-lg" style={{ backgroundColor: "#948979" }}></div>
          <div
            className="h-10 w-full rounded-xl shadow-inner"
            style={{
              backgroundColor: "#222831",
              border: "1px solid #948979",
            }}
          ></div>
        </div>

        {/* Button */}
        <div
          className="h-10 w-full rounded-xl shadow-md"
          style={{ backgroundColor: "#948979" }}
        ></div>

        {/* Bottom Links */}
        <div className="flex justify-between mt-6">
          <div className="h-3 w-1/2 rounded-lg" style={{ backgroundColor: "#948979" }}></div>
          <div className="h-3 w-1/4 rounded-lg" style={{ backgroundColor: "#948979" }}></div>
        </div>
      </div>
    </div>
  );
};



export const PostsSkeleton = () => {
  return (
    <div className="relative w-full">
      <div
        className="
          max-w-[1400px]
          mx-auto
          px-3 sm:px-4 md:px-6
          pt-6 md:pt-10
          grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
          gap-4 sm:gap-5 md:gap-6
        "
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="
              bg-white rounded-2xl border border-gray-100
              overflow-hidden animate-pulse
            "
          >
            {/* Image skeleton */}
            <div className="w-full h-40 xs:h-48 sm:h-52 md:h-56 bg-gray-200" />

            {/* Content skeleton */}
            <div className="p-3 sm:p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-5 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};




export const EditPostSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-3 sm:px-6 py-3 flex items-center justify-between animate-pulse">
        <div className="flex items-center gap-2">
          <div className="w-14 h-6 rounded-full bg-gray-200" />
          <div className="w-32 sm:w-40 h-4 rounded bg-gray-200" />
        </div>
        <div className="hidden md:flex items-center gap-2">
          <div className="w-16 h-6 rounded-full bg-gray-200" />
          <div className="w-24 h-6 rounded-full bg-gray-200" />
        </div>
      </div>

      {/* Main card */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 mt-6 mb-10">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">

          {/* Image + summary */}
          <div className="grid grid-cols-1 md:grid-cols-[1.7fr,1.3fr]">
            <div className="h-56 sm:h-64 bg-gray-200 animate-pulse" />
            <div className="p-4 space-y-3 bg-gray-50/60 md:border-l border-gray-100">
              <div className="h-4 w-44 bg-gray-200 rounded animate-pulse" />
              <div className="h-7 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-28 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Form fields */}
          <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 border-t border-gray-100">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="space-y-2 animate-pulse">
                <div className="h-3 w-20 bg-gray-200 rounded" />
                <div className="h-9 w-full bg-gray-200 rounded-xl" />
              </div>
            ))}
          </div>

          {/* Mobile bottom buttons */}
          <div className="px-4 py-3 border-t border-gray-100 flex justify-between md:hidden animate-pulse">
            <div className="w-16 h-6 bg-gray-200 rounded-full" />
            <div className="w-24 h-6 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};






const SkeletonBox = ({ className }) => (
  <div
    className={`animate-pulse bg-gray-200 rounded-md ${className}`}
  ></div>
);

export const DetailSkeleton = () => {
  return (
    <div className="absolute min-w-full min-h-screen overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0">
        <div className="h-96 w-96 bg-[#e8f6fef2] rounded-full absolute top-7 -right-20"></div>
        <div className="h-96 w-96 bg-[#a695fd3e] rounded-full absolute -bottom-10 -left-20"></div>
      </div>

      <div className="relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mt-20 mx-auto w-[90vw] max-w-6xl">

        {/* Image Skeleton */}
        <SkeletonBox className="w-full h-72 md:h-[500px]" />

        <div className="p-4 md:p-8 space-y-6">
          {/* Title */}
          <div className="space-y-3">
            <SkeletonBox className="h-8 w-3/4" />
            <SkeletonBox className="h-6 w-1/3" />
          </div>

          {/* Price + Buttons */}
          <div className="flex justify-between items-center gap-4">
            <SkeletonBox className="h-10 w-40" />
            <div className="hidden md:flex gap-4 w-[350px]">
              <SkeletonBox className="h-12 w-1/2 rounded-xl" />
              <SkeletonBox className="h-12 w-1/2 rounded-xl" />
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonBox key={i} className="h-20" />
            ))}
          </div>

          {/* Detail Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-3">
                <SkeletonBox className="h-6 w-40" />
                {[...Array(4)].map((_, j) => (
                  <SkeletonBox key={j} className="h-5 w-full" />
                ))}
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {[...Array(5)].map((_, i) => (
              <SkeletonBox key={i} className="h-8 w-20 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Action Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white/90 backdrop-blur-md border-t p-3 flex gap-3">
        <SkeletonBox className="h-12 flex-1 rounded-xl" />
        <SkeletonBox className="h-12 flex-1 rounded-xl" />
      </div>
    </div>
  );
};









const Skeleton = ({ className }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
);

export const CarCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden w-full">

      {/* Image */}
      <Skeleton className="w-full h-40 xs:h-48 sm:h-52 md:h-56" />

      {/* Content */}
      <div className="px-3 sm:px-4 pt-3 pb-4 space-y-3">

        {/* Title */}
        <Skeleton className="h-4 w-3/4" />

        {/* Price + Color */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-4 w-14 rounded-full" />
        </div>

        {/* Chips */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton className="h-4 w-14 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const HomeGridSkeleton = ({ count = 12 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <CarCardSkeleton key={i} />
      ))}
    </>
  );
};


