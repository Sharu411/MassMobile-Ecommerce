import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/api";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCartItems(JSON.parse(saved));
  }, []);

  const getTotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCartItems([]);
  };

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const handleItemClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="container py-4">
      <h4 className="mb-4" style={{ color: "#003366" }}>
        Your Cart ({cartItems.length})
      </h4>

      {cartItems.length === 0 ? (
        <p className="text-muted">Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="cart-item d-flex align-items-center shadow-sm mb-3 rounded"
              onClick={() => handleItemClick(item.id)}
              style={{ cursor: "pointer" }}
            >
              <img
   src={
    item.image.startsWith("http")
      ? item.image
      : `${API_BASE_URL}/images/${item.image}`
  }
  alt={item.name}
  className="cart-img"
/>

              <div className="flex-grow-1 px-3 py-2">
                <h6 className="mb-1 fw-semibold">{item.name}</h6>
                <div className="text-muted small mb-1">
                  ₹{item.price} × {item.quantity}
                </div>
                <strong>₹{item.price * item.quantity}</strong>
              </div>

              {/* Remove icon (don’t trigger navigation) */}
              <button
                className="btn btn-sm btn-outline-danger me-3"
                onClick={(e) => {
                  e.stopPropagation(); // prevent navigate
                  removeItem(item.id);
                }}
              >
                <FaTrash />
              </button>
            </div>
          ))}

          <div className="d-flex justify-content-between align-items-center mt-4 border-top pt-3">
            <button className="btn btn-danger" onClick={clearCart}>
              Clear Cart
            </button>
            <h5>Total: ₹{getTotal().toFixed(2)}</h5>
          </div>
        </>
      )}
    </div>
  );
}
