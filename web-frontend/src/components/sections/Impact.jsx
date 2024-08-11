import React, { useState, useEffect, useRef } from "react";
import { VStack, Box, Image, Text } from "@chakra-ui/react";
import homeScreen from "../../assets/img/home-screenshot.png";
import "../../styles/animatedBG.css";

const boxStyle = {
  width: "300px",
  height: "150px",
  border: "1px solid rgba(10, 32, 69,0.3)",
  position: "absolute",
};

const phrases = [
  "54% of medical waste is paper and cardboard",
  "US hospitals generate 2 billion pounds of paper & cardboard waste annually",
  "Consumers in the US waste over $418 billion due to suboptimal use of medicine",
  "20% of people in the US have Limited Language Proficiency",
  "15,8% of ESL patients had a bad reaction to medication due to a problem understanding their doctor's instructions",
  "2 out of 3 prescription medications are reported unused",
  "Hospitals constitute up to 1,5% of all urban waste",
  "85% of hospital waste is non toxic, the majority being paper and cardboard",
  "50% of LEP patients believe the language barrier contributed to errors",
  "70,7% of LEP patients reported limited access to interpreter services",
  "Access to translation tools improves patient and doctor satisfaction up to 92%",
  "49,6% of patients mention forgetfulness as a major reason of medication non adherence",
  "Medication non adherence costs the US $105 billion each year",
  "The leading causes of medication non adherence are poor patient-doctor communication, lack of health education and complex regimes",
  "1 out of 5 hospital interpreters have inadequate language skills",
];
const colors = [
    // Cool colors
    "#e1eafa",  // Original color (cool blue)
    "#e1e6fa",  // Cool lavender blue
    "#e3e1fa",  // Cool periwinkle
    "#e8e1fa",  // Cool light purple
    "#efe1fa",  // Cool lilac
    "#f6e1fa",  // Cool pink-purple
    "#fae1f8",  // Cool light magenta
    "#fae1ef",  // Cool pink
    "#fae1e6",  // Cool light rose
    "#fae1e1",  // Cool very light red
    "#e1faf8",  // Cool turquoise
    "#e1faf1",  // Cool mint
    "#e1faea",  // Cool light green
    "#e1fae3",  // Cool pastel green
    "#e1fadc",  // Cool light lime
  
    // Warm colors
    "#fae6e1",  // Warm peach
    "#faede1",  // Warm light orange
    "#faf4e1",  // Warm light yellow
    "#fafae1",  // Warm pastel yellow
    "#f4fae1",  // Warm yellow-green
    "#edfae1",  // Warm lime
    "#e6fae1",  // Warm light green
    "#e1fae6",  // Warm mint-green
    "#e1faed",  // Warm aqua
    "#e1faf4",  // Warm light turquoise
    "#e1f4fa",  // Warm sky blue
    "#e1edfa",  // Warm light blue
    "#e1e6fa",  // Warm lavender blue
    "#e6e1fa",  // Warm light purple
    "#ede1fa"   // Warm light violet
  ];
  const DataCard = ({ defaultTop, defaultSide, isLeft, animationDelay }) => {
    const [state, setState] = useState({
      phrase: phrases[Math.floor(Math.random() * phrases.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
    });
    const cardRef = useRef(null);
  
    useEffect(() => {
      const card = cardRef.current;
      if (!card) return;
  
      const handleAnimationIteration = () => {
        // Update state when the card is not visible (around 50% of the animation)
        setTimeout(() => {
          setState({
            phrase: phrases[Math.floor(Math.random() * phrases.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
          });
        }, 10000); // Half of the animation duration (20s / 2)
      };
  
      card.addEventListener('animationiteration', handleAnimationIteration);
  
      return () => {
        card.removeEventListener('animationiteration', handleAnimationIteration);
      };
    }, []);
  
    return (
      <Box
        ref={cardRef}
        {...boxStyle}
        top={defaultTop}
        padding="15px"
        {...(isLeft ? { left: defaultSide} : { right: defaultSide })}
        boxShadow="lg"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        borderRadius="20px"
        backgroundColor={state.color}
        className="animated-card"
        style={{
          animationDelay: `${animationDelay}s`,
        }}
      >
        <Text fontSize="lg" fontWeight="light" textAlign="left" color="rgba(10, 32, 69, 0.8)">
          {state.phrase}
        </Text>
      </Box>
    );
  };
  
  const Impact = () => {
    return (
      <VStack width="100%" height="100vh" justifyContent="center" alignItems="center">
        <Box position="relative" width="100%" height="100%">
          <Image
            src={homeScreen}
            alt="Empathic Voice Interface"
            borderRadius="20px"
            boxShadow="lg"
            width="30%"
            objectFit="cover"
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
          />
          
          {/* Left side boxes */}
          <DataCard defaultTop="20%" defaultSide="-5%" isLeft={true} animationDelay={0} />
          <DataCard defaultTop="45%" defaultSide="4%" isLeft={true} animationDelay={10} />
          <DataCard defaultTop="70%" defaultSide="0%" isLeft={true} animationDelay={3} />
          
          {/* Right side boxes */}
          <DataCard defaultTop="15%" defaultSide="2%" isLeft={false} animationDelay={4} />
          <DataCard defaultTop="40%" defaultSide="-6%" isLeft={false} animationDelay={7} />
          <DataCard defaultTop="67%" defaultSide="3%" isLeft={false} animationDelay={16} />
        </Box>
      </VStack>
    );
  };
  
  export default Impact;
  
  