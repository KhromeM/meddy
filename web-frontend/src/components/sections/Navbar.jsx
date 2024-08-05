import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Image,
  HStack,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ChevronDownIcon, CloseIcon } from "@chakra-ui/icons";

export const Navbar = () => {
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box>
      {/* Announcement Bar */}
      {showAnnouncement && (
        <Flex
          bg="black"
          color="white"
          py={2}
          px={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <Text fontSize="sm">Meddy: Your personal medical assistant</Text>
          <HStack spacing={4}>
            <Text fontSize="sm">Now available on iOS and Android</Text>
            <Button size="sm" colorScheme="whiteAlpha" variant="outline">
              <Link href="/downloadApp">Download →</Link>
            </Button>
          </HStack>
          <IconButton
            aria-label="Close announcement"
            icon={<CloseIcon />}
            size="sm"
            variant="ghost"
            color="white"
            onClick={() => setShowAnnouncement(false)}
          />
        </Flex>
      )}

      {/* Main Navbar */}
      <Flex
        bg="#FEF9EF"
        py={4}
        px={8}
        justifyContent="space-between"
        alignItems="center"
        borderBottomWidth={1}
        borderColor="black"
        wrap="wrap"
      >
        {/* Logo */}
        <Flex alignItems="center">
          <Image src="/assets/meddyLogo.png" alt="Meddy Logo" h="30px" />
          <Text fontSize="xl" fontWeight="bold" ml={2}>
            <Link href="/">Meddy</Link>
          </Text>
        </Flex>

        {/* Navigation Menu */}
        <HStack
          spacing={8}
          display={isMobile ? "none" : "flex"}
          flexGrow={1}
          justifyContent="center"
        >
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              variant="ghost"
            >
              PRODUCTS
            </MenuButton>
            <MenuList>
              <MenuItem>Product 1</MenuItem>
              <MenuItem>Product 2</MenuItem>
            </MenuList>
          </Menu>
          <Link href="/research">RESEARCH</Link>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              variant="ghost"
            >
              ABOUT
            </MenuButton>
            <MenuList>
              <MenuItem>
                <Link href="/about">About us</Link>
              </MenuItem>
              <MenuItem>Careers</MenuItem>
            </MenuList>
          </Menu>
        </HStack>

        {/* Try on Web Button */}
        <Button
          variant="outline"
          borderRadius="full"
          onClick={() => {
            window.location.href = "dashboard/chat";
          }}
        >
          TRY ON WEB →
        </Button>
      </Flex>
    </Box>
  );
};

export default Navbar;
