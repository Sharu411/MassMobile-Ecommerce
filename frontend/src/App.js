import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// Layout & UI Components
import TopSlider from "./components/TopSlider";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WelcomePopup from "./components/WelcomePopup";
import CookieConsent from "./components/CookieConsent";
import InactivityLoginPrompt from "./components/InactivityLoginPrompt";

// Context
import { AuthProvider } from "./context/AuthContext";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProfilePage from "./pages/ProfilePage";
import AddressPage from "./pages/AddressPage";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import BrandPage from "./pages/BrandPage";
import Wishlist from "./components/Wishlist";
import Cart from "./pages/Cart";
import BuyNow from "./pages/BuyNow";
import PaymentPage from "./pages/PaymentPage";
import OrderSuccess from "./pages/OrderSuccess";
import OrderPage from "./pages/OrderPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import SearchResults from "./pages/SearchResults";
import BudgetProductList from "./pages/BudgetProductList";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import ReturnPolicy from "./pages/ReturnPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import CategoryPage from "./pages/CategoryPage";
import ProtectedRoute from "./components/ProtectedRoute";

// Admin Pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Orders from "./pages/admin/Orders";
import Products from "./pages/admin/Products";
import Customers from "./pages/admin/Customers";
import CancelledOrders from "./pages/admin/CancelledOrders";
import ReturnRequests from "./pages/admin/ReturnRequests";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import BulkUpload from "./pages/admin/BulkUpload";
import ContactPage from "./pages/ContactPage";
import WhatsAppSupportButton from "./components/WhatsAppSupportButton";
import AdminWelcomePopupSettings from './pages/admin/AdminWelcomePopupSettings';

// Intro
import VideoIntro from "./pages/VideoIntro";
import OfferPage from "./pages/OfferPage";


// ----------------------------
// AppRoutes Component
// ----------------------------
function AppRoutes({ showWelcomePopup }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Show only for customers */}
      {!isAdminRoute && <InactivityLoginPrompt />}
      {!isAdminRoute && <WelcomePopup trigger={showWelcomePopup} />}
      {!isAdminRoute && <TopSlider />}
      {!isAdminRoute && <Header />}
    

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/address" element={<AddressPage />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/brand" element={<BrandPage />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/buy-now" element={<ProtectedRoute><BuyNow /></ProtectedRoute>} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/orders" element={<OrderPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/budget/:range" element={<BudgetProductList />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/offers/:offerName" element={<OfferPage />} />
      


        <Route path="/category/:slug" element={<CategoryPage />} />
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/orders" element={<Orders />} />
        <Route path="/admin/products" element={<Products />} />
        <Route path="/admin/customers" element={<Customers />} />
        <Route path="/admin/cancelled_order" element={<CancelledOrders />} />
        <Route path="/admin/return-orders" element={<ReturnRequests />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/edit-product/:id" element={<EditProduct />} />
        <Route path="/admin/bulk-upload" element={<BulkUpload />} />
        <Route path="/admin/welcome-popup" element={<AdminWelcomePopupSettings />} />
      
    
      </Routes>

      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <CookieConsent />}
      {!isAdminRoute && <WhatsAppSupportButton />}
    </>
  );
}

// ----------------------------
// App Component
// ----------------------------
function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const alreadyPlayed = localStorage.getItem("introPlayed");
    if (alreadyPlayed === "true") {
      setShowIntro(false);
      setShowPopup(true);
    }
  }, []);

  const handleVideoEnd = () => {
    setShowIntro(false);
    setShowPopup(true);
  };

  return (
    <AuthProvider>
      <Router>
        {showIntro ? (
          <VideoIntro onEnd={handleVideoEnd} />
        ) : (
          <AppRoutes showWelcomePopup={showPopup} />
        )}
      </Router>
    </AuthProvider>
  );
}

export default App;
