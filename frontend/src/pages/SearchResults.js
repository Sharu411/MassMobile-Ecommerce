import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";
import "../components/BuyPreOwnIphone.css"; // Reuse the existing style
import { FaHeart } from "react-icons/fa";

export default function SearchResults() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState(
    () => JSON.parse(localStorage.getItem("wishlist")) || []
  );

  const location = useLocation();
  const navigate = useNavigate();
  const searchQuery = new URLSearchParams(location.search).get("search")?.toLowerCase() || "";

  useEffect(() => {
    fetch(`${API_BASE_URL}/get_product.php`)
      .then((res) => res.json())
      .then((data) => {
        const all = Array.isArray(data) ? data : data.products || [];
        const filtered = all.filter(
          (p) =>
            p.name?.toLowerCase().includes(searchQuery) ||
            p.brand?.toLowerCase().includes(searchQuery)
        );
        setProducts(filtered);
      });
  }, [searchQuery]);

  const toggleWishlist = (product, e) => {
    e.stopPropagation();
    const updated = wishlist.find((p) => p.id === product.id)
      ? wishlist.filter((p) => p.id !== product.id)
      : [...wishlist, product];
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const isWishlisted = (id) => wishlist.some((item) => item.id === id);

  return (
    <div className="iphone-section">
      <div className="section-header">
        <h4>Search Results for: "{searchQuery}"</h4>
        <button onClick={() => navigate("/products")} className="view-all-btn">
          View All Products
        </button>
      </div>

      <div className="iphone-layout">
        {products.length === 0 ? (
          <p className="text-center w-100">No products found.</p>
        ) : (
          products.map((product) => {
            const finalPrice = Number(product.offer_price ?? product.price);
            const insurancePrice =
              finalPrice <= 10000 ? 1399 : finalPrice <= 20000 ? 2399 : 2899;

            return (
              <div
                className="iphone-card fade-in"
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="image-wrapper">
                  <div className="top-selling-badge">Search Hit</div>
                  <button
                    className="wishlist-btn"
                    onClick={(e) => toggleWishlist(product, e)}
                  >
                    <FaHeart
                      color={isWishlisted(product.id) ? "red" : "gray"}
                    />
                  </button>
                  <img
                    src={`${product.image}`}
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
                      <span className="offer-price"> ₹{product.offer_price}</span> – Original Price
                      <span className="original-price"> ₹{product.price}</span>
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
          })
        )}
      </div>
    </div>
  );
}
