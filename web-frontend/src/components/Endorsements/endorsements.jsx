import React, { useEffect, useRef } from "react";
import "./reviews.css";

const reviews = [
  {
    text: "I highly recommend this physiotherapy clinic.",
    author: "- John Doe",
  },
  { text: "The physiotherapists here are amazing.", author: "- Jane Smith" },
  {
    text: "Great experience overall. Highly recommended!",
    author: "- Alice Johnson",
  },
  {
    text: "The best physiotherapy clinic I've been to.",
    author: "- Michael Brown",
  },
  { text: "Excellent service and care. Thank you!", author: "- Emily Davis" },
  {
    text: "Professional and friendly staff. Highly recommend.",
    author: "- David Wilson",
  },
  {
    text: "They really know what they're doing. Fantastic experience!",
    author: "- Sarah Lee",
  },
  {
    text: "Top-notch physiotherapy clinic. Very satisfied with the treatment.",
    author: "- Chris Martin",
  },
  {
    text: "Highly skilled physiotherapists. Made a huge difference for me.",
    author: "- Linda Taylor",
  },
  {
    text: "The care I received was excellent. I feel much better now.",
    author: "- James White",
  },
];

export const Endorsements = () => {
  const reviewsRef = useRef(null);
  const reviewsRefReverse = useRef(null);

  useEffect(() => {
    const ul = reviewsRef.current;
  }, []);

  const handleMouseEnter = (ref) => {
    const ul = ref.current;
    if (ul) {
      ul.style.animationPlayState = "paused";
    }
  };

  const handleMouseLeave = (ref) => {
    const ul = ref.current;
    if (ul) {
      ul.style.animationPlayState = "running";
    }
  };

  return (
    <div className="relative font-inter antialiased bg-white-200">
      <div className="w-full overflow-hidden">
        <div className="reviews-container">
          <ul
            ref={reviewsRef}
            className="reviews-list"
            onMouseEnter={() => handleMouseEnter(reviewsRef)}
            onMouseLeave={() => handleMouseLeave(reviewsRef)}
          >
            {reviews.map((review, index) => (
              <li key={index} className="review-item">
                <div className="review-card">
                  <p>{review.text}</p>
                  <span>{review.author}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="reviews-container">
          <ul
            ref={reviewsRef}
            className="reviews-reverse"
            onMouseEnter={() => handleMouseEnter(reviewsRef)}
            onMouseLeave={() => handleMouseLeave(reviewsRef)}
          >
            {reviews.map((review, index) => (
              <li key={index} className="review-item">
                <div className="review-card">
                  <p>{review.text}</p>
                  <span>{review.author}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Endorsements;
