/*eslint-disable*/
import React from "react";
import { Flex, Link, List, ListItem, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";

export default function Footer(props) {
  return (
    <Flex
      flexDirection={{
        base: "column",
        xl: "row",
      }}
      alignItems={{
        base: "center",
        xl: "start",
      }}
      justifyContent="space-between"
      px="30px"
      pb="20px"
    >
      <Text
        color="gray.400"
        textAlign={{
          base: "center",
          xl: "start",
        }}
        mb={{ base: "20px", xl: "0px" }}
      >
        &copy; {1900 + new Date().getYear()},{" "}
        <Text as="span">Made with ❤️ by</Text>
        <Link color="teal.400" href="https://www.trymeddy.com" target="_blank">
          Meddy
        </Link>
        &
        <Link color="teal.400" href="https://www.trymeddy.com" target="_blank">
          Meddy
        </Link>
        for a better web
      </Text>
      <List display="flex">
        <ListItem
          me={{
            base: "20px",
            md: "44px",
          }}
        >
          <Link color="gray.400" href="https://www.trymeddy.com">
            trymeddy
          </Link>
        </ListItem>
        <ListItem
          me={{
            base: "20px",
            md: "44px",
          }}
        >
          <Link color="gray.400" href="https://www.trymeddy.com">
            trymeddy
          </Link>
        </ListItem>
        <ListItem
          me={{
            base: "20px",
            md: "44px",
          }}
        >
          <Link color="gray.400" href="https://trymeddy.com/">
            trymeddy
          </Link>
        </ListItem>
        <ListItem>
          <Link color="gray.400" href="https://trymeddy.com/">
            trymeddy
          </Link>
        </ListItem>
      </List>
    </Flex>
  );
}
