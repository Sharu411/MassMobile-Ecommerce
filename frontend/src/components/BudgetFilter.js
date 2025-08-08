// src/components/BudgetFilter.js
import React from "react";
import "./BudgetFilter.css";
import { useNavigate } from "react-router-dom";

const budgets = [
  { label: "Below ₹9,999", range: "0-9999", color: "orange" },
  { label: "₹10,000 – ₹14,999", range: "10000-14999", color: "teal" },
  { label: "₹15,000 – ₹19,999", range: "15000-19999", color: "purple" },
  { label: "₹20,000 – ₹29,999", range: "20000-29999", color: "orange" },
  { label: "₹30,000 – ₹49,999", range: "30000-49999", color: "skyblue" },
  { label: "₹50,000 – ₹74,999", range: "50000-74999", color: "teal" },
  { label: "₹75,000 – ₹99,999", range: "75000-99999", color: "purple" },
  { label: "Above ₹1,00,000", range: "100000+", color: "gold" },
];

export default function BudgetFilter() {
  const navigate = useNavigate();

  const handleClick = (range) => {
    // Redirect to product list or filtered view (adjust route as needed)
    navigate(`/budget/${range}`);
  };

  return (
    <div className="budget-container">
      <h3 className="budget-title text-dark">Shop Mobiles by Budget</h3>
      <div className="budget-buttons">
        {budgets.map((budget, index) => (
          <button
            key={index}
            className={`budget-btn ${budget.color}`}
            onClick={() => handleClick(budget.range)}
          >
            {budget.label}
          </button>
        ))}
      </div>
    </div>
  );
}
