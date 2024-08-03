import { Box, Button, Flex, Spacer, Avatar } from "@chakra-ui/react";
import { useAuth } from "../firebase/AuthService.jsx";

const Navbar = () => {
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
    <Box bg="teal.500" px={4} py={2}>
      <Flex alignItems="center">
        <Spacer />

        {user && <Avatar name={user.displayName} src={user.photoURL} mr={4} />}

        <Button colorScheme="teal" variant="solid" onClick={handleAuth}>
          {user ? "Logout" : "Login"}
        </Button>
      </Flex>
    </Box>
  );
};

export default Navbar;
