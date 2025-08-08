import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, FormControl, Dropdown } from "react-bootstrap";
import { FaUser, FaShoppingCart, FaHeart, FaSearch } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const { user, logout } = useContext(AuthContext);
  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalCount);
  }, []);

 const handleSearch = () => {
  if (searchQuery.trim()) {
    navigate(`/search?search=${encodeURIComponent(searchQuery.trim())}`);
    setExpanded(false); // close mobile menu if open
  }
};

  return (
    <>
      <style>
        {`
          .nav-link, a {
            transition: all 0.3s ease;
            color: #005eff !important;
          }
            .nav{
             background-color:#002366;
            }
          .nav-link:hover, a:hover {
            color: yellow !important;
            transform: scale(1.05);
            text-decoration: none;
          }
          .icon-hover {
            color: #ffffff !important;
            transition: transform 0.3s ease, color 0.3s ease;
          }
          .icon-hover:hover {
            color: #005eff !important;
            transform: scale(1.2);
          }
          .dropdown-menu a {
            transition: background 0.3s, color 0.3s;
          }
          .dropdown-menu a:hover {
            background-color: #f0f0f0;
            color: #e50914;
          }
          .badge-custom {
            background-color: #ffd700 !important;
            color: #333 !important;
          }
          .category-scroll::-webkit-scrollbar {
            display: none;
          }
          .category-scroll {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        .custom-toggler {
  background: none;
  border: none;
  padding: 0;
}

.hamburger-icon {
  width: 24px;
  height: 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hamburger-icon span {
  display: block;
  height: 3px;
  width: 100%;
  background-color: white;
  border-radius: 2px;
  transition: all 0.3s ease;
}


        `}
      </style>

      <Navbar
        expand="lg"
        sticky="top"
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
        style={{
          background: "#002366",
          padding: "12px 0",
          zIndex: 1040,
          height: "75px",
        }}
      >
        <Container fluid className="px-3">
          <Navbar.Brand
            as={Link}
            to="/"
            className="fw-bold d-flex align-items-center gap-2"
          >
            <img
              src="/images/logo.png"
              alt="MassMobile"
              width="32"
              height="32"
              style={{ borderRadius: "50%" }}
            />
            <span
              style={{
                color: "#fff",
                fontSize: "1.4rem",
                fontWeight: 600,
                letterSpacing: "0.5px",
              }}
            >
              MassMobile
            </span>
          </Navbar.Brand>

          <div className="d-flex align-items-center gap-3 ms-auto d-lg-none">
            <Link to="/wishlist" className="icon-hover">
              <FaHeart size={18} />
            </Link>
            <Link to="/cart" className="position-relative icon-hover">
              <FaShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill badge-custom">
                  {cartCount}
                </span>
              )}
            </Link>
        <Navbar.Toggle
  aria-controls="main-navbar"
  className="custom-toggler"
  onClick={() => setExpanded(!expanded)}
>
  <div className="hamburger-icon">
    <span></span>
    <span></span>
    <span></span>
  </div>
</Navbar.Toggle>



          </div>

          <Navbar.Collapse id="main-navbar">
            <div className="d-lg-flex justify-content-between align-items-center w-100">
              <Nav className="me-auto d-flex flex-row gap-3 d-none d-md-flex">
                <Nav.Link as={Link} to="/" className="nav-link">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/products" className="nav-link">
                  Products
                </Nav.Link>
              </Nav>

              <div
                className="d-none d-lg-flex align-items-center"
                style={{ maxWidth: "400px", width: "100%" }}
              >
                <FormControl
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  style={{
                    borderRadius: "30px 0 0 30px",
                    border: "1px solid #005eff",
                    padding: "10px 15px",
                    backgroundColor: "#fff",
                  }}
                />
                <button
                  onClick={handleSearch}
                  style={{
                    backgroundColor: "#005eff",
                    border: "none",
                    borderRadius: "0 30px 30px 0",
                    padding: "10px",
                    color: "#fff",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#003cb3")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "#005eff")
                  }
                >
                  <FaSearch />
                </button>
              </div>

              <div className="d-none d-lg-flex align-items-center gap-3 ms-4">
                <Link to="/wishlist" className="icon-hover">
                  <FaHeart size={18} />
                </Link>
                <Link to="/cart" className="position-relative icon-hover">
                  <FaShoppingCart size={18} />
                  {cartCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill badge-custom">
                      {cartCount}
                    </span>
                  )}
                </Link>
                {user ? (
                  <Dropdown align="end">
                    <Dropdown.Toggle
                      variant="link"
                      className="p-0 border-0 icon-hover"
                    >
                      <FaUser size={18} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="px-2">
                      <Dropdown.Item as={Link} to="/orders">
                        Orders
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/profile">
                        Profile
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/address">
                        Address
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                ) : (
                  <Link to="/login" className="icon-hover">
                    <FaUser size={18} />
                  </Link>
                )}
              </div>
            </div>

            <div
              className="d-lg-none mt-3 text-center py-3"
              style={{
                backgroundColor: "#002366",
                borderTop: "1px solid #005eff",
              }}
            >
              <Nav className="flex-column gap-2">
                <Nav.Link
                  as={Link}
                  to="/"
                  onClick={() => setExpanded(false)}
                  className="nav-link"
                >
                  Home
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/products"
                  onClick={() => setExpanded(false)}
                  className="nav-link"
                >
                  Products
                </Nav.Link>
                {user ? (
                  <>
                    <Nav.Link
                      as={Link}
                      to="/orders"
                      onClick={() => setExpanded(false)}
                      className="nav-link"
                    >
                      Orders
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/profile"
                      onClick={() => setExpanded(false)}
                      className="nav-link"
                    >
                      Profile
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/address"
                      onClick={() => setExpanded(false)}
                      className="nav-link"
                    >
                      Address
                    </Nav.Link>
                    <Nav.Link
                      onClick={() => {
                        logout();
                        setExpanded(false);
                      }}
                      className="nav-link"
                    >
                      Logout
                    </Nav.Link>
                  </>
                ) : (
                  <Nav.Link
                    as={Link}
                    to="/login"
                    onClick={() => setExpanded(false)}
                    className="nav-link"
                  >
                    Login
                  </Nav.Link>
                )}
              </Nav>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* 📌 Fixed Category Bar */}
      <div
        className="category-bar"
        style={{
          position: "sticky",
          top: "60px", // Adjust depending on your header height
          zIndex: 1030,
          backgroundColor: "#002366",
          borderTop: "1px solid #ddd",
        }}
      >
        <div
          className="category-scroll d-flex flex-nowrap flex-lg-wrap overflow-auto overflow-lg-visible px-3 py-2 justify-content-lg-between justify-content-start"
          style={{
            scrollbarWidth: "none",
          }}
        >
          {[
            ["Home", "/"],
            ["New Mobile", "/category/New Mobile"],
            ["Pre Own Mobile", "/category/Pre Own Mobile"],
            ["All Products", "/products"],
            ["Smartwatch", "/category/Smartwatch"],
            ["Airpods", "/category/Airpods"],
          ].map(([label, path]) => (
            <Link
              key={path}
              to={path}
              className="text-decoration-none nav-link text-nowrap px-3"
              style={{
                whiteSpace: "nowrap",
                fontWeight: "500",
                color: "#005eff",
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* 🔍 Search Bar for Mobile View */}
      <div
        className="d-lg-none"
        style={{ backgroundColor: "#fff", padding: "4px 0" }}
      >
        <Container>
          <div className="d-flex align-items-center">
            <FormControl
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              style={{
                borderRadius: "30px",
                border: "1px solid #005eff",
                padding: "6px 12px",
                backgroundColor: "#fff",
              }}
            />
            <button
              onClick={handleSearch}
              style={{
                backgroundColor: "#005eff",
                border: "none",
                borderRadius: "50%",
                padding: "6px",
                color: "#fff",
                marginLeft: "8px",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#003cb3")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#005eff")
              }
            >
              <FaSearch />
            </button>
          </div>
        </Container>
      </div>
    </>
  );
}
