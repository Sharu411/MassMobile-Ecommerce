import React from "react";
import { Carousel } from "react-bootstrap";
import "./ImageSlider.css";

export default function ImageSlider() {
  return (
    <div className="carousel-wrapper">
      <Carousel fade interval={1500} controls={false} indicators={false}>
        <Carousel.Item>
          <img
            className="slider-image"
            src="/images/slide1.webp"
            alt="Slide 1"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="slider-image"
            src="/images/slide2.webp"
            alt="Slide 2"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="slider-image"
            src="/images/slide3.webp"
            alt="Slide 3"
          />
        </Carousel.Item>
      </Carousel>
    </div>
  );
}
