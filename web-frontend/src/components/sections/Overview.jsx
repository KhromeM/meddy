import React, { useEffect } from "react";
import {
	Box,
	VStack,
	Heading,
	Text,
	Button,
	Image,
	HStack,
	SimpleGrid,
	Flex,
} from "@chakra-ui/react";
import MeddyDemoGif from "../../assets/gif/meddycrop.gif";
import MeddyGif2 from "../../assets/gif/meddy3.gif";
import CardsInterface from "../CardsInterface.jsx";

import { images } from "../../../assets/images.js";
import { Link as RouterLink } from "react-router-dom";
import computer from "../../assets/img/supercomputer.jpg";
import chart from "../../assets/gif/data_vis2.gif";
import BarGraph from "./graphAnimation/BarGraph.jsx";
export const Overview = ()=>(
    <Box
    style={{
        margin: "auto",
        boxSizing: "border-box",
    }}
    width="1280px"
    w={{ xl: "80%" }} 
>
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} paddingX="5%">
        
        <Box
            position="relative"
            boxShadow="lg"
            display="flex"
            flexDirection="column"
            borderRadius="md"
            className="animated-box1"
            
            p={6}
        >
            <VStack align="flex-start" spacing={4} p={10} paddingBottom="0">
                <Heading as="h3" size="lg">
                    Live Appointment Transcription
                </Heading>
                
                <Box position="relative" width="100%" height="280px">
                    <Image
                        src={MeddyDemoGif}
                        alt="Empathic Voice Interface GIF"
                        maxHeight="280px"
                        width="80%"
                        objectFit="cover"
                        borderRadius="md"
                        position="absolute"
                        left="0"
                        zIndex={1}
                    />
                    <Image
                        src={MeddyGif2}
                        alt="Second Empathic Voice Interface GIF"
                        maxHeight="280px"
                        width="40%"
                        objectFit="cover"
                        borderRadius="md"
                        position="absolute"
                        right="0"
                        marginTop="30px"
                        zIndex={2}
                    />
                </Box>
            </VStack>
        </Box>
        {/* <Box
            className="animated-box2"
            borderRadius="md"
            boxShadow="lg"
            p={6}
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
        >
            <VStack align="flex-start" spacing={4} p={10}>
                <Heading as="h3" size="lg">
                    Voice and Translation
                </Heading>
                <Text style={{ lineHeight: "1.8em" }}>
                    Using the latest audio and TTS models, seamlessly translate
                    between doctor and patient. We auto detect language in voice and
                    chat, making conversations fluid. With Voice Mode you can access
                    all of the app's functionality from one screen; setting
                    reminders, syncing appointments, accessing your data and more in
                    a matter of seconds.
                </Text>
                <Flex flexWrap={"wrap"} gap={4}>
                    <Button
                        onClick={() => {
                            history.push("/dashboard/voicemode");
                        }}
                        backgroundColor="white"
                        variant="outline"
                        color="black"
                        borderColor="#808080"
                        width={{ base: "100%", md: "auto" }}
                        flex={{ base: "1 1 100%", md: "none" }}
                        _hover={{ backgroundColor: "rgba(0,0,0,0)" }}
                    >
                        Try Voice Mode
                    </Button>
                </Flex>
            </VStack>
        </Box> */}

        <Box
            className="animated-box3"
            borderRadius="md"
            boxShadow="lg"
            p={6}
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
        >
            <VStack align="flex-start" spacing={4} p={10} >
                <Heading as="h3" size="lg">
                    Long Term Memory
                </Heading>
                <Text style={{ lineHeight: "1.8em" }}>
                    Using Gemini's 2 million token context window, revisit
                    appointments from months ago
                </Text>
                <Flex
                    flexDirection="row"
                    justify="center"
                    align="center"
                    alignContent="center"
                    gap={4}
                    wrap="wrap"
                    width="100%"
                >
                    {/*<Image src={computer} borderRadius="md" />*/}
                    <BarGraph />

                </Flex>
            </VStack>
        </Box>

        {/* <Box
            className="animated-box4"
            borderRadius="md"
            boxShadow="lg"
            p={6}
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
        >
            <VStack align="flex-start" spacing={4} p={10}>
                <Heading as="h3" size="lg">
                    Multimodal
                </Heading>
                <Text style={{ lineHeight: "1.8em" }}>
                    Send a picture of your medication, or submit a file with your
                    health data, and Gemini will analyse it for you and suggest the
                    best course of action
                </Text>
                <Flex
                    flexDirection="row"
                    justify="center"
                    align="center"
                    gap={4}
                    wrap="wrap"
                >
                    <Image src={chart} borderRadius="10px" height="280px" />
                </Flex>
            </VStack>
        </Box> */}
    </SimpleGrid>
</Box>
)