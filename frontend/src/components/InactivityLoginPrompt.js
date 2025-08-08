// src/components/InactivityLoginPrompt.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function InactivityLoginPrompt() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user) return;

    let timeout;

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setShowModal(true);
      }, 60000); // 1 minute
    };

    const events = ["mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      clearTimeout(timeout);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [user]);

  const handleLogin = () => {
    setShowModal(false);
    navigate("/login");
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <>
      {showModal && (
        <div
          className="modal show fade"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1050,
          }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{
              maxWidth: "340px",
              width: "90%",
              margin: "auto",
            }}
          >
            <div
              className="modal-content"
              style={{
                borderRadius: "10px",
                border: "none",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                padding: "1rem",
              }}
            >
              {/* Header */}
              <div
                className="modal-header"
                style={{
                  backgroundColor: "#005eff",
                  color: "#fff",
                  padding: "0.75rem 1rem",
                }}
              >
                <h5 className="modal-title mb-0">⚠️ Login Required</h5>
              </div>

              {/* Body */}
              <div
                className="modal-body"
                style={{ padding: "1rem", fontSize: "14px" }}
              >
                <p style={{ marginBottom: "0.5rem", fontWeight: "500" }}>
                  You’ve been browsing for a while without logging in.
                </p>
                <p style={{ color: "#555", fontSize: "13px" }}>
                  Please login to continue shopping securely.
                </p>
              </div>

              {/* Footer */}
              <div
                className="modal-footer"
                style={{
                  borderTop: "none",
                  padding: "0.75rem 1rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <button
                  className="btn"
                  onClick={handleClose}
                  style={{
                    border: "1px solid #005eff",
                    color: "#005eff",
                    borderRadius: "30px",
                    padding: "6px 20px",
                    width: "100%",
                    backgroundColor: "#fff",
                    fontWeight: 500,
                  }}
                >
                  Continue as Guest
                </button>
                <button
                  className="btn"
                  onClick={handleLogin}
                  style={{
                    backgroundColor: "#005eff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "30px",
                    padding: "6px 20px",
                    width: "100%",
                    fontWeight: 500,
                  }}
                >
                  🔐 Login Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
