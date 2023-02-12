import React from "react";
import { Flex, Icon, Text, Stack, Button, Link } from "@chakra-ui/react";
import { TiBusinessCard } from "react-icons/ti";

const FirmAccount: React.FC = () => {
  return (
    <Flex
      direction="column"
      bg="white"
      borderRadius={4}
      cursor="pointer"
      p="12px"
      border="1px solid"
      borderColor="gray.400"
      mt={5}
    >
      <Flex mb={4}>
        <Icon as={TiBusinessCard} fontSize={26} color="brand.100" mt={2} />
        <Stack spacing={1} fontSize="9pt" pl={4} pt={2}>
          <Text fontWeight={600}>
            Apply for firm account
          </Text>
          <Text>
            {`Intergrate our data into your firm's investment research process`}
          </Text>
        </Stack>
      </Flex>
      <Link 
        href="https://airtable.com/shrYrfN9ngDpi4aso" 
        target="_blank" 
        _hover={{ textDecoration: "none" }}
      >
        <Button 
          height="30px" 
          width="100%" 
          variant="outline" 
          _hover={{ textDecoration: "none", color: "brand.200", borderColor: "brand.200" }}
        >
            See options
        </Button>
      </Link>
    </Flex>
  );
};
export default FirmAccount;