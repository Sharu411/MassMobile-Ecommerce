import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Login.css";
import { API_BASE_URL } from "../utils/api";
import { AuthContext } from "../context/AuthContext"; // ✅ import AuthContext

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext); // ✅ use login from AuthContext

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin
      ? `${API_BASE_URL}/login_customer.php`
      : `${API_BASE_URL}/register_customer.php`;

    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      setMessage(result.message);

      if (result.success) {
        if (isLogin) {
          login(result.user); // ✅ call login() to update context + localStorage
          const from = location.state?.from || "/";
          navigate(from);
        } else {
          setIsLogin(true); // Switch to login form
          setFormData({ name: "", email: "", password: "", phone: "" });
        }
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>{isLogin ? "Login" : "Register"} Page</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <input
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </>
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">{isLogin ? "Login" : "Register"}</button>
      </form>
      <p style={{ color: message.includes("success") ? "green" : "red" }}>
        {message}
      </p>
      <p>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button onClick={() => setIsLogin(!isLogin)} className="toggle-btn">
          {isLogin ? "Register" : "Login"}
        </button>
      </p>
    </div>
  );
}
