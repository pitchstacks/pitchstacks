import React from "react";
import { Flex, Button } from "@chakra-ui/react";
import Link from "next/link";

const PageNotFound: React.FC = () => {
  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
    >
      Beep boop, this page does not exist or has been deleted
      <Link href="/">
        {/* customize btn */}
        <Button variant="outline" mt={6}>Return home</Button>
      </Link>
    </Flex>
  );
};
export default PageNotFound;