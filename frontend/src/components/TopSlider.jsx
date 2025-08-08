import React, { useEffect, useState } from "react";
import "./TopSlider.css";

const messages = [
  "India’s Top Destination for Renewed Products",
  "Flat ₹500/- Off For Prepaid | Use Code OV500OFF",
  "No Cost EMI Available / Bulk Enquiry",
];

export default function TopSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 6000); // 6s switch
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="top-slider-bar">
      <div key={index} className="top-slider-wrapper">
        <span className="top-slider-text">{messages[index]}</span>
      </div>
    </div>
  );
}
