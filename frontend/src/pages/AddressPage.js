import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";

export default function AddressPage() {
  const customer = JSON.parse(localStorage.getItem("customer"));
  const navigate = useNavigate();
  const location = useLocation();

  const [addresses, setAddresses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    pincode: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    landmark: "",
    is_default: false,
  });

  const params = new URLSearchParams(location.search);
  const returnTo = params.get("returnTo");
  const productId = params.get("productId");

  const fetchAddresses = useCallback(async () => {
    const res = await fetch(`${API_BASE_URL}/get_addresses.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_id: customer.id }),
    });
    const result = await res.json();
    if (result.success) {
      setAddresses(result.addresses);
    }
  }, [customer.id]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isEditing ? "update_address.php" : "add_address.php";
    const payload = {
      customer_id: customer.id,
      ...formData,
      ...(isEditing && { address_id: editingAddressId }),
    };

    const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (result.success) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setFormData({
        name: "",
        phone: "",
        pincode: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        landmark: "",
        is_default: false,
      });
      setIsEditing(false);
      setEditingAddressId(null);

      if (returnTo === "buy-now" && productId) {
        sessionStorage.setItem("buyNowProductId", productId);
        navigate("/buy-now");
      } else {
        fetchAddresses();
      }
    } else {
      alert("Failed to save address.");
    }
  };

  const handleEdit = (addr) => {
    setFormData({
      name: addr.name,
      phone: addr.phone,
      pincode: addr.pincode,
      address_line1: addr.address_line1,
      address_line2: addr.address_line2,
      city: addr.city,
      state: addr.state,
      landmark: addr.landmark,
      is_default: addr.is_default === "1" || addr.is_default === 1,
    });
    setEditingAddressId(addr.id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this address?");
    if (!confirmDelete) return;

    const res = await fetch(`${API_BASE_URL}/delete_address.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address_id: id, customer_id: customer.id }),
    });

    const result = await res.json();
    if (result.success) {
      fetchAddresses();
    } else {
      alert("Failed to delete address.");
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>My Addresses</h3>

      {addresses.map((addr) => (
        <div key={addr.id} style={styles.card}>
          <div style={styles.cardBody}>
            <strong>{addr.name}</strong>
            <p style={styles.text}>
              {addr.address_line1}, {addr.city}, {addr.state} - {addr.pincode}
              <br />
              Phone: {addr.phone}
              {addr.is_default && (
                <span style={styles.defaultBadge}>Default</span>
              )}
            </p>
            <div style={styles.buttonGroup}>
              <button onClick={() => handleEdit(addr)} style={styles.editBtn}>
                Edit
              </button>
              <button
                onClick={() => handleDelete(addr.id)}
                style={styles.deleteBtn}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}

      <hr />
      <h4>{isEditing ? "Update Address" : "Add New Address"}</h4>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input name="name" placeholder="Full Name" required value={formData.name} onChange={handleChange} style={styles.input} />
        <input name="phone" placeholder="Phone" required value={formData.phone} onChange={handleChange} style={styles.input} />
        <input name="pincode" placeholder="Pincode" required value={formData.pincode} onChange={handleChange} style={styles.input} />
        <input name="address_line1" placeholder="Address Line 1" required value={formData.address_line1} onChange={handleChange} style={styles.input} />
        <input name="address_line2" placeholder="Address Line 2" value={formData.address_line2} onChange={handleChange} style={styles.input} />
        <input name="city" placeholder="City" required value={formData.city} onChange={handleChange} style={styles.input} />
        <input name="state" placeholder="State" required value={formData.state} onChange={handleChange} style={styles.input} />
        <input name="landmark" placeholder="Landmark (optional)" value={formData.landmark} onChange={handleChange} style={styles.input} />

        <label style={styles.checkboxLabel}>
          <input type="checkbox" name="is_default" checked={formData.is_default} onChange={handleChange} />
          Set as default
        </label>

        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.submitBtn}>
            {isEditing ? "Update Address" : "Save Address"}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditingAddressId(null);
                setFormData({
                  name: "",
                  phone: "",
                  pincode: "",
                  address_line1: "",
                  address_line2: "",
                  city: "",
                  state: "",
                  landmark: "",
                  is_default: false,
                });
              }}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: "auto",
    padding: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    border: "1px solid #ccc",
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#f9f9f9",
  },
  cardBody: {
    display: "flex",
    flexDirection: "column",
  },
  text: {
    fontSize: "14px",
    marginTop: 4,
    marginBottom: 8,
  },
  defaultBadge: {
    marginLeft: 10,
    color: "green",
    fontWeight: "bold",
  },
  buttonGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
  },
  editBtn: {
    padding: "6px 12px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "6px 12px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  input: {
    padding: 8,
    borderRadius: 4,
    border: "1px solid #ccc",
    width: "100%",
  },
  checkboxLabel: {
    marginTop: 10,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  submitBtn: {
    padding: "10px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    width: "fit-content",
  },
  cancelBtn: {
    padding: "10px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    width: "fit-content",
  },
};
