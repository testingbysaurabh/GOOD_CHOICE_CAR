
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





