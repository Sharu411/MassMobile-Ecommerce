import React from "react";
import { cn } from "./utils";

export const Card = ({ className = "", children, ...props }) => {
  return (
    <div
      className={cn("rounded-xl border bg-white p-4 shadow-sm", className)}
      {...props}
    >
      {children}
    </div>
  );
};
