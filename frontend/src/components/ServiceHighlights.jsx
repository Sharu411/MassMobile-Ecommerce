import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./ServiceHighlights.css"; // We'll write custom styles here

export default function ServiceHighlights() {
  const services = [
    {
      icon: "bi-arrow-repeat",
      label: "7 Days Replacement",
    },
    {
      icon: "bi-truck",
      label: "Cash on Delivery",
    },
    {
      icon: "bi-credit-card",
      label: "Easy EMI",
    },
    {
      icon: "bi-tags",
      label: "Great Deals",
    },
  ];

  return (
    <div className="highlights-section py-4">
      <div className="container">
        <div className="scroll-container d-md-none">
          {services.map((service, idx) => (
            <div key={idx} className="highlight-card text-center me-3">
              <i className={`bi ${service.icon} icon-style`}></i>
              <div className="label-style">{service.label}</div>
            </div>
          ))}
        </div>

        {/* Keep desktop layout */}
        <div className="row g-3 justify-content-center d-none d-md-flex">
          {services.map((service, idx) => (
            <div key={idx} className="col-md-3">
              <div className="highlight-card text-center">
                <i className={`bi ${service.icon} icon-style`}></i>
                <div className="label-style">{service.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
