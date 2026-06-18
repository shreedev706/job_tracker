import React from "react";
import { DotLoader } from "react-spinners";

 export const FullScreenLoader: React.FC = () => {
  return (
    // fixed inset-0 prevents background leaking and scrolling shifts over your body layouts
    <div className="fixed inset-0 w-screen h-screen bg-neutral-950 flex flex-col justify-center items-center gap-6 z-[9999] select-none animate-fade-in">
      <DotLoader color="#16a34a" size={70} />
      
      <p className="text-xl md:text-2xl text-neutral-200 font-bold tracking-wide text-center px-4">
        Loading your job quest hub...
      </p>
    </div>
  );
};

