import React, { useState } from "react";
import "./ConditionSection.css"; // Create this CSS file

const CONDITION_DATA = {
  Superb: {
    highlights: [
      {
        title: "Overall",
        description: "Absence of Functional Flaws",
        images: ["/images/superb/overall1.jpg"],
      },
      {
        title: "Screen Glass",
        description:
          "Very slight scuffs that are only apparent when the display is off",
        images: ["/images/superb/screen1.jpg"],
      },
      {
        title: "Display",
        description: "Flawless state",
        images: ["/images/superb/display1.jpg"],
      },
      {
        title: "Chrome/Body",
        description:
          "Light scratches and minor wear indicators, invisible at 20 cm.",
        images: ["/images/superb/body1.jpg"],
      },
      {
        title: "Chrome/Body",
        description:
          "Light scratches and minor wear indicators, invisible at 20 cm.",
        images: ["/images/superb/camera.jpg"],
      },
      {
        title: "Chrome/Body",
        description:
          "Light scratches and minor wear indicators, invisible at 20 cm.",
        images: ["/images/superb/side.jpg"],
      },
    ],
  },
  Good: {
    highlights: [
      {
        title: "Overall",
        description: "Minor cosmetic imperfections",
        images: ["/images/superb/display1.jpg"],
      },
      {
        title: "Screen Glass",
        description: "Visible scratches when screen is off",
        images: ["/images/superb/overall1.jpg"],
      },
      {
        title: "Display",
        description: "Fully functional, some blemishes",
        images: ["/images/superb/body1.jpg"],
      },
      {
        title: "Chrome/Body",
        description: "Moderate scratches visible up close",
        images: ["/images/superb/screen1.jpg"],
      },
      {
        title: "Chrome/Body",
        description:
          "Light scratches and minor wear indicators, invisible at 20 cm.",
        images: ["/images/superb/camera.jpg"],
      },
      {
        title: "Chrome/Body",
        description:
          "Light scratches and minor wear indicators, invisible at 20 cm.",
        images: ["/images/superb/side.jpg"],
      },
    ],
  },
  Fair: {
    highlights: [
      {
        title: "Overall",
        description: "Noticeable signs of use",
        images: ["/images/superb/screen1.jpg"],
      },
      {
        title: "Screen Glass",
        description: "Heavy scuffs or marks visible even when display is on",
        images: ["/images/superb/body1.jpg"],
      },
      {
        title: "Display",
        description: "Visible wear but functional",
        images: ["/images/superb/overall1.jpg"],
      },
      {
        title: "Chrome/Body",
        description: "Deep scratches and dents",
        images: ["/images/superb/display1.jpg"],
      },
      {
        title: "Chrome/Body",
        description:
          "Light scratches and minor wear indicators, invisible at 20 cm.",
        images: ["/images/superb/camera.jpg"],
      },
      {
        title: "Chrome/Body",
        description:
          "Light scratches and minor wear indicators, invisible at 20 cm.",
        images: ["/images/superb/side.jpg"],
      },
    ],
  },
};

export default function ConditionSection() {
  const [selected, setSelected] = useState("Superb");

  const condition = CONDITION_DATA[selected];

  return (
    <div className="condition-section">
      <h3>Condition Explained</h3>
      <p className="subtitle">
        Refurbished phones come in 3 variants - Open Box, Superb, Good, Fair.
        Still puzzled? Check out explanatory videos to learn more.
      </p>

      {/* Buttons */}
      <div className="condition-buttons">
        {Object.keys(CONDITION_DATA).map((key) => (
          <button
            key={key}
            className={selected === key ? "active" : ""}
            onClick={() => setSelected(key)}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Dynamic Info */}
      <div className="condition-details">
        {condition.highlights.map((item, index) => (
          <div key={index} className="highlight-section">
            <h5>
              <span className="tick">✔</span> {item.title} -{" "}
              <span>{item.description}</span>
            </h5>
            <div className="highlight-images">
              {item.images.map((src, i) => (
                <img src={src} alt={`${item.title}-${i}`} key={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
