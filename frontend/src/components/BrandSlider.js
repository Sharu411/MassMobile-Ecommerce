import React from "react";
import "./BrandSlider.css";

const brands = [
  { name: "Apple", image: "/images/apple.webp" },
  { name: "Samsung", image: "/images/samsung.webp" },
  { name: "Redmi", image: "/images/redmi.webp" },
  { name: "Vivo", image: "/images/vivo.webp" },
  { name: "Oppo", image: "/images/oppo.webp" },
  { name: "Realme", image: "/images/realme.webp" },
  { name: "Nokia", image: "/images/nokia.webp" },
  { name: "Xiaomi", image: "/images/Xiaomi.webp" },
  { name: "Asus", image: "/images/asus.webp" },
  { name: "One plus", image: "/images/oneplus.webp" },
  { name: "Pixel", image: "/images/GooglePixel.webp" },
];

export default function BrandSlider() {
  return (
    <div className="brand-marquee">
      <div className="marquee-track">
        {[...brands, ...brands].map((brand, index) => (
          <div className="marquee-item" key={index}>
            <img src={brand.image} alt={brand.name} />
          </div>
        ))}
      </div>
    </div>
  );
}
