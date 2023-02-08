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
      borderColor="gray.300"
      mt={5}
    >
      <Flex mb={4}>
        <Icon as={TiBusinessCard} fontSize={26} color="brand.100" mt={2} />
        <Stack spacing={1} fontSize="9pt" pl={4}>
          <Text fontWeight={600}>Apply for firm account</Text>
          <Text>Intergrate our data into your firm's investment research process</Text>
        </Stack>
      </Flex>
      <Link href="https://airtable.com/shrYrfN9ngDpi4aso" target="_blank">
        <Button height="30px" width="100%" bg="brand.100" _hover={{ textDecoration: "none" }}>
            See options
        </Button>
      </Link>
    </Flex>
  );
};
export default FirmAccount;