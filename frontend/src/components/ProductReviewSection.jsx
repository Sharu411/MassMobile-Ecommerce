import React from "react";
import "./ProductReviewSection.css";

const videoData = [
  {
    title: "Review 1",
    url: "https://www.youtube.com/embed/iSuymA0TIJ0",
  },
  {
    title: "Review 2",
    url: "https://www.youtube.com/embed/W24OfGBx4Cc",
  },
  {
    title: "Review 3",
    url: "https://www.youtube.com/embed/c5U-iJIccw8",
  },
];

export default function ProductReviewSection() {
  return (
    <section className="py-5 px-3 bg-light text-dark">
      <div className="container">
        <h2 className="section-title text-center mb-5 text-gold">
          Our Product Reviews
        </h2>

        <div className="review-scroll-wrapper">
          <div className="review-scroll-inner d-flex flex-nowrap gap-3">
            {videoData.map((video, index) => (
              <div key={index} className="review-card-wrapper">
                <div className="review-card bg-white shadow-sm">
                  <iframe
                    width="100%"
                    height="250"
                    src={video.url}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  <div className="p-2 text-center fw-medium">{video.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
