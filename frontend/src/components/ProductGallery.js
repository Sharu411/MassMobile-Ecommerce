import React, { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "../utils/api";
import "./ProductGallery.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function ProductGallery({ images = [], name }) {
  const [mainImage, setMainImage] = useState(images[0]);
  const scrollRef = useRef();

  useEffect(() => {
    if (images.length > 0) {
      setMainImage(images[0]);
    }
  }, [images]);

  const scrollThumbnails = (dir) => {
    if (scrollRef.current) {
      const scrollAmount = 80; // smaller scroll for narrow thumbnails
      scrollRef.current.scrollBy({
        left: dir === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (images.length === 0) {
    return <p style={{ color: "red" }}>No product images available.</p>;
  }

  return (
    <div className="gallery-wrapper">
      {/* Main Image */}
      <div className="main-image-container">
        <img
          src={`${API_BASE_URL}/images/${mainImage}`}
          alt={name}
          className="main-image"
          onError={() =>
            console.error("❌ Failed to load main image:", mainImage)
          }
        />
      </div>

      {/* Thumbnails with arrows */}
      <div className="thumbnail-scroll-wrapper">
       
        {/* Thumbnails Row */}
        <div className="thumbnail-strip" ref={scrollRef}>
          {images.map((img, idx) => {
            const fullUrl = `${API_BASE_URL}/images/${img}`;
            return (
              <img
                key={`${img}-${idx}`}
                src={fullUrl}
                alt={`Thumbnail ${idx + 1}`}
                onClick={() => setMainImage(img)}
                onError={() =>
                  console.error("❌ Failed to load thumbnail:", fullUrl)
                }
                className={`thumbnail ${
                  mainImage === img ? "active-thumbnail" : ""
                }`}
              />
            );
          })}
        </div>

      </div>
    </div>
  );
}
