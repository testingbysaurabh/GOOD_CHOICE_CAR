
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






