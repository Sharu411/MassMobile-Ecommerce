// src/pages/BrandProductPage.js
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";
import "../components/BuyPreOwnIphone.css";
import { FaHeart } from "react-icons/fa";

/* Helper to read ?brand & ?category */
const useQuery = () => new URLSearchParams(useLocation().search);

export default function BrandProductPage() {
  const query             = useQuery();
  const navigate          = useNavigate();
  const selectedBrand     = query.get("brand");       // may be null
  const selectedCategory  = query.get("category") || "";

  const [products, setProducts]               = useState([]);
  const [filteredProducts, setFiltered]       = useState([]);
  const [wishlist, setWishlist]               = useState(
    () => JSON.parse(localStorage.getItem("wishlist")) || []
  );
  const [colors, setColors]                   = useState([]);
  const [selectedColor, setSelectedColor]     = useState("");
  const [selectedPriceRange, setSelectedPR]   = useState("");

  /* ───── Fetch & initial filter ───── */
  useEffect(() => {
    fetch(`${API_BASE_URL}/products.showall.php`)
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : data.products;

        /* Core filter: category MUST match, brand only if present */
       const base = list.filter(p => {
  const brandMatch =
    !selectedBrand || p.brand?.toLowerCase() === selectedBrand.toLowerCase();
  const categoryMatch =
    selectedCategory.toLowerCase() === "all" ||
    p.category?.toLowerCase() === selectedCategory.toLowerCase();
  return brandMatch && categoryMatch;
});


        setProducts(base);
        setFiltered(base);
        setColors([...new Set(base.map(p => p.color))]);
      })
      .catch(err => console.error("Fetch Error:", err));
  }, [selectedBrand, selectedCategory]);

  /* ───── Color & price filters ───── */
  useEffect(() => {
    let out = [...products];

    if (selectedColor) {
      out = out.filter(p => p.color === selectedColor);
    }

    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split("-").map(Number);
      out = out.filter(p => {
        const price = Number(p.offer_price ?? p.price);
        return price >= min && price <= max;
      });
    }
    setFiltered(out);
  }, [selectedColor, selectedPriceRange, products]);

  /* ───── Wishlist helpers ───── */
  const toggleWishlist = (product, e) => {
    e.stopPropagation();
    const updated = wishlist.find(p => p.id === product.id)
      ? wishlist.filter(p => p.id !== product.id)
      : [...wishlist, product];
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };
  const isWishlisted = id => wishlist.some(item => item.id === id);

  /* ───── Render ───── */
  return (
    <div className="iphone-section">
      <div className="section-header">
        <h4>
          {selectedBrand ? selectedBrand.toUpperCase() + " – " : ""}
          {selectedCategory}
        </h4>

        <button onClick={() => navigate("/products")} className="view-all-btn">
          View All Products
        </button>
      </div>

      {/* Filters */}
      <div
        className="filter-container"
        style={{ marginBottom: 20, display: "flex", gap: 15, flexWrap: "wrap" }}
      >
        <select value={selectedPriceRange} onChange={e => setSelectedPR(e.target.value)}>
          <option value="">All Prices</option>
          <option value="0-10000">₹0 - ₹10,000</option>
          <option value="10001-20000">₹10,001 - ₹20,000</option>
          <option value="20001-50000">₹20,001 - ₹50,000</option>
        </select>

        <select value={selectedColor} onChange={e => setSelectedColor(e.target.value)}>
          <option value="">All Colors</option>
          {colors.map((c, idx) => (
            <option key={idx} value={c}>{c}</option>
          ))}
        </select>

        <button onClick={() => { setSelectedColor(""); setSelectedPR(""); }}>
          Reset Filters
        </button>
      </div>

      {/* Product Grid */}
      <div className="iphone-layout">
        {filteredProducts.length === 0 ? (
          <p>No products match the selected filters.</p>
        ) : (
          filteredProducts.map(product => {
            const finalPrice      = Number(product.offer_price ?? product.price);
            const insurancePrice  = finalPrice <= 10000 ? 1399 :
                                    finalPrice <= 20000 ? 2399 : 2899;
            const discount        =
              product.offer_price && product.price
                ? Math.round(((product.price - product.offer_price) / product.price) * 100)
                : null;

            return (
              <div
                className="iphone-card fade-in"
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {product.is_top_deal === "1" && (
                  <div className="top-selling-badge">Top Selling</div>
                )}

                <button className="wishlist-btn" onClick={e => toggleWishlist(product, e)}>
                  <FaHeart color={isWishlisted(product.id) ? "red" : "gray"} />
                </button>

                <img
                  src={`${API_BASE_URL}/images/${product.image}`}
                  alt={product.name}
                  className="iphone-image"
                />

                <h6>
                  {product.name} <span className="color-label">({product.color})</span>
                </h6>

                <p className="rating">
                  ⭐ {product.avg_rating || 0} ({product.total_reviews || 0})
                </p>

                <div className="price">
                  {product.offer_price ? (
                    <>
                      Offer: <span className="offer-price">₹{product.offer_price}</span>{" "}
                      <span className="original-price" style={{ textDecoration: "line-through", color: "#888" }}>
                        ₹{product.price}
                      </span>
                      {discount && <span style={{ color: "red" }}> ({discount}% OFF)</span>}
                    </>
                  ) : (
                    <span className="offer-price">₹{product.price}</span>
                  )}
                </div>

                <p className="insurance">Insurance: ₹{insurancePrice}/mo</p>
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
