import React from "react";
import { Container } from "react-bootstrap";
import "./Footer.css";
import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(to right, #002366, #005eff)", // Royal → Electric Blue
        color: "#fff",
        padding: "20px 0",
        fontSize: "15px",
        letterSpacing: "0.3px",
      }}
    >
      <Container className="text-center">
        <p style={{ marginBottom: "6px" }}>
          &copy; 2025 <strong style={{ color: "#FFD700" }}>MassMobile</strong>.
          All Rights Reserved.
        </p>
        <p style={{ marginBottom: "0px", fontSize: "13px", color: "#e0e0e0" }}>
          India’s Trusted Platform for Certified Pre-Owned Smartphones
        </p>
        <div className="footer-container">
          <div className="footer-column">
            <ul>
              <li>
                <Link to="/privacy" className="custom-link">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <ul>
              <li>
                <Link to="/terms-and-conditions" className="custom-link">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
          {/* Customer Service */}
          <div className="footer-column">
            <ul>
              <li>
                <Link to="/return-policy" className="custom-link">
                  Return Policy
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <ul>
              <li>
                <Link to="/contact" className="custom-link">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <ul>
              <li>
                <Link to="/shipping-policy" className="custom-link">
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </footer>
  );
}
