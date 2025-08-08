import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";
import "./OrderDetailPage.css";
import { useParams } from "react-router-dom";


export default function OrderDetailPage() {

  const navigate = useNavigate();
 const { order_id } = useParams();
 const {  state } = useLocation(); 
  const [order, setOrder] = useState(null);
useEffect(() => {
  const id = order_id || state?.order?.razorpay_payment_id;

  if (order_id) {
    fetch(`${API_BASE_URL}/get_order_info.php?order_id=${order_id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setOrder(data.order);
        else console.warn("❌ Order not found using order_id");
      })
      .catch(err => console.error("❌ Fetch error:", err));
  } else if (state?.order?.razorpay_payment_id) {
    fetch(`${API_BASE_URL}/get_order_info.php?payment_id=${state.order.razorpay_payment_id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setOrder(data.order);
        else console.warn("❌ Order not found using payment_id");
      })
      .catch(err => console.error("❌ Fetch error:", err));
  } else if (state?.order) {
    setOrder(state.order); // fallback
  }
}, [order_id, state]);

  const handleCancel = async (orderId) => {
    const reason = prompt("Please provide a reason for cancellation:");
    if (!reason) return;
    const res = await fetch(`${API_BASE_URL}/cancel_order.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: orderId, reason }),
    });
    const data = await res.json();
    if (data.success) {
           window.scrollTo({ top: 0, behavior: "smooth" });
      alert("Order cancelled successfully.");
      navigate("/orders");
    } else {
      alert("Cancellation failed.");
    }
  };
const getInvoiceNumber = (orderId) => {
  const date = new Date(order.created_at || Date.now());
  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2);
  const paddedId = String(orderId).padStart(6, '0');
  return `INV/${year}/${month}/${paddedId}`;
};

  const handleReturn = async (orderId) => {
    const reason = prompt("Why are you returning this item?");
    if (!reason) return;
    const res = await fetch(`${API_BASE_URL}/return_request.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: orderId, reason }),
    });
    const data = await res.json();
    if (data.success) {
           window.scrollTo({ top: 0, behavior: "smooth" });
      alert("Return request submitted.");
      navigate("/orders");
    } else {
      alert("Return request failed.");
    }
  };
function amountInWords(amount) {
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen',
    'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty',
    'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ];

  const numToWords = (n) => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + numToWords(n % 100) : '');
    if (n < 100000) return numToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + numToWords(n % 1000) : '');
    if (n < 10000000) return numToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + numToWords(n % 100000) : '');
    return numToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + numToWords(n % 10000000) : '');
  };

  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return 'Invalid Amount';

  const [rupees, paise] = num.toFixed(2).split('.');

  let result = '';
  const rupeeValue = parseInt(rupees, 10);
  const paiseValue = parseInt(paise, 10);

  if (rupeeValue === 0) result = 'Zero Rupees';
  else result = numToWords(rupeeValue) + ' Rupees';

  if (paiseValue > 0) {
    result += ' and ' + numToWords(paiseValue) + ' Paise';
  }

  return result + ' Only';
}

  function handlePrintInvoice() {
  const invoiceElement = document.getElementById("invoice-section");
  if (!invoiceElement) {
    alert("Invoice section not found.");
    return;
  }

  const invoiceContent = invoiceElement.innerHTML;
  const win = window.open("", "", "height=700,width=900");
  win.document.write('<html><head><title>Invoice</title></head><body>');
  win.document.write(invoiceContent);
  win.document.write('</body></html>');
  win.document.close();
  win.print();
}


  if (!order) return <p>Loading order details...</p>;
const tdStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "center",
  fontSize: "14px",
};
 
  return (
    <div className="order-detail-page">
      <h2>🛒 Order Summary</h2>

      {/* Product Details */}
      <div className="order-summary">
        <img src={`${API_BASE_URL}/images/${order.image}`} alt={order.product_name} className="order-product-image" />
        <div>
          <p><strong>Product:</strong> {order.product_name}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Tracking:</strong> {order.tracking_status || "Not yet updated"}</p>
          <p><strong>Payment Mode:</strong> {order.payment_mode}</p>
          <p><strong>Order Date:</strong> {new Date(order.order_date).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Tracking Progress */}
      <div className="tracking-bar">
  {["Ordered", "Shipped", "Out for Delivery", "Delivered"].map((step, index) => {
    const statusFlow = ["Ordered", "Shipped", "Out for Delivery", "Delivered"];
    const currentIndex = statusFlow.indexOf(order.tracking_status);
    const isActive = index <= currentIndex;
    return (
      <div key={step} className={`step ${isActive ? "active" : ""}`}>
        {step}
      </div>
    );
  })}
</div>


      {/* Shipping */}
      <div className="detail-section">
        <h4>📦 Shipping Address</h4>
        <p>{order.receiver_name}</p>
        <p>{order.address_line1}, {order.address_line2}</p>
        <p>{order.city}, {order.state} - {order.pincode}</p>
        <p>📞 {order.phone}</p>
      </div>

      {/* Return / Cancellation */}
      <div className="detail-section">
        <h4>↩️ Return / Cancellation</h4>
        <p><strong>Return Requested:</strong> {order.return_requested === 1 ? "Yes" : "No"}</p>
        <p><strong>Return Status:</strong> {order.return_status || "Pending"}</p>
        <p><strong>Cancel Reason:</strong> {order.cancel_reason || "None"}</p>
      </div>

     <div id="invoice-section" className="invoice-wrapper" style={{ padding: "20px", border: "1px solid #ccc", fontFamily: "Arial" }}>

  <h2 style={{ textAlign: "center" }}>🧾 TAX INVOICE</h2>
  
  <div style={{ marginBottom: "20px" }}>
  {order?.order_id ? (
  <p><strong>Invoice No:</strong> {getInvoiceNumber(order.order_id)}</p>
) : (
  <p><strong>Invoice No:</strong> Loading...</p>
)}
    <p><strong>Invoice Date:</strong> {new Date(order.order_date).toLocaleDateString()}</p>
    <p><strong>Payment ID:</strong> {order.razorpay_payment_id}</p>
    <p><strong>Payment Mode:</strong> {order.payment_mode}</p>
  </div>

  <hr />

  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
    <div>
      <h4>Sold By:</h4>
      <p><strong>Mass Mobiles</strong></p>
      <p>36, South New Street,</p>
<p>Near Pillaiyar Kovil,</p>
<p>Thoothukudi - 628002, Tamil Nadu</p>
    </div>

    <div>
      <h4>Billing To:</h4>
      <p><strong>{order.receiver_name}</strong></p>
      <p>{order.address_line1}, {order.address_line2}</p>
      <p>{order.city}, {order.state} - {order.pincode}</p>
      <p>📞 {order.phone}</p>
    </div>
  </div>

  <hr />

  <h4 style={{ marginTop: "20px" }}>🛒 Item Details</h4>
  <div style={{ overflowX: "auto" }}>
   <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px", minWidth: "600px" }}>
    <thead>
      <tr style={{ backgroundColor: "#f2f2f2" }}>
        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Item</th>
        <th style={{ border: "1px solid #ccc", padding: "8px" }}>HSN</th>
        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Qty</th>
        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Price</th>
        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Margin</th>
        <th style={{ border: "1px solid #ccc", padding: "8px" }}>GST</th>
        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Total</th>
      </tr>
    </thead>
    <tbody>
  {order.product_price > 0 && (
  <tr>
    <td style={tdStyle}>
      {order.product_name}
      <br />
      <small>{order.product_category}</small>
    </td>
    <td style={tdStyle}>85171290</td>
    <td style={tdStyle}>1</td>
    

    {order.product_category === "Pre Own Mobile" ? (
      // Pre-owned logic
      (() => {
        const margin = order.product_price * 0.005;
        const gst = margin * 0.18;
        const original = order.product_price - margin - gst;

        return (
          <>
          <td style={tdStyle}>₹{original.toFixed(2)}</td>
            <td style={tdStyle}>₹{margin.toFixed(2)}</td>
            <td style={tdStyle}>₹{gst.toFixed(2)}</td>
            <td style={tdStyle}>₹{order.product_price.toLocaleString()}</td>
          </>
        );
      })()
    ) : (
      // New logic
      (() => {
        const gst = order.product_price * 0.18;
        const original = order.product_price - gst;

        return (
          <>
          <td style={tdStyle}>₹{original.toFixed(2)}</td>
            <td style={tdStyle}>–</td>
            <td style={tdStyle}>₹{gst.toFixed(2)}</td>
            <td style={tdStyle}>₹{order.product_price.toLocaleString()}</td>
          </>
        );
      })()
    )}
  </tr>
)}

{order.addon_price > 0 && (() => {
  const addonGst = order.addon_price * 0.18;
  const addonOriginal = order.addon_price - addonGst;

  return (
    <tr>
      <td style={tdStyle}>Add-ons</td>
      <td style={tdStyle}>85171290</td>
      <td style={tdStyle}>1</td>
      <td style={tdStyle}>₹{addonOriginal.toFixed(2)}</td>
      <td style={tdStyle}>-</td>
      <td style={tdStyle}>₹{addonGst.toFixed(2)}</td>
      <td style={tdStyle}>₹{order.addon_price.toLocaleString()}</td>
    </tr>
  );
})()}


  {order.plan_price > 0 && (
    <tr>
      <td style={tdStyle}>Protection Plan</td>
      <td style={tdStyle}>–</td>
      <td style={tdStyle}>-</td>
      <td style={tdStyle}>₹{order.plan_price.toLocaleString()}</td>
      <td style={tdStyle}>–</td>
      <td style={tdStyle}>-</td>
      <td style={tdStyle}>₹{order.plan_price.toLocaleString()}</td>
    </tr>
  )}
</tbody>

  </table></div>

 <p style={{ marginTop: "10px" }}>
  <strong>Total Amount:</strong> ₹{order.total_amount}
</p>
<p><strong>In Words:</strong> {amountInWords(order.total_amount)}</p>

  <hr />

  <div style={{ marginTop: "20px" }}>
    <h4>📄 Declaration</h4>
    <p>Warranty Details: As per Warranty Card. Services and Warranty claims will be handled only through authorised service centers.</p>
    <p>This is a computer-generated invoice and does not require physical signature.</p>
  </div>

  <div style={{ textAlign: "right", marginTop: "30px" }}>
    <p><strong>For Mass Mobiles</strong></p>
    <p>Authorized Signature</p>
  </div>
</div>

      {/* Buttons */}
   <div className="d-flex flex-wrap gap-3 justify-content-center mt-4 mb-5">
  <button className="btn btn-primary custom-flipkart px-4 py-2" onClick={handlePrintInvoice}>
    🧾 <span className="ms-2">Download Invoice</span>
  </button>

  {order.status === "Delivered" && (
    <button className="btn btn-outline-primary custom-flipkart px-4 py-2" onClick={() => handleReturn(order.order_id)}>
      Return Product
    </button>
  )}

  {order.status !== "Delivered" && (
    <button className="btn btn-outline-danger custom-flipkart px-4 py-2" onClick={() => handleCancel(order.order_id)}>
      Cancel Order
    </button>
  )}

  <button className="btn btn-secondary custom-flipkart px-4 py-2" onClick={() => navigate("/orders")}>
    Back to My Orders
  </button>
</div>

    </div>
  );
}
