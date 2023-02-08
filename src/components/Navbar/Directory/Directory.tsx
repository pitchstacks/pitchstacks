import clickDirectory from '@/src/hooks/clickDirectory';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
    Flex, Icon, Menu,
    MenuButton,
    MenuList,
    Text,
    Image
} from '@chakra-ui/react';
import React from 'react';
import { AiOutlineStock } from 'react-icons/ai';
import Trackers from './Trackers';


const MenuDrop:React.FC = () => {

    const { directoryState, makeMenuOpen } = clickDirectory();
    
    return (
        <Menu isOpen={directoryState.open}>
            <MenuButton 
                cursor="pointer"
                 padding="0px 6px" 
                 borderRadius={4} 
                 _hover={{ outline: "1px solid", outlineColor:"gray.200" }}
                onClick={makeMenuOpen}
            >
            <Flex align="center" justify="space-between">
                <Flex align="center">


                    {directoryState.clickedMenuItem.imageURL ? (
                        <Image src={directoryState.clickedMenuItem.imageURL} borderRadius="full" boxSize="24" mr={2} />
                    ) : (
                        <Icon fontSize={24} mr={{ base: 1, md: 2 }} as={directoryState.clickedMenuItem.icon} color={directoryState.clickedMenuItem.iconColor} />
                    )}

                    
                    <Flex display={{ base: "none", lg: "flex" }}>
                        <Text fontWeight={600}>
                            {directoryState.clickedMenuItem.textShown}
                        </Text>
                    </Flex>
                </Flex>
                <ChevronDownIcon />
            </Flex>
            </MenuButton>
            <MenuList>
                <Trackers />
            </MenuList>
        </Menu>
    );
};
export default MenuDrop;