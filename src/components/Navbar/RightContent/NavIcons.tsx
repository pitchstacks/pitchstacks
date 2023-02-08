//import { Flex } from '@chakra-ui/react';
import React from 'react';
///add icon imports here!!!!!!!!!!!!
import { AddIcon } from "@chakra-ui/icons";
import { Box, Flex, Icon } from "@chakra-ui/react";
import { BsArrowUpRightCircle, BsChatDots } from "react-icons/bs";
import { GrAdd } from "react-icons/gr";
import {
  IoFilterCircleOutline,
  IoNotificationsOutline,
  IoVideocamOutline,
} from "react-icons/io5";


const NavIcons:React.FC = () => {
    
    return (
        <Flex alignItems="center" flexGrow={1}>
      <Box
        display={{ base: "none", md: "flex" }}
        alignItems="center"
        borderRight="1px solid"
        borderColor="gray.200"
      >
        
        
      </Box>
      <>
     
        
        <Flex
          display={{ base: "none", md: "flex" }}
          mr={3}
          ml={1.5}
          padding={1}
          cursor="pointer"
          borderRadius={4}
          _hover={{ bg: "gray.200" }}
          //onClick={toggleMenuOpen}
        >
          <Icon as={GrAdd} fontSize={20} />
        </Flex>
      </>
    </Flex>
        
    );
};
export default NavIcons;