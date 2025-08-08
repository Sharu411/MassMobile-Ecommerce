import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/api";
export default function ProfilePage() {
  const customer = JSON.parse(localStorage.getItem("customer"));
  const [addresses, setAddresses] = useState([]);

  const fetchAddresses = async () => {
    const res = await fetch(`${API_BASE_URL}/get_addresses.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_id: customer.id }),
    });
    const result = await res.json();
    if (result.success) setAddresses(result.addresses);
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h3>My Profile</h3>
      <p>
        <strong>Name:</strong> {customer.name}
      </p>
      <p>
        <strong>Email:</strong> {customer.email}
      </p>

      <h4>Saved Addresses</h4>
      {addresses.map((addr) => (
        <div
          key={addr.id}
          style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}
        >
          <strong>{addr.name}</strong>
          <br />
          {addr.address_line1}, {addr.city}, {addr.state} - {addr.pincode}
          <br />
          Phone: {addr.phone}
          <br />
          {addr.is_default && <span style={{ color: "green" }}>Default</span>}
        </div>
      ))}
    </div>
  );
}
