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
  // console.log(user);
  const handleAuth = () => {
    if (user) {
      logout();
    } else {
      login();
    }
  };
  return (
    // <Box bg="teal.500" px={4} py={2}>
    //   <Flex alignItems="center">
    //     <Spacer />

    //     {user && (
    //       <Button colorScheme="teal" variant="outline" mr={4}>
    //         <Avatar name={user.displayName} src={user.photoURL} />
    //       </Button>
    //     )}
    //     <GFitOAuthButton />
    //     <Button colorScheme="teal" variant="solid" onClick={handleAuth}>
    //       {user ? "Logout" : "Login"}
    //     </Button>
    //   </Flex>
    // </Box>

    <Button
      boxSize="initial"
      //   position="absolute"
      //   bottom="22px"
      justifyContent="flex-start"
      alignItems="center"
      bg="transparent"
      mb={{
        xl: "12px",
      }}
      mx={{
        xl: "auto",
      }}
      py="12px"
      ps={{
        sm: "10px",
        xl: "16px",
      }}
      //   mt="auto"
      alignSelf="flex-end"
      borderRadius="15px"
      _hover="none"
      w="100%"
      _active={{
        bg: "inherit",
        transform: "none",
        borderColor: "transparent",
        transform: "scale(0.91)",
        boxShadow: "md",
      }}
      _focus={{
        boxShadow: "none",
      }}
      //   onClick={onOpen}
      onClick={handleAuth}
    >
      <Flex>
        {/* <IconBox bg={inactiveBg} color="orange.200" h="30px" w="30px" me="12px"> */}

        {/* </IconBox> */}

        <Icon
          as={FaUser}
          width="24px"
          h="24px"
          color={user ? "green.300" : "gray.400"}
          me="10px"
          mb="auto"
          ml={1}
        ></Icon>
        <Text ml={1} color={"gray.400"} my="auto" fontSize="md">
          {user ? "Logout" : "Login"}
        </Text>
      </Flex>
    </Button>
  );
};

export default LoginButton;
