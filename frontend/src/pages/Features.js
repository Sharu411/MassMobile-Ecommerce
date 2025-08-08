import React from "react";
import { motion } from "framer-motion";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Features.css";

const features = [
  {
    icon: "bi-speedometer2",
    title: "Fast & Reliable",
    description: "Quick order processing with real-time tracking.",
  },
  {
    icon: "bi-shield-lock",
    title: "Secure Payments",
    description: "Multiple safe payment options including Google Pay.",
  },
  {
    icon: "bi-truck",
    title: "Fast Delivery",
    description: "Reliable shipping with easy returns and replacements.",
  },
  {
    icon: "bi-headset",
    title: "24/7 Support",
    description: "Dedicated support to assist you anytime.",
  },
];

export default function Features() {
  return (
    <section className="features-section">
      <div className="container">
        <h3 className="features-heading">Why Choose MassMobile?</h3>

        {/* Mobile scroll */}
        <div className="features-scroll d-md-none">
          {features.map((item, idx) => (
            <motion.div
              className="feature-card-scroll"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              viewport={{ once: true }}
              key={idx}
            >
              <div className="feature-card text-center">
                <div className="icon-circle">
                  <i className={`bi ${item.icon}`}></i>
                </div>
                <div className="feature-title">{item.title}</div>
                <div className="feature-description">{item.description}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop grid */}
        <div className="row d-none d-md-flex">
          {features.map((item, idx) => (
            <motion.div
              className="col-md-3 mb-3"
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="feature-card text-center">
                <div className="icon-circle">
                  <i className={`bi ${item.icon}`}></i>
                </div>
                <div className="feature-title">{item.title}</div>
                <div className="feature-description">{item.description}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
