import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

export default function SocialMedia() {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        {/* About Us */}
        <div className="footer-column">
          <h4>
            <strong>About Us</strong>
          </h4>
          <ul>
            <li>Our Story</li>
            <li>Careers</li>
            <li>
              <Link to="/privacy" className="custom-link">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms-and-conditions" className="custom-link">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div className="footer-column">
          <h4>
            <strong>Customer Service</strong>
          </h4>
          <ul>
            <li>Help Center</li>
            <li>
              <Link to="/return-policy" className="custom-link">
                Return Policy
              </Link>
            </li>
            <li>
              <Link to="/shipping-policy" className="custom-link">
                Shipping Policy
              </Link>
            </li>
            <li>Order Status</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-column">
          <h4>
            <strong>Contact</strong>
          </h4>
          <ul>
            <li>Email: massmobiletn69@gmail.com</li>
            <li>Phone: +91 9944298448</li>
            <li>Mon - Sat (10AM - 10PM)</li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>
            <strong>Shop Address</strong>
          </h4>
          <ul>
            <li>
              <strong>Address:</strong>
              <br />
              Mass Mobile Store,
              <br />
              36, South New Street,
              <br />
              Near Pillaiyar Kovil,
              <br />
              Thoothukudi - 628002, Tamil Nadu
            </li>
          </ul>
        </div>
        {/* Follow Us placed below this */}
        <div className="follow-us">
          <h4>
            <strong>Follow Us</strong>
          </h4>
          <div className="social-icons">
            <a
              href="https://www.facebook.com/yourclientusername"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/massmobilestuty/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>
            <a
              href="https://twitter.com/yourclientusername"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter />
            </a>
            <a
              href="https://www.linkedin.com/in/yourclientusername"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="https://www.youtube.com/@MassMobilesTuty"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
