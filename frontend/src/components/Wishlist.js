import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/api";
import { useNavigate } from "react-router-dom";
import "./Wishlist.css";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) setWishlist(JSON.parse(stored));
  }, []);

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter((item) => item.id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="container py-4">
      <h4 className="mb-4" style={{ color: "#003366" }}>
        Your Wishlist ({wishlist.length})
      </h4>

      {wishlist.length === 0 ? (
        <div className="text-muted">No items in your wishlist.</div>
      ) : (
        wishlist.map((product) => (
          <div
            className="wishlist-card d-flex mb-3 shadow-sm rounded position-relative"
            key={product.id}
            onClick={() => handleCardClick(product.id)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={
                product.image.startsWith("http")
                  ? product.image
                  : `${API_BASE_URL}/images/${product.image}`
              }
              alt={product.name}
              className="wishlist-img"
            />
            <div className="wishlist-details px-3 py-2">
              <h6 className="mb-1 text-dark fw-semibold">{product.name}</h6>
              <div className="text-muted small mb-1">
                Brand: {product.brand}
              </div>
              <div className="price-section mb-2">
                {product.offer_price ? (
                  <>
                    <span className="text-danger fw-bold">
                      ₹{product.offer_price}
                    </span>{" "}
                    <small className="text-muted text-decoration-line-through">
                      ₹{product.price}
                    </small>{" "}
                    <small className="text-success">
                      Save ₹{product.price - product.offer_price}
                    </small>
                  </>
                ) : (
                  <span className="fw-bold">₹{product.price}</span>
                )}
              </div>
              {/* Prevent "Remove" button from triggering card click */}
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromWishlist(product.id);
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
