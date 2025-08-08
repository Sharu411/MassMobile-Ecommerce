import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";
import "./ProductDetail.css";
import ConditionSection from "./ConditionSection";
import ProductGallery from '../components/ProductGallery';
export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewData, setReviewData] = useState({
    nickname: "",
    summary: "",
    review: "",
    rating: 0,
  });
  const [cart, setCart] = useState(
    () => JSON.parse(localStorage.getItem("cart")) || []
  );
  const [similarProducts, setSimilarProducts] = useState([]);
  const [extraProducts, setExtraProducts] = useState([]);
  const [boughtTogether, setBoughtTogether] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState(null);
const imageList = product?.images && product.images.trim() !== ""
  ? product.images.split(",")
  : product?.image
    ? [product.image]
    : [];

console.log("🖼️ Final imageList:", imageList);
  const checkPincode = () => {
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeStatus({
        success: false,
        message: "❌ Please enter a valid 6-digit Pincode",
      });
      return;
    }

    const pin = parseInt(pincode);

    // Allow all TN pincodes (600001 to 643253)
    if (pin >= 600001 && pin <= 643253) {
      setPincodeStatus({
        success: true,
        message:
          "✅ Delivery available in 2–4 days across Tamil Nadu | Free Shipping",
      });
    } else {
      setPincodeStatus({
        success: false,
        message: "🚫 Delivery not available to this pincode",
      });
    }
  };

  const [variants, setVariants] = useState([]);

  useEffect(() => {
    console.log("Product ID from URL:", product);
    if (product?.name) {
      fetch(
        `${API_BASE_URL}/get_variants.php?name=${encodeURIComponent(
          product.name
        )}`
      )
        .then((res) => res.json())
        .then((data) => setVariants(data));
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      fetch(`${API_BASE_URL}/get_products_by_brand.php?brand=${product.brand}`)
        .then((res) => res.json())
        .then((data) =>
          setSimilarProducts(data.filter((p) => p.id !== product.id))
        );

      fetch(`${API_BASE_URL}/get_product.php`)
        .then((res) => res.json())
        .then((data) => {
          setExtraProducts(
            data.filter((p) => /powerbank|earphone|charger/i.test(p.name))
          );
          setBoughtTogether(
            data.filter((p) => /cover|tempered|glass|earbuds/i.test(p.name))
          );
        });
    }
  }, [product]);

  // Fetch product and reviews
  useEffect(() => {
    fetch(`${API_BASE_URL}/get_product_detail.php?id=${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));

    fetch(`${API_BASE_URL}/get_reviews.php?product_id=${id}`)
      .then((res) => res.json())
      .then((data) => setReviews(data));
  }, [id]);

  // Track recently viewed
  useEffect(() => {
    if (product) {
      const viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
      const updated = [
        product,
        ...viewed.filter((p) => p.id !== product.id),
      ].slice(0, 10);
      localStorage.setItem("recentlyViewed", JSON.stringify(updated));
    }
  }, [product]);

  const addToCart = (prod) => {
    const exists = cart.find((p) => p.id === prod.id);
    const updated = exists
      ? cart.map((p) =>
          p.id === prod.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      : [...cart, { ...prod, quantity: 1 }];
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

 const handleBuyNow = async (productId) => {
  sessionStorage.setItem("buyNowProductId", productId);
  sessionStorage.setItem("protectionPlan", selectedPlan || "none");

  const user = JSON.parse(localStorage.getItem("customer"));

  if (!user) {
    navigate("/login", { state: { from: "/buy-now" } });
    return;
  }

  try {
    // Fetch customer addresses
    const res = await fetch(`${API_BASE_URL}/get_addresses.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_id: user.id }),
    });

    const result = await res.json();

    if (result.success && result.addresses.length > 0) {
      navigate("/buy-now");
    } else {
      navigate("/address", {
        search: `?returnTo=buy-now&productId=${productId}`,
      });
    }
  } catch (error) {
    console.error("Error checking address:", error);
    alert("Something went wrong while checking address.");
  }
};

  const handleSubmit = async () => {
    const response = await fetch(`${API_BASE_URL}/submit_review.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...reviewData, product_id: id }),
    });
    const result = await response.json();
    if (result.success) {
      alert("Review submitted!");
      setReviewData({ nickname: "", summary: "", review: "", rating: 0 });
      const res = await fetch(
        `${API_BASE_URL}/get_reviews.php?product_id=${id}`
      );
      setReviews(await res.json());
    } else alert("Failed to submit review");
  };

  if (!product) return <div className="loading">Loading...</div>;
  return (
    <div className="product-detail">
      <div className="product-main">
        {/* Left: Image & Badges */}
        <div className="left-column">
          {/* <img
            src={`${API_BASE_URL}/images/${product.image}`}
            alt={product.name}
          /> */}
          <ProductGallery images={imageList} name={product.name} />
          <div className="badge-strip">
            <span>32 Point Checked</span>
            <span>7 Day Replacement</span>
            <span>1 Year Warranty</span>
          </div>
          <br />
          <div className="buy-cart-btns">
            <button className="cart-btn" onClick={() => addToCart(product)}>
              Add to Cart
            </button>
            {product.quantity > 0 ? (
              <button
                className="buy-btn"
                onClick={() => handleBuyNow(product.id)}
              >
                Buy Now
              </button>
            ) : (
              <div className="out-stock">Out of Stock</div>
            )}
          </div>
        </div>

        {/* Center: Info */}
        <div className="middle-column">
          <h1>
            {product.brand} {product.name}
          </h1>
          <div className="price-row">
            {product.offer_price ? (
              <>
                <span>₹{product.offer_price}</span>
                <span className="strike">₹{product.price}</span>
                <span className="discount">
                  Save ₹{product.price - product.offer_price}
                </span>
              </>
            ) : (
              <span>₹{product.price}</span>
            )}
          </div>
          <p className="warranty">
            {product.warranty === "NILL"
              ? "Brand Warranty: 3 months"
              : `Company Warranty: ${product.warranty}`}
          </p>

          <div className="options-row">
            {/* Storage Options */}
            <div className="option-block">
              <strong>Storage:</strong>
              {variants
                .filter(
                  (v) =>
                    v.colour?.toLowerCase() === product.colour?.toLowerCase() &&
                    v.condition?.toLowerCase() ===
                      product.condition?.toLowerCase()
                )
                .map((v) => v.storage)
                .filter((value, index, self) => self.indexOf(value) === index) // unique
                .map((storage) => {
                  const matched = variants.find(
                    (v) =>
                      v.storage === storage &&
                      v.colour?.toLowerCase() ===
                        product.colour?.toLowerCase() &&
                      v.condition?.toLowerCase() ===
                        product.condition?.toLowerCase()
                  );
                  return (
                    matched && (
                      <button
                        key={storage}
                        className={storage === product.storage ? "active" : ""}
                        onClick={() => navigate(`/product/${matched.id}`)}
                      >
                        {storage}
                      </button>
                    )
                  );
                })}
            </div>

            {/* Color Options */}
            <div className="option-block">
              <strong>Color:</strong>
              {variants
                .filter(
                  (v) =>
                    v.storage === product.storage &&
                    v.condition?.toLowerCase() ===
                      product.condition?.toLowerCase()
                )
                .map((v) => (
                  <button
                    key={v.id}
                    className={
                      v.colour?.toLowerCase() === product.colour?.toLowerCase()
                        ? "active"
                        : ""
                    }
                    onClick={() => navigate(`/product/${v.id}`)}
                  >
                    {v.colour}
                  </button>
                ))}
            </div>

            {/* Condition Options */}
            <div className="option-block">
              <strong>Condition:</strong>
              {variants
                .filter(
                  (v) =>
                    v.storage === product.storage &&
                    v.colour?.toLowerCase() === product.colour?.toLowerCase()
                )
                .map((v) => v.condition)
                .filter((value, index, self) => self.indexOf(value) === index) // unique
                .map((condition) => {
                  const matched = variants.find(
                    (v) =>
                      v.condition === condition &&
                      v.storage === product.storage &&
                      v.colour?.toLowerCase() === product.colour?.toLowerCase()
                  );
                  return (
                    matched && (
                      <button
                        key={condition}
                        className={
                          condition?.toLowerCase() ===
                          product.condition?.toLowerCase()
                            ? "active"
                            : ""
                        }
                        onClick={() => navigate(`/product/${matched.id}`)}
                      >
                        {condition}
                      </button>
                    )
                  );
                })}
            </div>
          </div>

          <div className="trust-badges">
            <span>✅ 100% Genuine</span>
            <span>🔒 Secure Checkout</span>
            <span>📦 Fast Delivery</span>
          </div>
        </div>
        {boughtTogether.length > 0 && (
          <div className="compare-section">
            <h4>Frequently Bought Together</h4>
            <div className="compare-list">
              {boughtTogether.map((p) => (
                <div
                  key={p.id}
                  className="compare-card"
                  onClick={() => navigate(`/product/${p.id}`)}
                >
                  <img src={`${API_BASE_URL}/images/${p.image}`} alt={p.name} />
                  <div className="compare-name">{p.name}</div>
                  <div className="compare-price">
                    ₹{p.offer_price || p.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* 360° Video section inserted here */}
        {product.video && (
          <div className="product-video-box">
            <h4>360° View</h4>
            <video controls width="100%">
              <source
                src={`${API_BASE_URL}/videos/${product.video}`}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
        {/* Right: Services */}
        <div className="right-column">
          {[
            {
              icon: "🕐",
              title: "Support 9 AM TO 9 PM ",
              desc: "Online support",
            },
            { icon: "🔁", title: "Free Replacement", desc: "7 Days" },
            { icon: "💳", title: "Secure Payment", desc: "All major cards" },
          ].map((svc, i) => (
            <div className="service-box" key={i}>
              <div>{svc.icon}</div>
              <div>
                <strong>{svc.title}</strong>
                <br />
                <small>{svc.desc}</small>
              </div>
            </div>
          ))}

          <div className="delivery-check">
            <h4>Delivery Options</h4>
            <div className="pincode-group">
              <input
                type="text"
                placeholder="Enter pincode"
                maxLength="6"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
              <button onClick={checkPincode}>Check</button>
            </div>
            {pincodeStatus && (
              <p
                className={`delivery-message ${
                  pincodeStatus.success ? "success" : "error"
                }`}
              >
                {pincodeStatus.message}
              </p>
            )}
          </div>
        </div>
        <div></div>
      </div>

      <div className="highlight-box">
        <h4>Highlights</h4>
        <ul>
          <li>{product.display}</li>
          <li>{product.battery} Battery</li>
          <li>{product.rear_camera} Rear Camera</li>
          <li>{product.front_camera} Front Camera</li>
          <li>{product.storage} Storage</li>
        </ul>
      </div>
      <div className="product-description-box">
        <h4>Product Description</h4>
        <p>
          Experience blazing fast performance with the{" "}
          <strong>
            {" "}
            {product.brand} {product.name}
          </strong>
          . Featuring a powerful processor, immersive display, long-lasting
          battery, and a stunning camera setup, this device is crafted to
          deliver smooth multitasking and rich visuals. Whether you're gaming,
          streaming, or capturing memories, this smartphone handles it all
          effortlessly.
        </p>
      </div>

      <ul className="spec-list">
        <li>
          <strong>Rear Camera:</strong> {product.rear_camera}
        </li>
        <li>
          <strong>Front Camera:</strong> {product.front_camera}
        </li>
        <li>
          <strong>Display:</strong> {product.display}
        </li>
        <li>
          <strong>Battery:</strong> {product.battery}
        </li>
        <li>
          <strong>Network:</strong> {product.network_type}
        </li>
        <li>
          <strong>SIM Type:</strong> {product.sim_type}
        </li>
        <li>
          <strong>Full Kit:</strong> {product.full_kit}
        </li>
      </ul>
      <div className="warranty-info-section">
        <h3 className="warranty-heading">What Comes with the Phone?</h3>

        <div className="warranty-content-wrapper">
          {/* Left: Image */}
          <div className="warranty-image-box">
            <img
              src="/images/phonebox.webp"
              alt="What Comes with the Phone"
              className="what-comes-image"
            />
          </div>

          {/* Right: Info Boxes */}
          <div className="warranty-details-box">
            <div className="warranty-box">
              <h5>In The Box:</h5>
              <p>
                The package includes <strong>{product.full_kit}</strong>.
              </p>
            </div>

            <div className="warranty-box">
              <h5>Warranty:</h5>
              <p className="warranty">
                {product.warranty === "NILL"
                  ? "Brand Warranty: 3 months"
                  : `Company Warranty: ${product.warranty}`}
              </p>
            </div>

            <div className="warranty-box">
              <h5>Warranty Service Type:</h5>
              <p>
                For warranty claims, please Call Hotline{" "}
                <span className="highlight-link">
                  <strong>9944298448</strong>
                </span>
              </p>
            </div>

            <div className="warranty-box">
              <h5>Not Covered in Warranty:</h5>
              <p>
                Physical, Liquid, Electrical Damages and Unauthorized Repair is
                Not Covered
              </p>
            </div>
          </div>
        </div>
      </div>
      <ConditionSection />

      <div className="container my-4">
        <h4 className="mb-3" style={{ color: "#003366" }}>
          Why Buy From Us?
        </h4>

        <div className="d-flex overflow-auto gap-3 flex-nowrap">
          {/* Card 1 */}
          <div
            className="card flex-shrink-0 text-center p-3"
            style={{ minWidth: "200px" }}
          >
            <div style={{ fontSize: "28px" }}>✅</div>
            <h6 className="mt-2 text-primary">Confidence Guarantee</h6>
            <p className="small text-muted mb-0">
              Tested & certified to work like new.
            </p>
          </div>

          {/* Card 2 */}
          <div
            className="card flex-shrink-0 text-center p-3"
            style={{ minWidth: "200px" }}
          >
            <div style={{ fontSize: "28px" }}>🛡️</div>
            <h6 className="mt-2 text-primary">Warranty</h6>
            <p className="small text-muted mb-0">
              Warranty by our official service partner.
              <br />
              View Warranty details.
            </p>
          </div>

          {/* Card 3 */}
          <div
            className="card flex-shrink-0 text-center p-3"
            style={{ minWidth: "200px" }}
          >
            <div style={{ fontSize: "28px" }}>🔄</div>
            <h6 className="mt-2 text-primary">7-Day Return</h6>
            <p className="small text-muted mb-0">
              Easy replacement within 7 days.
            </p>
          </div>

          {/* Card 4 */}
          <div
            className="card flex-shrink-0 text-center p-3"
            style={{ minWidth: "200px" }}
          >
            <div style={{ fontSize: "28px" }}>📦</div>
            <h6 className="mt-2 text-primary">Free Delivery</h6>
            <p className="small text-muted mb-0">
              Fast and free shipping across India.
            </p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="review-section">
        <h4>Submit Your Review</h4>
        <input
          placeholder="Nick Name"
          value={reviewData.nickname}
          onChange={(e) =>
            setReviewData({ ...reviewData, nickname: e.target.value })
          }
        />
        <input
          placeholder="Summary"
          value={reviewData.summary}
          onChange={(e) =>
            setReviewData({ ...reviewData, summary: e.target.value })
          }
        />
        <textarea
          placeholder="Review"
          value={reviewData.review}
          onChange={(e) =>
            setReviewData({ ...reviewData, review: e.target.value })
          }
        />
        <select
          value={reviewData.rating}
          onChange={(e) =>
            setReviewData({ ...reviewData, rating: +e.target.value })
          }
        >
          <option value={0}>Rating</option>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r} Star
            </option>
          ))}
        </select>
        <button className="submit-btn" onClick={handleSubmit}>
          Submit
        </button>

        {reviews.length > 0 && (
          <div className="review-list">
            {reviews.map((r, i) => (
              <div key={i} className="review-card">
                <h5>
                  {r.rating}.0 ★ - {r.summary}
                </h5>
                <div className="stars">{"⭐".repeat(r.rating)}</div>
                <p>{r.review}</p>
                <small>
                  by {r.nickname} on{" "}
                  {new Date(r.created_at).toLocaleDateString()}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recently Viewed */}
      {JSON.parse(localStorage.getItem("recentlyViewed"))?.filter(
        (p) => p.id !== product.id
      ).length > 0 && (
        <div className="compare-section">
          <h4>Recently Viewed Products</h4>
          <div className="compare-list">
            {JSON.parse(localStorage.getItem("recentlyViewed"))
              .filter((p) => p.id !== product.id)
              .map((p) => (
                <div
                  key={p.id}
                  className="compare-card"
                  onClick={() => navigate(`/product/${p.id}`)}
                >
                  <img src={`${API_BASE_URL}/images/${p.image}`} alt={p.name} />
                  <div className="compare-name">{p.name}</div>
                  <div className="compare-price">
                    ₹{p.offer_price || p.price}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Sticky Buy Bar (All Devices) */}
      <div className="sticky-buy-bar">
        <div className="bar-content">
          <div>
            {product.offer_price ? (
              <>
                ₹{product.offer_price}{" "}
                <span className="strike">₹{product.price}</span>
              </>
            ) : (
              <>₹{product.price}</>
            )}
          </div>
          <div>
            <button className="bar-cart" onClick={() => addToCart(product)}>
              Cart
            </button>
            {product.quantity > 0 && (
              <button
                className="bar-buy"
                onClick={() => handleBuyNow(product.id)}
              >
                Buy Now
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div className="compare-section">
          <h4>Similar Products</h4>
          <div className="compare-list">
            {similarProducts.slice(0, 10).map((p) => (
              <div
                key={p.id}
                className="compare-card"
                onClick={() => navigate(`/product/${p.id}`)}
              >
                <img src={`${API_BASE_URL}/images/${p.image}`} alt={p.name} />
                <div className="compare-name">{p.name}</div>
                <div className="compare-price">₹{p.offer_price || p.price}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="product-info-table">
        <h4>Additional Information</h4>
        <table>
          <tbody>
            <tr>
              <td>Return Policy</td>
              <td>7 Day Replacement</td>
            </tr>
            <tr>
              <td>EMI Options</td>
              <td>Available on checkout</td>
            </tr>
            <tr>
              <td>Warranty</td>
              <td>
                <p className="warranty">
                  {product.warranty === "NILL"
                    ? "Brand Warranty: 3 months"
                    : `Company Warranty: ${product.warranty}`}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
