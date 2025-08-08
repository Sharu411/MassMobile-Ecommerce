// src/components/ProductCard.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";
import { FaHeart } from "react-icons/fa";
import "./BuyPreOwnIphone.css"; // Reuse same styling

export default function ProductCard({ product, wishlist, setWishlist }) {
  const navigate = useNavigate();

  const toggleWishlist = (product, e) => {
    e.stopPropagation();
    const updated = wishlist.find((p) => p.id === product.id)
      ? wishlist.filter((p) => p.id !== product.id)
      : [...wishlist, product];

    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const isWishlisted = (id) => wishlist.some((item) => item.id === id);

  const finalPrice = Number(product.offer_price ?? product.price);

  const insurancePrice =
    finalPrice <= 10000 ? 1399 : finalPrice <= 20000 ? 2399 : 2899;

  const discount =
    product.offer_price !== null && product.offer_price !== undefined
      ? Math.round(((product.price - product.offer_price) / product.price) * 100)
      : null;

  return (
    <div
      className="iphone-card fade-in"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="image-wrapper">
        {product.is_top_deal && (
          <div className="top-selling-badge">Top Selling</div>
        )}
        <button className="wishlist-btn" onClick={(e) => toggleWishlist(product, e)}>
          <FaHeart color={isWishlisted(product.id) ? "red" : "gray"} />
        </button>
        <img
          src={`${API_BASE_URL}/images/${product.image}`}
          alt={product.name}
          className="iphone-image"
        />
      </div>

      <h6>
        {product.name}{" "}
        <span className="color-label">({product.color})</span>
      </h6>
      <p className="rating">
        ⭐ {product.avg_rating || 0} ({product.total_reviews} reviews)
      </p>

      <div className="price">
        {product.offer_price ? (
          <>
            Offer Price
            <span className="offer-price"> ₹{product.offer_price}</span> - Original Price
            <span className="original-price"> ₹{product.price}</span>
            {discount && <span className="discount-tag"> ({discount}% OFF)</span>}
          </>
        ) : (
          <span className="offer-price">₹{product.price}</span>
        )}
      </div>

      <p className="insurance">Insurance: ₹{insurancePrice} / month</p>

      <p className="warranty">
        {product.warranty === "NILL"
          ? "Brand Warranty: 3 months"
          : `Company Warranty: ${product.warranty}`}
      </p>
    </div>
  );
}
