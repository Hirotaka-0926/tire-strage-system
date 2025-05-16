import React from "react";
import { Loader2 } from "lucide-react";

const SpinLoading = () => {
  return (
    <div className="flex justify-center items-center h-40">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-lg font-semibold ml-2 animate">
        読み込み中<span className="animate-ping">...</span>
      </p>
    </div>
  );
};

export default SpinLoading;
