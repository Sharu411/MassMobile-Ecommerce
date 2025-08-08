import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";
import { FaHeart, FaFilter } from "react-icons/fa";
import "./ProductList.css";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem("wishlist")) || []);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
  const [priceFilter, setPriceFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState([]);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const navigate = useNavigate();

  const isMobile = window.innerWidth <= 768;
  const promoInterval = isMobile ? 6 : 10;
  let showTopDeal = true;

  useEffect(() => {
    fetch(`${API_BASE_URL}/get_product.php`)
      .then(res => res.json())
      .then(data => {
        const productList = Array.isArray(data)
          ? data
          : Array.isArray(data.products)
            ? data.products
            : [];
        setProducts(productList);
        const categorySet = new Set(productList.map(item => item.category));
        setCategories(Array.from(categorySet));
      })
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  const addToCart = (product) => {
    const exists = cart.find(p => p.id === product.id);
    const updatedCart = exists
      ? cart.map(p => (p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p))
      : [...cart, { ...product, quantity: 1 }];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const toggleWishlist = (product, e) => {
    e.stopPropagation();
    const updated = wishlist.find(p => p.id === product.id)
      ? wishlist.filter(p => p.id !== product.id)
      : [...wishlist, product];
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const isWishlisted = (id) => wishlist.some(item => item.id === id);

  const handleBuyNow = (productId) => {
    const user = JSON.parse(localStorage.getItem("customer"));
    sessionStorage.setItem("buyNowProductId", productId);
    if (!user) {
      navigate("/login", { state: { from: "/buy-now" } });
    } else {
      navigate("/buy-now");
    }
  };

  const filteredProducts = products.filter(product => {
    const price = Number(product.offer_price ?? product.price);
    const priceMatch = !priceFilter || (() => {
      const [min, max] = priceFilter.split("-").map(Number);
      return price >= min && price <= max;
    })();
    const brandMatch = !brandFilter || product.brand?.toUpperCase() === brandFilter;
    const categoryMatch = !categoryFilter || product.category?.toUpperCase() === categoryFilter;
    return priceMatch && brandMatch && categoryMatch;
  });

  const renderPromoRow = (title, products, bg = "#f1f1f1", color = "#333") => (
    <div className="promo-row" style={{ background: bg, color }}>
      <div className="promo-header">{title}</div>
      <div className="promo-scroll">
        {products.slice(0, 10).map(p => (
          <div className="promo-card" key={p.id}>
         <img src={p.image} alt={p.name} />


            <p>{p.name}</p>
            <small>₹{p.offer_price ?? p.price}</small>
          </div>
        ))}
      </div>
    </div>
  );

  const recentlyViewed = filteredProducts.slice(0, 6);
  const topDeals = filteredProducts.slice(-6);

  return (
    <div className="product-page-container">
      {/* Mobile filter button */}
      <div className="d-block d-md-none text-end px-3 pt-3">
        <button className="btn btn-outline-primary" onClick={() => setShowMobileFilter(true)}>
          <FaFilter /> Filters
        </button>
      </div>

      <div className="product-layout">
        {/* Sidebar filters */}
        <div className="filter-card d-none d-md-block">
          <h5>Filters</h5>
          <label>Price Range</label>
          <select className="form-select mb-3" onChange={e => setPriceFilter(e.target.value)}>
            <option value="">All</option>
            <option value="0-10000">Under ₹10,000</option>
            <option value="10000-20000">₹10,000 – ₹20,000</option>
            <option value="20000-50000">₹20,000 – ₹50,000</option>
          </select>

          <label>Brand</label>
          <select className="form-select mb-3" onChange={e => setBrandFilter(e.target.value)}>
            <option value="">All</option>
            <option value="APPLE">Apple</option>
            <option value="SAMSUNG">Samsung</option>
            <option value="OPPO">OPPO</option>
            <option value="VIVO">VIVO</option>
            <option value="MI">MI</option>
            <option value="MOTO">MOTO</option>
            <option value="PIXEL">Pixel</option>
            <option value="ONE PLUS">OnePlus</option>
          </select>

          <label>Category</label>
          <select className="form-select mb-3" onChange={e => setCategoryFilter(e.target.value)}>
            <option value="">All</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat.toUpperCase()}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Product Grid */}
        <div className="product-grid fade-in">
          {filteredProducts.map((product, index) => (
            <React.Fragment key={product.id}>
              <div className="product-card">
                <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
                  <div className="image-wrapper">
                    <img src={product.image} alt={product.name} />
                    <span className="sale-badge">View Product</span>
                  </div>
                  <div className="product-info">
                    <h6>{product.name} <span className="color-label">({product.color})</span></h6>
                    <p className="rating">⭐ {product.avg_rating || 0} ({product.total_reviews || 0} reviews)</p>
                    <div className="price">
                      {product.offer_price ? (
                        <>
                          Offer Price <span className="offer-price"> ₹{product.offer_price}</span> –
                          <span className="original-price"> ₹{product.price}</span>
                        </>
                      ) : (
                        <span className="offer-price">₹{product.price}</span>
                      )}
                    </div>
                    <p className="insurance">
                      Insurance: ₹
                      {(product.offer_price ?? product.price) <= 10000
                        ? 1399
                        : (product.offer_price ?? product.price) <= 20000
                          ? 2399
                          : 2899} / month
                    </p>
                    <p className="warranty">
                      {product.warranty === "NILL"
                        ? "Brand Warranty: 3 months"
                        : `Company Warranty: ${product.warranty}`}
                    </p>
                  </div>
                </Link>

                <button className="wishlist-icon" onClick={e => toggleWishlist(product, e)}>
                  <FaHeart color={isWishlisted(product.id) ? "red" : "gray"} />
                </button>

                <div className="action-buttons">
                  <button onClick={() => addToCart(product)} className="add-to-cart-btn">Add to Cart</button>
                  {product.quantity > 0 ? (
                    <button onClick={() => handleBuyNow(product.id)} className="Buy-now-btn tap-button">
                      Buy Now
                    </button>
                  ) : (
                    <div className="out-of-stock">Out of Stock</div>
                  )}
                </div>
              </div>

              {(index + 1) % promoInterval === 0 &&
                index < filteredProducts.length - 1 && (
                  <>
                    {showTopDeal
                      ? renderPromoRow("Top Sale Deals", topDeals, "#5d3ea8", "white")
                      : renderPromoRow("Recently Viewed", recentlyViewed)}
                    {(showTopDeal = !showTopDeal)}
                  </>
                )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilter && (
        <div className="mobile-filter-overlay" onClick={() => setShowMobileFilter(false)}>
          <div className="mobile-filter-content" onClick={(e) => e.stopPropagation()}>
            <h5>Filters</h5>
            <label>Price Range</label>
            <select className="form-select mb-3" onChange={e => setPriceFilter(e.target.value)}>
              <option value="">All</option>
              <option value="0-10000">Under ₹10,000</option>
              <option value="10000-20000">₹10,000 – ₹20,000</option>
              <option value="20000-50000">₹20,000 – ₹50,000</option>
            </select>

            <label>Brand</label>
            <select className="form-select mb-3" onChange={e => setBrandFilter(e.target.value)}>
              <option value="">All</option>
              <option value="APPLE">Apple</option>
              <option value="SAMSUNG">Samsung</option>
              <option value="OPPO">OPPO</option>
              <option value="VIVO">VIVO</option>
              <option value="MI">MI</option>
              <option value="MOTO">MOTO</option>
              <option value="PIXEL">Pixel</option>
              <option value="ONE PLUS">OnePlus</option>
            </select>

            <label>Category</label>
            <select className="form-select mb-3" onChange={e => setCategoryFilter(e.target.value)}>
              <option value="">All</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat.toUpperCase()}>{cat}</option>
              ))}
            </select>

            <button className="btn btn-danger w-100" onClick={() => setShowMobileFilter(false)}>
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
