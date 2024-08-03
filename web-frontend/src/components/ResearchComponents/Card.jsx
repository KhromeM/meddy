// Card.jsx
import React from "react";
import { Box, Heading } from "@chakra-ui/react";

const Card = ({ title, graph }) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      width="100%"
      maxW="600px"
      m="4"
      p="4" // Add padding here
      boxShadow="md"
    >
      {title && (
        <Heading size="md" mb="4">
          {title}
        </Heading>
      )}
      <Box height="300px" p="4">
        {" "}
        {/* Add padding to this container */}
        {graph}
      </Box>
    </Box>
  );
};

export default Card;
