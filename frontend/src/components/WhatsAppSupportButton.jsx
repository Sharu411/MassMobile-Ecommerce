import React, { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppSupportButton() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋 How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const handleSend = () => {
    if (!input.trim()) return;

    const lower = input.toLowerCase().trim();
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSuggestions([]);

    let botReply = "I'm sorry, I didn't understand that. Type 'human' for support.";

    if (["hi", "hello", "help", "info", "?", "hey", "support"].includes(lower)) {
      botReply = "Here are some things I can help with:";
      setSuggestions([
        "How to order?",
        "Do you offer Cash on Delivery?",
        "What payment methods do you support?",
        "Can I return a product?",
        "Do you sell refurbished mobiles?",
      ]);
    } else if (lower.includes("price") || lower.includes("cost") || lower.includes("how much")) {
      botReply = "Our mobiles start from ₹5,000. Prices are listed on each product page.";
    }  else if (lower.includes("new mobile") || lower.includes("brand new")) {
      botReply = "Yes, we sell brand-new mobiles with warranty.";
    } else if (lower.includes("refurbished")) {
      botReply = "Refurbished phones are tested, certified, and come with a warranty.";
    } else if (lower.includes("condition") || lower.includes("scratches")) {
      botReply = "Each mobile’s condition is clearly mentioned on the product page.";
    } else if (lower.includes("battery")) {
      botReply = "Refurbished phones have at least 80% battery health. New phones have 100%.";
    } else if (lower.includes("color")) {
      botReply = "Available colors are listed on the product page.";
    } else if (lower.includes("cod") || lower.includes("cash on delivery")) {
      botReply = "COD is not available, You can check at checkout.";
    } else if (lower.includes("delivery") || lower.includes("shipping")) {
      botReply = "We deliver across Tamilnadu in 3–5 working days.";
    } else if (lower.includes("delivery charge") || lower.includes("shipping cost")) {
      botReply = "Most orders come with free delivery. Charges (if any) are shown at checkout.";
    } else if (lower.includes("same day delivery")) {
      botReply = "Currently, we do not offer same-day delivery.";
    } else if (lower.includes("track") || lower.includes("shipment")) {
      botReply = "Tracking details will be sent to website once the product is shipped.";
    } else if (lower.includes("payment") || lower.includes("how to pay") || lower.includes("pay now")) {
      botReply = "We accept UPI, Cards, Netbanking.";
    } else if (lower.includes("emi") || lower.includes("finance")) {
      botReply = "EMI is available for major banks and shown on the payment page if eligible.";
    } else if (lower.includes("order status") || (lower.includes("order") && lower.includes("track"))) {
      botReply = "Please check your Order page to track the status.";
    } else if (lower.includes("how can i order") || lower.includes("how to order") || lower.includes("place order")) {
      botReply = "Click 'Buy Now' on the product page, fill your details, and complete payment.";
    } else if (lower.includes("warranty") || lower.includes("guarantee")) {
      botReply = "All products include a 6-month seller warranty. Mostly based on the products.";
    } else if (lower.includes("return") || lower.includes("refund")) {
      botReply = "We offer a 7-day return policy for eligible issues. Please check our return policy.";
    } else if (lower.includes("exchange")) {
      botReply = "You can exchange an old mobile for a discount. Check the product page.";
    } else if (lower.includes("insurance") || lower.includes("protection")) {
      botReply = "Add accidental damage protection from the Add-ons section during checkout.";
    } else if (lower.includes("accessories") || lower.includes("charger") || lower.includes("cable")) {
      botReply = "You can add accessories (charger, case, etc.) during checkout.";
    } else if (lower.includes("box") || lower.includes("packaging")) {
      botReply = "Phones are safely packed. Refurbished phones may come in non-original boxes.";
    } else if (lower.includes("earphones")) {
      botReply = "Some phones include earphones. You can also add them during checkout.";
    } else if (lower.includes("invoice") || lower.includes("bill")) {
      botReply = "A digital invoice is sent to order page after purchase.";
    } else if (lower.includes("gst") || lower.includes("gst invoice")) {
      botReply = "Yes, we provide GST invoices. Enter your GSTIN during checkout.";
    } else if (lower.includes("location") || lower.includes("store") || lower.includes("where are you")) {
      botReply = "We are an online and offline store. Orders are shipped from Thoothukudi.";
    } else if (lower.includes("pickup")) {
      botReply = "Self-pickup is not available. We ship all orders via courier.";
    } else if (lower.includes("site not working") || lower.includes("bug") || lower.includes("error")) {
      botReply = "We’re sorry! Please refresh the page or contact support if the issue continues.";
    } else if (lower.includes("contact") || lower.includes("phone number")) {
      botReply = "You can contact us via WhatsApp or use the contact form on our website. Type 'human'.";
    } else if (lower.includes("login issue") || lower.includes("can't login")) {
      botReply = "Please check your email and password. Use 'Forgot Password' if needed.";
    } else if (lower.includes("product not found")) {
      botReply = "Some products may be out of stock. Try again later or ask support.";
    } else if (lower.includes("offer") || lower.includes("discount") || lower.includes("sale")) {
      botReply = "We run limited-time discounts. Check the product page for current deals.";
    }else if (
      lower.includes("human") || lower.includes("agent") || lower.includes("support") || lower.includes("talk to")
    ) {
      botReply = "Connecting you to human support...Please click 'Chat on WhatsApp'.";
      setShowWhatsApp(true);
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    }, 400);
  };

  return (
    <>
      {!showChat && (
        <div
          onClick={() => setShowChat(true)}
          style={{
            position: "fixed",
            bottom: "70px",
            right: "20px",
            width: "100px",
            height: "40px",
            borderRadius: "20px",
            backgroundColor: "#007bff",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            cursor: "pointer",
            zIndex: 9999,
          }}
        >
          Quick Support
        </div>
      )}

      {showChat && (
        <div
          style={{
            position: "fixed",
            bottom: "120px",
            right: "20px",
            width: "300px",
            maxHeight: "460px",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            overflow: "hidden",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header with Close Button */}
          <div
            style={{
              padding: "10px",
              background: "#007bff",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Support Chat</span>
            <button
              onClick={() => setShowChat(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "18px",
                cursor: "pointer",
              }}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Chat Messages */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
              backgroundColor: "#f9f9f9",
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: "10px",
                  textAlign: msg.sender === "user" ? "right" : "left",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: "16px",
                    backgroundColor: msg.sender === "user" ? "#007bff" : "#e0e0e0",
                    color: msg.sender === "user" ? "white" : "black",
                    maxWidth: "80%",
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div style={{ paddingTop: "10px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {suggestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(q);
                      setTimeout(() => handleSend(), 100);
                    }}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "16px",
                      border: "1px solid #007bff",
                      backgroundColor: "#e7f1ff",
                      color: "#007bff",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input Field */}
          <div style={{ display: "flex", padding: "10px", borderTop: "1px solid #ccc" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <button onClick={handleSend} style={{ marginLeft: "5px" }}>
              Send
            </button>
          </div>

          {/* WhatsApp Button */}
          {showWhatsApp && (
            <div style={{ padding: "10px", textAlign: "center" }}>
              <a
                href="https://wa.me/919944298448?text=Hi,%20I%20need%20human%20support."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  backgroundColor: "#25D366",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "20px",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                <FaWhatsapp style={{ marginRight: "8px" }} />
                Chat on WhatsApp
              </a>
            </div>
          )}
        </div>
      )}
    </>
  );
}
