
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
        <div
            className="
                mt-24 ml-20
                grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
                gap-6
            "
        >
            {Array.from({ length: 8 }).map((_, i) => (
                <div
                    key={i}
                    className="
                        bg-white rounded-xl shadow-md  overflow-hidden 
                        animate-pulse
                    "
                >
                    {/*  Image area shimmer */}
                    <div className="w-full h-44 bg-gray-300"></div>

                    {/* Text area shimmer */}
                    <div className="p-3 space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>  {/* title */}
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>  {/* price */}
                        <div className="h-3 bg-gray-300 rounded w-2/3 mt-2"></div> {/* createdAt */}
                    </div>

                </div>
            ))}
        </div>
    );
};



export const EditPostSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar skeleton */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-16 h-7 rounded-full bg-gray-200 animate-pulse" />
          <div className="w-40 h-5 rounded-full bg-gray-200 animate-pulse max-md:w-28" />
        </div>
        <div className="hidden md:flex items-center gap-2">
          <div className="w-16 h-7 rounded-full bg-gray-200 animate-pulse" />
          <div className="w-24 h-7 rounded-full bg-gray-200 animate-pulse" />
        </div>
      </div>

      {/* Card skeleton */}
      <div className="max-w-5xl mx-auto mt-6 mb-10 px-3">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Image + summary skeleton */}
          <div className="grid md:grid-cols-[1.7fr,1.3fr]">
            <div className="h-64 bg-gray-200 animate-pulse" />
            <div className="p-4 border-l border-gray-100 bg-gray-50/60 space-y-3">
              <div className="h-4 w-44 bg-gray-200 rounded animate-pulse" />
              <div className="h-7 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-28 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Form skeleton */}
          <div className="p-5 grid md:grid-cols-2 gap-5 border-t border-gray-100 text-xs">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-full bg-gray-200 rounded-xl animate-pulse" />
              </div>
            ))}
          </div>

          {/* Mobile bottom buttons skeleton */}
          <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between md:hidden">
            <div className="w-16 h-7 bg-gray-200 rounded-full animate-pulse" />
            <div className="w-24 h-7 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};




