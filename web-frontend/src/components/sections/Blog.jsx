import React, { useState } from "react";
import {
  VStack,
  Heading,
  Box,
  Image,
  Text,
  Button,
} from "@chakra-ui/react";
import "../../styles/BlogPosts.css";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

const BlogPost = ({ title, date, image }) => (
  <Box
    borderWidth={1}
    borderRadius="lg"
    overflow="hidden"
    // minWidth="220px" // Ensure fixed width for each blog post
    // maxWidth="220px"
	height={'100%'}
  >
	<Box height={'400px'}>
		<Image borderRadius="lg" objectFit={'cover'} height={'100%'} src={image} alt={title} />

	</Box>
    <Box p={4}>
      <Heading size="md" mb={2}>
        {title}
      </Heading>
      <Text fontSize="sm" color="gray.500" mb={4}>
        {date}
      </Text>
    </Box>
  </Box>
);

const Blog = () => {
  const [state, setState] = useState({
    options: {
      loop: true,
      margin: 10,
      nav: true,
      autoplay: true,
      autoplayHoverPause: true,
	  autoplayTimeout: 2100,
	  smartSpeed: 600,
      responsive: {
        0: {
          items: 1,
        },
        600: {
          items: 3,
        },
        1000: {
          items: 3,
        },
      },
    },
  });

  return (
    <VStack spacing={8} align="stretch">
      <Heading textAlign="center">Latest Updates</Heading>
      <Box className="scrolling-container">
        <OwlCarousel {...state.options} className="owl-theme">
          <BlogPost
            title="Who is Meddy?"
            date="Apr 18, 2024"
            image="/assets/gfd1mhkys4v2qt6dyfzb-1@2x.png"
          />
          <BlogPost
            title="Meddy-human symbiosis"
            date="Feb 9, 2024"
            image="/assets/mnkbvkebhngvvgeb2r74-1@2x.png"
          />
          <BlogPost
            title="Take the Meddy path through life"
            date="Feb 21, 2024"
            image="/assets/tucagxrxrfpn2ojse68i-2@2x.png"
          />
        </OwlCarousel>
      </Box>
      <Button
        alignSelf="center"
        rightIcon={
          <Image src="/assets/svg-9.svg" boxSize="1.5rem" alt="Learn more icon" />
        }
      >
        Learn more about our research
      </Button>
    </VStack>
  );
};

export default Blog;
