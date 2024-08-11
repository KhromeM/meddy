import {
  Box,
  Button,
  Flex,
  Spacer,
  Avatar,
  Text,
  Icon,
} from "@chakra-ui/react";
import { FaUser } from "react-icons/fa";

import { useAuth } from "../../firebase/AuthService.jsx";
import GFitOAuthButton from "../GFitOAuthButton.jsx";
import IconBox from "../Icons/IconBox.jsx";

const LoginButton = () => {
  const { user, login, logout } = useAuth();

  const handleAuth = () => {
    if (user) {
      logout();
    } else {
      login();
    }
  };

  return (
    <Button
      justifyContent="flex-start"
      alignItems="center"
      bg="transparent"
      mb="12px"
      py="12px"
      px="16px"
      borderRadius="15px"
      w="100%"
      _hover={{ bg: "transparent" }}
      _active={{
        bg: "inherit",
        transform: "scale(0.95)",
        boxShadow: "md",
      }}
      _focus={{
        boxShadow: "none",
      }}
      onClick={handleAuth}
    >
      <Flex align="center">
        <Icon
          as={FaUser}
          w="24px"
          h="24px"
          color={user ? "green.300" : "gray.400"}
          me="10px"
        />
        <Text color={"#0e3c26"} fontSize="md">
          {user ? "Logout" : "Login"}
        </Text>
      </Flex>
    </Button>
  );
};

export default LoginButton;
