import React, { useEffect, useRef } from "react";
import "./reviews.css";

const reviews = [
	{
		text: "My grandparents finally understand their health instructions.",
		author: "Nahi Khan",
		image: "/assets/teams/nopfp.png",
	},

	{
		text: "Meddy is incredible.",
		author: "Za Mustafa",
		image: "/assets/teams/Za.jpeg",
	},

	{
		text: "Brilliant app for non-English speakers. It’s a lifesaver!",
		author: "William Chan",
		image: "/assets/teams/William.jpeg",
	},

	{
		text: "A game-changer, Epic should take notice.",
		author: "Varvara Mironov",
		image: "/assets/teams/nopfp.png",
	},
	{
		text: "Simple and effective, you don't need much more.",
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
		text: "How does Meddy do it?",
		author: "Kin Pong (Isaac) To",
		image: "/assets/teams/Kin.jpeg",
	},
	{
		text: "I'm no longer afriad to visit the doctor if I have Meddy.",
		author: "Osaf Ali",
		image: "/assets/teams/Osaf.jpeg",
	},
	{
		text: "The app is great for bridging the communication gap in healthcare.",
		author: "Muzzammil Nawab",
		image: "/assets/teams/Muzzammil.jpeg",
	},

	{
		text: "I have gotten so much great health tips from Meddy.",
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
										<img
											src={review.image}
											alt={`${review.author} profile`}
											className="review-image"
										/>
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
										<img
											src={review.image}
											alt={`${review.author} profile`}
											className="review-image"
										/>
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
