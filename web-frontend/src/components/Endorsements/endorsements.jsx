import React, { useEffect, useRef } from "react";
import "./reviews.css";

const reviews = [
    {
      text: "This app has made communication so much easier for my elderly patients. Highly recommend!",
      author: "MD. Tahira",
      image: "/assets/teams/nopfp.png",
    },
    {
      text: "My grandparents finally understand their health instructions.",
      author: "Nahi Khan",
      image: "/assets/teams/nopfp.png",
    },

    {
      text: "This app made it so easy for my parents to communicate with their doctor.",
      author: "Za Mustafa",
      image: "/assets/teams/Za.jpeg",
    },
    { 
      text: "As a doctor, this app is a vital tool for bridging language gaps with non-English speakers.", 
      author: "MD. Safiyah",
      image: "/assets/teams/nopfp.png",
    },
    {
      text: "Brilliant app for non-English speakers. It’s a lifesaver!",
      author: "William Chan",
      image: "/assets/teams/William.jpeg",
    },

    {
      text: "A game-changer for the elderly who struggle with English.",
      author: "Varvara Mironov",
      image: "/assets/teams/nopfp.png",
    },
    {
      text: "Simple and effective for seniors like my parents.",
      author: "Shashank Datta Bezgam",
      image: "/assets/teams/shashank.jpeg",
    },
    {
      text: "This app breaks language barriers in healthcare.",
      author: "Fourat Rachid",
      image: "/assets/teams/Fourat.jpeg",
    },
    {
      text: "A must-have for those who need language assistance.",
      author: "Duy Doan",
      image: "/assets/teams/nopfp.png",
    },
    {
      text: "Finally, an app that helps non-English speakers with medical appointments.",
      author: "Brian Lin",
      image: "/assets/teams/Brain.jpeg",
    },
    {
      text: "My parents find it so easy to use this app to talk to their doctor.",
      author: "Aditya Udyavar",
      image: "/assets/teams/Aditya.jpeg",
    },
    {
      text: "This app is a blessing for the elderly in our community.",
      author: "Kin Pong (Isaac) To",
      image: "/assets/teams/Kin.jpeg",
    },
    {
      text: "No more language issues at the doctor's office thanks to this app.",
      author: "Osaf Ali",
      image: "/assets/teams/Osaf.jpeg",
    },
    {
      text: "The app is great for bridging the communication gap in healthcare.",
      author: "Muzzammil Nawab",
      image: "/assets/teams/Muzzammil.jpeg",
    },
    {
      text: "An essential app for ensuring my patients fully understand their medical care, regardless of language.",
      author: "MD. Asiyah",
      image: "/assets/teams/nopfp.png",
    },
    {
      text: "Perfect for elderly patients who need help with English.",
      author: "Sean Munjal",
      image: "/assets/teams/Sean.jpeg",
    },
];

export const Endorsements = () => {
  const reviewsRef = useRef(null);
  const reviewsRefReverse = useRef(null);

  useEffect(() => {
    const ul = reviewsRef.current;
    const ulReverse = reviewsRefReverse.current;
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
                  <div className="profile-section">
                    <img src={review.image} alt={`${review.author} profile`} className="review-image" />
                    <span className="review-author">{review.author}</span>
                  </div>
                  <p>{review.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="reviews-container">
          <ul
            ref={reviewsRefReverse}
            className="reviews-reverse"
            onMouseEnter={() => handleMouseEnter(reviewsRefReverse)}
            onMouseLeave={() => handleMouseLeave(reviewsRefReverse)}
          >
            {reviews.map((review, index) => (
              <li key={index} className="review-item">
                <div className="review-card">
                  <div className="profile-section">
                    <img src={review.image} alt={`${review.author} profile`} className="review-image" />
                    <span className="review-author">{review.author}</span>
                  </div>
                  <p>{review.text}</p>
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
