// src/pages/MobileInspectionChecklist.js
import "./MobileInspectionChecklist.css";
import React, { useRef } from "react";

const checklist = [
  {
    category: "Exterior & Physical Condition",
    items: [
      "Body chassis – dents, cracks, frame alignment",
      "Screen/display – scratches, dead pixels, touch sensitivity",
      "Buttons – power, volume, home, function smoothly",
      "Ports & connectors – charging, headphone, SIM tray, microSD",
      "SIM tray – intact and functional (issues reported on Reddit)",
      "Seals/grills – intact for dust/water protection (if applicable)",
      "Paint/finish – uniform and not peeled",
      "Camera lens cover – scratch-free and flush",
    ],
    icon: "bi-phone",
  },
  {
    category: "Audio & Haptics",
    items: [
      "Speakers – volume test, distortion check",
      "Microphones – voice clear test",
      "Vibration motor – tactile responsiveness",
    ],
    icon: "bi-volume-up",
  },
  {
    category: "Cameras & Sensors",
    items: [
      "Rear camera – focus, sharpness, flash",
      "Front camera – selfie quality and lens clarity",
      "Autofocus and stabilization – works as expected",
      "Proximity sensor – screen on/off while calling",
      "Ambient light sensor – auto brightness functional",
      "Other sensors – gyroscope, accelerometer, compass",
    ],
    icon: "bi-camera",
  },
  {
    category: "Connectivity",
    items: [
      "Wi‑Fi – connects reliably",
      "Bluetooth – pairing & audio test",
      "Cellular radios – voice and data test",
      "GPS – real‑time location test",
      "NFC – tap payment or data transfer check (if supported)",
    ],
    icon: "bi-wifi",
  },
  {
    category: "Battery & Performance",
    items: [
      "Battery health – wear level & hold charge",
      "Charging – wired & wireless",
      "Thermal performance – no overheating",
      "CPU/Memory – stress test, multi‑tasking",
      "RAM & Storage – read/write checks",
    ],
    icon: "bi-battery-full",
  },
  {
    category: "Display & Interface",
    items: [
      "Touchscreen – full‑screen responsiveness",
      "Display backlight – uniform brightness",
      "Dead/touch‑ghost pixels – none",
      "Screen alignment – properly seated, no gaps",
    ],
    icon: "bi-display",
  },
  {
    category: "Final Checks",
    items: ["Factory reset & data wipe – secure erasure completed"],
    icon: "bi-check2-circle",
  },
];
export default function MobileInspectionChecklist() {
  const scrollRef = useRef();

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <section className="inspection-section py-5 bg-light">
      <div className="container position-relative">
        <div className="section-heading mb-4 text-center">
          <h2 className="heading-title">✅ Mobile Inspection Checklist</h2>
          <div className="heading-underline"></div>
        </div>

        {/* Arrow buttons (visible only on desktop) */}
        <button
          className="scroll-btn left d-none d-md-block"
          onClick={scrollLeft}
        >
          <i className="bi bi-chevron-left"></i>
        </button>
        <button
          className="scroll-btn right d-none d-md-block"
          onClick={scrollRight}
        >
          <i className="bi bi-chevron-right"></i>
        </button>

        <div className="inspection-scroll-container" ref={scrollRef}>
          <div className="d-flex flex-nowrap gap-3">
            {checklist.map(({ category, items, icon }, index) => (
              <div
                key={index}
                className="card p-3 rounded shadow-sm checklist-card"
              >
                <h5 className="text-accent">
                  <i className={`bi ${icon} me-2 text-warning`}></i>
                  {category}
                </h5>
                <ul className="small mt-2 ps-3 mb-0">
                  {items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
