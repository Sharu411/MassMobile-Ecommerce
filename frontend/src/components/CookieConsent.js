import React, { useEffect, useState } from "react";
import "./CookieConsent.css";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (consent === null) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "true");
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookie_consent", "false");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner">
      <p>
        🍪 This website uses cookies to enhance your experience.
        <a href="/privacy" className="cookie-link">
          {" "}
          Learn more{" "}
        </a>
        <br />
      </p>
      <div className="cookie-buttons">
        <button className="cookie-accept" onClick={handleAccept}>
          Accept
        </button>
        <button className="cookie-reject" onClick={handleReject}>
          Reject
        </button>
      </div>
    </div>
  );
}
