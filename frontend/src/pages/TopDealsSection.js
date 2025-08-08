import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./TopDealsSection.css";
import { API_BASE_URL } from "../utils/api";
import { ThunderboltOutlined } from "@ant-design/icons"; // modern icon

export default function TopDealsSection() {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/get_top_deals.php`)
      .then((res) => res.json())
      .then((data) => setDeals(data))
      .catch((error) => console.error("Error fetching top deals:", error));
  }, []);

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      return <span className="deal-ended">Deal Ended</span>;
    }
    return (
      <span className="deal-timer-badge">
        Ends in: {hours}h {minutes}m {seconds}s
      </span>
    );
  };

  return (
    <section className="top-deals-section">
      <div className="container">
        
<div className="section-heading text-center mb-3">
          <h2 className="heading-title">Top Deals of the Day</h2>
          <div className="heading-underline"></div>
        </div>
        {/* Header */}
        <div className="top-deals-header">
          <h2 className="mb-0">
  <ThunderboltOutlined style={{ color: "#ea580c", fontSize: "1rem" }} />&nbsp;
  <span style={{ fontSize: "15px", fontWeight: "600" }}>Deal of the Day</span>
</h2>

          <Countdown date={Date.now() + 1000 * 60 * 60 * 6} renderer={renderer} />
        </div>

        {/* Desktop Grid */}
        <div className="row d-none d-md-flex">
          {deals.map((deal) => (
            <div className="col-md-3 mb-4" key={deal.id}>
              <Link to={`/product/${deal.id}`} className="text-decoration-none">
                <motion.div whileHover={{ scale: 1.03 }} className="deal-card">
                  <img
                    src={`${API_BASE_URL}/images/${deal.image}`}
                    alt={deal.name}
                    className="deal-img"
                  />
                  <h3 className="deal-title">{deal.name}</h3>
                  <div className="deal-prices">
                    <span className="new-price">₹{parseInt(deal.offer_price).toLocaleString()}</span>
                    <span className="old-price">₹{parseInt(deal.price).toLocaleString()}</span>
                  </div>
                  <motion.button whileTap={{ scale: 0.95 }} className="buy-button">
                    Buy Now
                  </motion.button>
                </motion.div>
              </Link>
            </div>
          ))}
        </div>

        {/* Mobile Scroll */}
        <div className="d-md-none overflow-x-auto hide-scrollbar">
          <div className="top-deals-row">
            {deals.map((deal) => (
              <Link to={`/product/${deal.id}`} key={deal.id} className="text-decoration-none">
                <motion.div whileHover={{ scale: 1.03 }} className="deal-card">
                  <img
                    src={`${API_BASE_URL}/images/${deal.image}`}
                    alt={deal.name}
                    className="deal-img"
                  />
                  <h3 className="deal-title">{deal.name}</h3>
                  <div className="deal-prices">
                    <span className="new-price">₹{parseInt(deal.offer_price).toLocaleString()}</span>
                    <span className="old-price">₹{parseInt(deal.price).toLocaleString()}</span>
                  </div>
                  <motion.button whileTap={{ scale: 0.95 }} className="buy-button">
                    Buy Now
                  </motion.button>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
