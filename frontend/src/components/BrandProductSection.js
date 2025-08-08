import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/api";
import { useNavigate } from "react-router-dom";
import "./BuyPreOwnIphone.css"; // Reuse same styles
import { FaHeart } from "react-icons/fa"; // ✅ Add this line

export default function BrandProductSection({ brand, title, category }) {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState(
    () => JSON.parse(localStorage.getItem("wishlist")) || []
  );
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/get_products_by_brand.php?brand=${brand}`)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [brand]);
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
        <h4>{title}</h4>
       <button
  onClick={() => navigate(`/brand?brand=${encodeURIComponent(brand)}&category=${encodeURIComponent(category)}`)}
  className="view-all-btn"
>
  View All Pre-Owned
</button>

      </div>

      <div className="iphone-layout">
        {products.slice(0, 4).map((product) => {
          const finalPrice = Number(product.offer_price ?? product.price);

          const insurancePrice =
            finalPrice <= 10000 ? 1399 : finalPrice <= 20000 ? 2399 : 2899;

          const discount =
            product.offer_price !== null && product.offer_price !== undefined
              ? Math.round(
                  ((product.price - product.offer_price) / product.price) * 100
                )
              : null;

          return (
            <div
              className="iphone-card fade-in"
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="image-wrapper">
                <div className="top-selling-badge">Top Selling</div>
                <button
                  className="wishlist-btn"
                  onClick={(e) => toggleWishlist(product, e)}
                >
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
              {/* Price section */}
              <div className="price">
                {product.offer_price ? (
                  <>
                    Offer Price
                    <span className="offer-price">
                      {" "}
                      ₹{product.offer_price}
                    </span>{" "}
                    - Original Price
                    <span className="original-price"> ₹{product.price}</span>
                  </>
                ) : (
                  <span className="offer-price">₹{product.price}</span>
                )}
              </div>

              {/* Insurance section */}
              <p className="insurance">Insurance: ₹{insurancePrice} / month</p>

              <p className="warranty">
  {product.warranty === "NILL"
    ? "Brand Warranty: 3 months"
    : `Company Warranty: ${product.warranty}`}
</p>

            </div>
          );
        })}
      </div>
    </div>
  );
}
