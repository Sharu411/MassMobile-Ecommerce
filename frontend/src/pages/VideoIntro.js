import React, { useEffect, useState } from "react";
import "./VideoIntro.css";

export default function LogoIntro({ onEnd }) {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowText(true), 1500); // Show text after logo animation
    const timer2 = setTimeout(() => onEnd(), 2250); // End animation

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onEnd]);

  return (
    <div className="logo-intro-container">
      <div className="logo-wrapper">
        <img src="/images/logo.png" alt="Mass Mobile Logo" className="intro-logo" />
      </div>
      {showText && <h1 className="intro-text">Mass Mobile</h1>}
    </div>
  );
}
