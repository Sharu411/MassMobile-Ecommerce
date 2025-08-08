import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";
import Countdown from "react-countdown";
import { FaHeart } from "react-icons/fa";

export default function OfferPage() {
  const { offerName } = useParams();
  const [products, setProducts] = useState([]);
  const [saleEndDate, setSaleEndDate] = useState(null);
  const [wishlist, setWishlist] = useState(
    () => JSON.parse(localStorage.getItem("wishlist")) || []
  );
  const [shake, setShake] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/get_offer_products.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ offer_name: offerName }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products);
          setSaleEndDate(data.sale_end);
        }
      });

    const shakeTimer = setTimeout(() => {
      setShake(true);
    }, 2000);

    return () => clearTimeout(shakeTimer);
  }, [offerName]);

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
    <div style={styles.container}>
     <style>
  {`
    @keyframes shake {
      0% { transform: rotate(-20deg) translate(0, 0); }
      25% { transform: rotate(-20deg) translate(-2px, 2px); }
      50% { transform: rotate(-20deg) translate(2px, -2px); }
      75% { transform: rotate(-20deg) translate(-2px, 2px); }
      100% { transform: rotate(-20deg) translate(0, 0); }
    }

    .card-hover:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(0,0,0,0.2);
    }

    .shake-ribbon {
      animation: shake 1.2s infinite ease-in-out;
    }
  `}
</style>


      <marquee
        style={styles.marquee}
        behavior="scroll"
        direction="left"
        scrollAmount="8"
      >
        🎉 🔥 LIVE NOW! Get Up To 70% OFF on Mobiles & Accessories 🔥🎉
      </marquee>

      {saleEndDate && (
        <Countdown
          date={Date.parse(saleEndDate)}
          renderer={({ days, hours, minutes, seconds, completed }) => {
            if (completed) {
              return <div style={styles.countdown}>⏰ Offer Ended</div>;
            }

            return (
              <>
                <div style={styles.countdown}>
                  ⏳ Sale ends in:{" "}
                  <strong>
                    {days}d {hours}h {minutes}m {seconds}s
                  </strong>
                </div>

                <div style={styles.grid}>
                  {products.map((product) => {
                    const finalPrice = Number(
                      product.offer_price ?? product.price
                    );

                    const insurancePrice =
                      finalPrice <= 10000
                        ? 1399
                        : finalPrice <= 20000
                        ? 2399
                        : 2899;

                    const discount = product.offer_price
                      ? Math.round(
                          ((product.price - product.offer_price) /
                            product.price) *
                            100
                        )
                      : null;

                    return (
                      <div
                        key={product.id}
                        style={styles.card}
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                       <div style={styles.ribbon}>{discount && (
                                <span style={styles.discount}>
                                  ({discount}% OFF)
                                </span>
                              )}</div>


                        <button
                          style={styles.wishlistBtn}
                          onClick={(e) => toggleWishlist(product, e)}
                        >
                          <FaHeart
                            color={isWishlisted(product.id) ? "red" : "gray"}
                          />
                        </button>

                        <img
                          src={`${API_BASE_URL}/images/${product.image}`}
                          alt={product.name}
                          style={styles.image}
                        />

                        <h4 style={styles.title}>
                          {product.name}
                          {product.color && (
                            <span style={styles.colorLabel}>
                              {" "}
                              ({product.color})
                            </span>
                          )}
                        </h4>

                        <div style={styles.price}>
                          {product.offer_price ? (
                            <>
                              Offer:{" "}
                              <span style={styles.offerPrice}>
                                ₹{product.offer_price}
                              </span>{" "}
                              <span style={styles.originalPrice}>
                                ₹{product.price}
                              </span>
                              <br />
                              {discount && (
                                <span style={styles.discount}>
                                  ({discount}% OFF)
                                </span>
                              )}
                            </>
                          ) : (
                            <span style={styles.offerPrice}>
                              ₹{product.price}
                            </span>
                          )}
                        </div>

                        
                      </div>
                    );
                  })}
                </div>
              </>
            );
          }}
        />
      )}
    </div>
  );
}

// 🎨 Styles
const styles = {
  container: { padding: 20, maxWidth: 1200, margin: "auto" },
  marquee: {
    backgroundColor: "#ffeb3b",
    color: "#d32f2f",
    fontWeight: "bold",
    fontSize: "16px",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  countdown: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "18px",
    color: "#3f51b5",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 20,
  },
  card: {
    border: "1px solid #ddd",
    padding: 16,
    borderRadius: 10,
    textAlign: "center",
    backgroundColor: "#fff",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    position: "relative",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
  },

  image: {
    width: "100%",
    height: "180px",
    objectFit: "contain",
    marginBottom: 10,
  },
ribbon: {
  position: "absolute",
  top: "-8px",
  left: "-8px",
  background: "yellow",
  color: "#fff",
  padding: "4px 12px",
  fontSize: "12px",
  transform: "rotate(-20deg)",
  fontWeight: "bold",
  borderRadius: "4px",
  animation: "shake 2s ease-in-out 5s infinite", // <-- Added `2s delay` and `infinite`
},
  title: { fontSize: "16px", margin: "10px 0" },
  colorLabel: { fontSize: "14px", color: "#555" },
  rating: { fontSize: "14px", color: "#888" },
  price: { fontSize: "15px", marginTop: 10 },
  offerPrice: { color: "#d32f2f", fontWeight: "bold" },
  originalPrice: {
    textDecoration: "line-through",
    color: "#888",
    marginLeft: 6,
  },
  discount: { color: "green", marginLeft: 4 },
  insurance: { fontSize: "13px", marginTop: 5, color: "#444" },
  warranty: { fontSize: "13px", marginTop: 5, color: "#555" },
  button: {
    backgroundColor: "#1976d2",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    marginTop: 10,
    borderRadius: 4,
    cursor: "pointer",
  },
  wishlistBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    background: "none",
    border: "none",
    cursor: "pointer",
    zIndex: 2,
    fontSize: "16px",
  },
};
