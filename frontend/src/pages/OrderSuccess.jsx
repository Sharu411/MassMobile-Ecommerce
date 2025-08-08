import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orderLoaded, setOrderLoaded] = useState(false);

  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setLoading(false);
      setOrderLoaded(true);

      // Auto-redirect after 3 seconds
      setTimeout(() => {
        navigate("/orders");
      }, 3000);
    }, 1500); // Simulate order loading for 2 seconds

    return () => clearTimeout(loadTimer);
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        fontFamily: "sans-serif",
        minHeight: "60vh",
      }}
    >
      {loading ? (
        <p style={{ fontSize: "18px", color: "#555" }}>
          Loading your order...
        </p>
      ) : orderLoaded ? (
        <>
          <CheckCircle size={64} color="green" />
          <h2 style={{ color: "green", marginTop: 20 }}>Payment Successful!</h2>
          <p style={{ margin: "20px 0", color: "#555", textAlign: "center" }}>
            Your order has been placed successfully. Thank you for shopping with us!
            <br />
            Redirecting to your orders...
          </p>
        </>
      ) : null}
    </div>
  );
}
