import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import ImageSlider from "../components/ImageSlider";
import Features from "./Features";
import SocialMedia from "../components/SocialMedia";
import BrandProducts from "../components/BrandProducts";
import BudgetFilter from "../components/BudgetFilter";
import TopDealsSection from "./TopDealsSection";
import ProductReviewSection from "../components/ProductReviewSection";
import BrandSlider from "../components/BrandSlider";
import ServiceHighlights from "../components/ServiceHighlights";
import BrandProductSection from "../components/BrandProductSection";
import MobileInspectionChecklist from "./MobileInspectionChecklist";

import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";

export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <main className="text-dark min-vh-100 home-main">
      <div data-aos="fade-up">
        <BrandProducts />
      </div>

      <div data-aos="zoom-in">
        <ImageSlider />
      </div>

      {/* Welcome Section */}
      <section className="text-center py-5 welcome-section" data-aos="fade-up">
  <h2 className="display-5 fw-bold accent-yellow-text">
    Welcome to MassMobile
  </h2>
  <div className="container mt-4">
    <h3 className="fw-semibold mb-3 text-white">
      Treat Yourself to a New Mobile Phone
    </h3>
    <p className="lead mx-auto text-light paragraph-text">
      Experience the world at your fingertips! Work, socialise, book a ride, play
      games, listen to music, watch your favourite shows, take photos, or simply
      make a call. Buy a mobile phone from MassMobile that does it all – and more!
    </p>

    {/* Call to Action Button */}
    <div className="mt-4">
      <a
        href="/category/Pre%20Own%20Mobile"
        className="btn btn-warning btn-lg rounded-pill px-4"
      >
        Shop Pre-Owned Mobiles
      </a>
    </div>
  </div>
</section>


      <div data-aos="fade-right">
        <ServiceHighlights />
      </div>

      {/* Brand Sections */}
      <div data-aos="fade-up">
        <BrandProductSection
          brand="APPLE"
          category="Pre Own Mobile"
          title="Buy iPhone / Apple Mobile"
        />
      </div>
      <div data-aos="fade-up" style={{ margin: "20px 0", textAlign: "center" }}>
  <a
    href="/brand?brand=APPLE&category=all"
    style={{ display: "inline-block", width: "100%" }}
  >
    <img
      src="/images/Iphonebanner.jpg" // Replace with your actual image
      alt="Buy Iphone"
      style={{
        width: "100%",
        maxWidth: "1400px",
        height:"70px",
       //borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    />
  </a>
</div>
      <div data-aos="fade-up">
        <BrandProductSection
          brand="SAMSUNG"
          category="Pre Own Mobile"
          title="Buy Samsung Mobile"
        />
      </div>
      <div data-aos="fade-up" style={{ margin: "20px 0", textAlign: "center" }}>
  <a
    href="/brand?brand=VIVO&category=Pre%20Own%20Mobile"
    style={{ display: "inline-block", width: "100%" }}
  >
    <img
      src="/images/Iphonebanner.jpg" // Replace with your actual image
      alt="Buy Vivo Pre-Owned Phones"
      style={{
        width: "100%",
        maxWidth: "1400px",
         height:"70px",
        //borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    />
  </a>
</div>
 <div data-aos="fade-up">
        <BrandProductSection
          brand="GOOGLE"
          category="Pre Own Mobile"
          title="Buy Google Mobile"
        />
      </div>
      <div data-aos="fade-up" style={{ margin: "20px 0", textAlign: "center" }}>
  <a
    href="/brand?brand=VIVO&category=Pre%20Own%20Mobile"
    style={{ display: "inline-block", width: "100%" }}
  >
    <img
      src="/images/Iphonebanner.jpg" // Replace with your actual image
      alt="Buy Vivo Pre-Owned Phones"
      style={{
        width: "100%",
        maxWidth: "1400px",
         height:"70px",
        //borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    />
  </a>
</div>
      <div data-aos="fade-up">
        <BrandProductSection
          brand="OPPO"
          category="Pre Own Mobile"
          title="Buy  OPPO Mobile"
        />
      </div>
      <div data-aos="fade-up" style={{ margin: "20px 0", textAlign: "center" }}>
  <a
    href="/brand?brand=VIVO&category=Pre%20Own%20Mobile"
    style={{ display: "inline-block", width: "100%" }}
  >
    <img
      src="/images/Iphonebanner.jpg" // Replace with your actual image
      alt="Buy Vivo Pre-Owned Phones"
      style={{
        width: "100%",
        maxWidth: "1400px",
         height:"70px",
       // borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    />
  </a>
</div>
      <div data-aos="fade-up">
        <BrandProductSection
          brand="VIVO"
          category="Pre Own Mobile"
          title="Buy VIVO Mobile"
        />
      </div>
      <div data-aos="fade-up">
        <BrandProductSection
          brand="IQ"
          category="Pre Own Mobile"
          title="Buy IQ Mobile"
        />
      </div>
      <div data-aos="fade-up" style={{ margin: "20px 0", textAlign: "center" }}>
  <a
    href="/brand?brand=VIVO&category=Pre%20Own%20Mobile"
    style={{ display: "inline-block", width: "100%" }}
  >
    <img
      src="/images/Iphonebanner.jpg" // Replace with your actual image
      alt="Buy Vivo Pre-Owned Phones"
      style={{
        width: "100%",
        maxWidth: "1400px",
         height:"70px",
       // borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    />
  </a>
</div>
      <div data-aos="fade-up">
        <BrandProductSection
          brand="ONE PLUS"
          category="Pre Own Mobile"
          title="Buy ONE PLUS Mobile"
        />
      </div>
      <div data-aos="fade-up" style={{ margin: "20px 0", textAlign: "center" }}>
  <a
    href="/brand?brand=VIVO&category=Pre%20Own%20Mobile"
    style={{ display: "inline-block", width: "100%" }}
  >
    <img
      src="/images/Iphonebanner.jpg" // Replace with your actual image
      alt="Buy Vivo Pre-Owned Phones"
      style={{
        width: "100%",
        maxWidth: "1400px",
         height:"70px",
        //borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    />
  </a>
</div>
      <div data-aos="fade-up">
        <BrandProductSection
          brand="MI"
          category="Pre Own Mobile"
          title="Buy MI Mobile"
        />
      </div>
      <div data-aos="fade-up" style={{ margin: "20px 0", textAlign: "center" }}>
  <a
    href="/brand?brand=VIVO&category=Pre%20Own%20Mobile"
    style={{ display: "inline-block", width: "100%" }}
  >
    <img
      src="/images/Iphonebanner.jpg" // Replace with your actual image
      alt="Buy Vivo Pre-Owned Phones"
      style={{
        width: "100%",
        maxWidth: "1400px",
         height:"70px",
       // borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    />
  </a>
</div>
     
      <div data-aos="fade-up">
        <BrandProductSection
          brand="MOTO"
          category="Pre Own Mobile"
          title="Buy MOTO Mobile"
        />
      </div>

      <div data-aos="zoom-in">
        <BrandSlider />
      </div>

      <div data-aos="fade-left">
        <ProductReviewSection />
      </div>

      <div data-aos="fade-up">
        <TopDealsSection />
      </div>

      <div data-aos="fade-up">
        <MobileInspectionChecklist />
      </div>

      <div data-aos="fade-up">
        <Features />
      </div>

      <div data-aos="fade-up">
        <BudgetFilter />
      </div>

      <div data-aos="fade-up">
        <SocialMedia />
      </div>
    </main>
  );
}
