import React, { useState, useEffect, useRef } from "react";
import { VStack, Box, Image, Text } from "@chakra-ui/react";
import homeScreen from "../../assets/img/home-screenshot.png";
import "../../styles/animatedBG.css";

const boxStyle = {
  width: "400px",
  height: "120px",
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
    "#fafafe"
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
          <DataCard defaultTop="20%" defaultSide="-7%" isLeft={true} animationDelay={0} />
          <DataCard defaultTop="45%" defaultSide="-1%" isLeft={true} animationDelay={10} />
          <DataCard defaultTop="70%" defaultSide="-3%" isLeft={true} animationDelay={3} />
          
          {/* Right side boxes */}
          <DataCard defaultTop="15%" defaultSide="-3%" isLeft={false} animationDelay={4} />
          <DataCard defaultTop="40%" defaultSide="-10%" isLeft={false} animationDelay={7} />
          <DataCard defaultTop="67%" defaultSide="-1%" isLeft={false} animationDelay={16} />
        </Box>
      </VStack>
    );
  };
  
  export default Impact;
  
  