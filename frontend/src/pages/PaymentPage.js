import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";

export default function PaymentPage() {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);

  // Load Razorpay script safely on page load
  useEffect(() => {
    const loadScript = () => {
      if (!window.Razorpay && !document.getElementById("razorpay-script")) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.id = "razorpay-script";
        document.body.appendChild(script);
      }
    };

    if (document.readyState === "complete") {
      loadScript();
    } else {
      window.addEventListener("load", loadScript);
      return () => window.removeEventListener("load", loadScript);
    }
  }, []);

  // Load order details from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("orderDetails");
    if (stored) {
      setOrderDetails(JSON.parse(stored));
    } else {
      navigate("/cart"); // Redirect if no data found
    }
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded || !window.Razorpay) {
      alert("⚠️ Razorpay failed to load. Please try again.");
      return;
    }

    if (!orderDetails) {
      alert("Order details missing. Please try again.");
      return;
    }

    const { totalAmount, addressId, buyNowProduct } = orderDetails;
    const productId = buyNowProduct?.id;

    if (!productId || !addressId) {
      alert("❌ Missing product or address information.");
      return;
    }

    const customer = JSON.parse(localStorage.getItem("customer"));
    if (!customer?.id) {
      alert("Please login again.");
      navigate("/login");
      return;
    }

    const orderResponse = await fetch(`${API_BASE_URL}/create_order.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: totalAmount * 100 }),
    });

    const orderData = await orderResponse.json();
    if (!orderData.id) {
      alert("Failed to create Razorpay order.");
      return;
    }

    const options = {
      key: "rzp_live_vFB1ZoVdGLHTIF",
      amount: totalAmount * 100,
      currency: "INR",
      name: "Mass Mobile",
      description: "Order Payment",
      image: "https://massmobile.byethost13.com/images/logo.png",
      order_id: orderData.id,
      handler: async function (response) {
        const verifyPayload = {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          orderDetails: orderDetails,
          customer_id: customer.id,
        };

        const verificationRes = await fetch(`${API_BASE_URL}/verify_payment.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(verifyPayload),
        });

        const verificationResult = await verificationRes.json();
        if (verificationResult.success) {
          sessionStorage.removeItem("orderDetails");
          window.location.href = "/order-success";
        } else {
          alert("❌ Payment verification failed: " + verificationResult.message);
        }
      },
      prefill: {
        name: customer.name,
        email: customer.email,
        contact: customer.phone || "9999999999",
      },
      theme: {
        color: "#4169e1",
        backdrop_color: "#f5f8ff",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (!orderDetails) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <p>Loading payment details...</p>
      </div>
    );
  }

  const amount = orderDetails?.totalAmount ?? 0;

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 30 }}>
        <span>① Address</span>
        <span>② Order Summary</span>
        <span style={{ color: "red", fontWeight: "bold" }}>③ Payment</span>
      </div>

      <h3>Payments</h3>

      <div style={{ backgroundColor: "#f0f4ff", padding: "10px 15px", borderRadius: "6px", marginBottom: "15px" }}>
        <strong>Total Amount: </strong>
        <span style={{ float: "right", color: "blue", fontSize: "18px" }}>
          ₹{amount.toLocaleString()}
        </span>
      </div>

      <div style={{ border: "1px solid #ddd", padding: 15, borderRadius: 10 }}>
        <h4>UPI</h4>
        <label>
          <input type="radio" name="upi" defaultChecked /> Pay (via Razorpay)
        </label>
        <div
          onClick={handlePayment}
          style={{
            marginTop: 10,
            backgroundColor: "#ffc107",
            padding: "10px",
            textAlign: "center",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Pay ₹{amount.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
