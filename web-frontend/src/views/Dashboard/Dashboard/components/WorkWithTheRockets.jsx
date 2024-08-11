// Chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Portal,
  Spacer,
  Text,
  Card as ChakraCard,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "../../../../components/Card/Card";
import CardBody from "../../../../components/Card/CardBody";
import React, { useEffect, useState } from "react";
// react icons
import { BsArrowRight } from "react-icons/bs";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

const WorkWithTheRockets = ({
  title,
  description,
  backgroundImage,
  title2,
  description2,
  backgroundImage2,
}) => {
  const overlayRef = React.useRef();
  const overlayRef2 = React.useRef();
  const bgColor = useColorModeValue("#FAF3EA", "gray.700");
  // at <1106 just disapear the description and ask meddy

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const history = useHistory();
  return (
    <Card
      backgroundColor={bgColor}
      _css={{
        wordWrap: "break-word",
        WebkitBackgroundClip: "border-box",
        backgroundClip: "border-box",

        width: "100%",
        position: "relative",
        minWidth: "0px",
        overflowWrap: "break-word",
        backgroundColor: "var(--chakra-colors-white)",
        boxShadow: "rgba(0, 0, 0, 0.02) 0px 3.5px 5.5px",
        borderRadius: "15px",
        // minHeight: "83px",
        margin: "0px",
      }}
      height="350px"
      flex
      padding="8px"
      flexDirection="column"
    >
      <Flex maxHeight="40px" flex={1} pl={6} pt={3}>
        <Text fontWeight={600} zIndex={5} height="40px" as="h2" fontSize="23px">
          Ask Meddy these health prompts
        </Text>
      </Flex>
      <ChakraCard backgroundColor={bgColor} flex={5} flexDirection="row">
        <Card
          onClick={() => {
            setTimeout(() => {
              history.push("/dashboard/chat");
            }, 300);
          }}
          maxHeight="310.5px"
          p="1rem"
          backgroundColor={bgColor}
        >
          <CardBody
            opacity="0.9"
            p="0px"
            backgroundImage={backgroundImage}
            bgPosition="center"
            bgRepeat="no-repeat"
            w="100%"
            h={{ sm: "200px", lg: "100%" }}
            bgSize="cover"
            position="relative"
            borderRadius="15px"
            _hover={{ cursor: "pointer" }}
            _active={{
              transform: "scale(0.98)",
              boxShadow: "md",
            }}
          >
            <Box
              bg="linear-gradient(360deg, rgba(49, 56, 96, 0.16) 0%, rgba(21, 25, 40, 0.88) 100%)"
              w="100%"
              position="absolute"
              h="inherit"
              borderRadius="inherit"
              ref={overlayRef}
            ></Box>
            <Portal containerRef={overlayRef}>
              <Flex
                flexDirection="column"
                color="white"
                p="1.5rem 1.2rem 0.3rem 1.2rem"
                lineHeight="1.6"
              >
                <Text
                  mt="-2"
                  fontSize="xl"
                  fontWeight="bold"
                  pb=".5rem"
                  textShadow={"0 0 20px #000"}
                >
                  {title}
                </Text>
                {windowWidth > 1106 ? (
                  <>
                    <Text
                      lineHeight="16px"
                      fontSize="sm"
                      // fontWeight="bold"
                      w={{ lg: "92%" }}
                      color="white"
                      textShadow={"0 0 20px #000"}
                    >
                      {description}
                    </Text>
                    <Spacer />
                    <Flex
                      align="center"
                      // mt={{ sm: "20px", lg: "0px", xl: "15px" }}
                      mt="auto"
                    >
                      <Button
                        p="0px"
                        variant="no-hover"
                        bg="transparent"
                        mt="12px"
                      >
                        <Text
                          fontSize="lg"
                          fontWeight="bold"
                          _hover={{ me: "4px" }}
                          transition="all .5s ease"
                          textShadow={"0 0 20px #000"}
                        >
                          Ask Meddy{" "}
                        </Text>
                        <Icon
                          as={BsArrowRight}
                          w="20px"
                          h="20px"
                          fontSize="xl"
                          transition="all .5s ease"
                          mx=".3rem"
                          cursor="pointer"
                          _hover={{ transform: "translateX(20%)" }}
                          pt="4px"
                        />
                      </Button>
                    </Flex>
                  </>
                ) : null}
              </Flex>
            </Portal>
          </CardBody>
        </Card>
        <Card backgroundColor={bgColor} maxHeight="310.5px" p="1rem">
          <CardBody
            opacity="0.9"
            p="0px"
            backgroundImage={backgroundImage2}
            bgPosition="center"
            bgRepeat="no-repeat"
            w="100%"
            h={{ sm: "200px", lg: "100%" }}
            bgSize="cover"
            position="relative"
            borderRadius="15px"
            _hover={{ cursor: "pointer" }}
            onClick={() => {
              setTimeout(() => {
                history.push("/dashboard/chat");
              }, 300);
            }}
            _active={{
              transform: "scale(0.98)",
              boxShadow: "md",
            }}
          >
            <Box
              bg="linear-gradient(360deg, rgba(49, 56, 96, 0.16) 0%, rgba(21, 25, 40, 0.88) 100%)"
              w="100%"
              position="absolute"
              h="inherit"
              borderRadius="inherit"
              ref={overlayRef2}
            ></Box>
            <Portal containerRef={overlayRef2}>
              <Flex
                flexDirection="column"
                color="white"
                p="1.5rem 1.2rem 0.3rem 1.2rem"
                lineHeight="1.6"
              >
                <Text
                  mt="-2"
                  fontSize="xl"
                  fontWeight="bold"
                  pb=".5rem"
                  textShadow={"0 0 20px #000"}
                >
                  {title2}
                </Text>
                {
                  // at width less than 1106px just disapear the description and ask meddy
                }
                {windowWidth > 1106 ? (
                  <>
                    <Text
                      lineHeight="16px"
                      fontSize="sm"
                      fontWeight="normal"
                      w={{ lg: "92%" }}
                      textShadow={"0 0 20px #000"}
                    >
                      {description2}
                    </Text>
                    <Spacer />
                    <Flex
                      align="center"
                      mt={{ sm: "20px", lg: "0px", xl: "0px" }}
                    >
                      <Button
                        p="0px"
                        variant="no-hover"
                        bg="transparent"
                        mt="12px"
                      >
                        <Text
                          fontSize="lg"
                          fontWeight="bold"
                          _hover={{ me: "4px" }}
                          transition="all .5s ease"
                          textShadow={"0 0 20px #000"}
                        >
                          Ask Meddy
                        </Text>
                        <Icon
                          as={BsArrowRight}
                          w="20px"
                          h="20px"
                          fontSize="xl"
                          transition="all .5s ease"
                          mx=".3rem"
                          cursor="pointer"
                          _hover={{ transform: "translateX(20%)" }}
                          pt="4px"
                        />
                      </Button>
                    </Flex>
                  </>
                ) : null}
              </Flex>
            </Portal>
          </CardBody>
        </Card>
      </ChakraCard>
    </Card>
  );
};

export default WorkWithTheRockets;
