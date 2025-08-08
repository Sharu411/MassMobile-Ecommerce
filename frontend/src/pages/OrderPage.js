import React, { useEffect, useState } from "react";
import "./OrderPage.css";
import { API_BASE_URL } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleCardClick = (order) => {
    navigate(`/orders/${order.order_id}`, { state: { order } });
  };

  useEffect(() => {
    const customer = JSON.parse(localStorage.getItem("customer"));
    const customerId = customer?.id; // ✅ Extract ID from the stored customer object

    if (!customerId) return; // Don't proceed if ID not found

    fetch(`${API_BASE_URL}/get_orders.php?customer_id=${customerId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
        else setOrders([]);
      })
      .catch(() => setOrders([]));
  }, []);

  const filteredOrders = orders.filter((order) =>
    order.product_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="order-page">
      <h2>My Orders</h2>

      <input
        type="text"
        placeholder="Search your orders..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {filteredOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="order-list">
          {filteredOrders.map((order) => (
            <div
              className="order-card"
              key={order.order_id}
              onClick={() => handleCardClick(order)} // ✅ updated
            >
              <img
                src={`${API_BASE_URL}/images/${order.image}`}
                alt={order.product_name}
              />
              <div>
                <h4>{order.product_name}</h4>
                <p>
                  Paid on: {new Date(order.order_date).toLocaleDateString()}
                </p>
                <p>Rating: ⭐ {order.review || "N/A"}</p>
               <p>Payment ID: {order.razorpay_payment_id || "N/A"}</p>
<p>Total: ₹{order.total || "N/A"}</p>


              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
