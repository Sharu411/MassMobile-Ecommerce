// src/components/BrandProducts.js
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./BrandProducts.css";

const brands = [
  { name: "New Mobile", image: "/images/phone.webp", category: "New Mobile" },
  { name: "Apple",     image: "/images/apple.webp",   category: "Pre Own Mobile" },
  { name: "Samsung",   image: "/images/samsung.webp", category: "Pre Own Mobile" },
  { name: "Redmi",     image: "/images/redmi.webp",   category: "Pre Own Mobile" },
  { name: "Vivo",      image: "/images/vivo.webp",    category: "Pre Own Mobile" },
  { name: "Oppo",      image: "/images/oppo.webp",    category: "Pre Own Mobile" },
  { name: "Realme",    image: "/images/realme.webp",  category: "Pre Own Mobile" },
  { name: "Nokia",     image: "/images/nokia.webp",   category: "Pre Own Mobile" },
  { name: "Xiaomi",    image: "/images/Xiaomi.webp",  category: "Pre Own Mobile" },
  { name: "Asus",      image: "/images/asus.webp",    category: "Pre Own Mobile" },
  { name: "One plus",  image: "/images/oneplus.webp", category: "Pre Own Mobile" },
  { name: "Pixel",     image: "/images/GooglePixel.webp", category: "Pre Own Mobile" },
];

export default function BrandProducts() {
  const scrollRef = useRef(null);

  /* ─── Auto‑scroll animation ─── */
  useEffect(() => {
    const el = scrollRef.current;
    let scrollAmount = 0;

    const id = setInterval(() => {
      if (!el) return;
      const { offsetWidth: w, scrollWidth: total, scrollLeft: left } = el;
      if (left + w >= total) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollAmount += 100;
        el.scrollBy({ left: 100, behavior: "smooth" });
      }
    }, 2500);

    return () => clearInterval(id);
  }, []);

  /* ─── Render ─── */
  return (
    <div className="brand-container">
      <div className="brand-scroll-container" ref={scrollRef}>
        {brands.map((brand, idx) => {
          /* Build query string: if "New Mobile" → only category param */
          const qs =
            brand.name === "New Mobile"
              ? `?category=${encodeURIComponent(brand.category)}`
              : `?brand=${encodeURIComponent(brand.name)}&category=${encodeURIComponent(
                  brand.category
                )}`;

          return (
            <Link to={`/brand${qs}`} key={idx} className="brand-item">
              <div className="brand-circle">
                <img src={brand.image} alt={brand.name} className="brand-image" />
              </div>

              <div className="brand-name">
                {brand.name === "New Mobile" ? (
                  "New Mobile"
                ) : (
                  <>
                    <div className="brand-main">{brand.name}</div>
                    <div className="brand-sub">(Pre Own Mobile)</div>
                  </>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
