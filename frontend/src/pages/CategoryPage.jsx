import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";
import "../components/BuyPreOwnIphone.css";
import { FaHeart } from "react-icons/fa";

export default function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem("wishlist")) || []);

  // Filter state
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/products_by_category.php?category=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);

        // Extract unique brands and colors for filters
        const brandSet = new Set(data.map((item) => item.brand));
        const colorSet = new Set(data.map((item) => item.color));
        setBrands(Array.from(brandSet));
        setColors(Array.from(colorSet));
      });
  }, [slug]);

  useEffect(() => {
    filterProducts();
  }, [selectedBrand, selectedColor, selectedPriceRange, products]);

  const filterProducts = () => {
    let filtered = [...products];

    if (selectedBrand) {
      filtered = filtered.filter((p) => p.brand === selectedBrand);
    }

    if (selectedColor) {
      filtered = filtered.filter((p) => p.color === selectedColor);
    }

    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split("-").map(Number);
      filtered = filtered.filter((p) => {
        const price = Number(p.offer_price ?? p.price);
        return price >= min && price <= max;
      });
    }

    setFilteredProducts(filtered);
  };

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
        <h4>{slug.replace(/-/g, " ").toUpperCase()}</h4>
        <button onClick={() => navigate("/products")} className="view-all-btn">
          View All Products
        </button>
      </div>

      {/* Filters Section */}
      <div className="filter-container" style={{ marginBottom: "20px", display: "flex", gap: "15px", flexWrap: "wrap" }}>
        {/* Brand Filter */}
        <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
          <option value="">All Brands</option>
          {brands.map((brand, idx) => (
            <option key={idx} value={brand}>{brand}</option>
          ))}
        </select>

        {/* Price Filter */}
        <select value={selectedPriceRange} onChange={(e) => setSelectedPriceRange(e.target.value)}>
          <option value="">All Prices</option>
          <option value="0-10000">₹0 - ₹10,000</option>
          <option value="10001-20000">₹10,001 - ₹20,000</option>
          <option value="20001-50000">₹20,001 - ₹50,000</option>
        </select>

        {/* Color Filter */}
        <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>
          <option value="">All Colors</option>
          {colors.map((color, idx) => (
            <option key={idx} value={color}>{color}</option>
          ))}
        </select>

        {/* Reset Button */}
        <button onClick={() => {
          setSelectedBrand("");
          setSelectedColor("");
          setSelectedPriceRange("");
        }}>
          Reset Filters
        </button>
      </div>

      {/* Products Layout */}
      <div className="iphone-layout">
        {filteredProducts.length === 0 && <p>No products match the selected filters.</p>}

        {filteredProducts.map((product) => {
          const finalPrice = Number(product.offer_price ?? product.price);
          const insurancePrice =
            finalPrice <= 10000 ? 1399 : finalPrice <= 20000 ? 2399 : 2899;

          const discount =
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

              <h6>
                {product.name}{" "}
                <span className="color-label">({product.color})</span>
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
        })}
      </div>
    </div>
  );
}
