import ClickDirectory from '@/src/hooks/ClickDirectory';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
    Flex, Icon, Menu,
    MenuButton,
    MenuList,
    Text,
    Image
} from '@chakra-ui/react';
import React from 'react';
import Trackers from './Trackers';


const MenuDrop:React.FC = () => {

    const { directoryState, makeMenuOpen } = ClickDirectory();
    
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
                        <Image src={directoryState.clickedMenuItem.imageURL} borderRadius="full" boxSize="10" mr={2} />
                    ) : (
                    
                        <Image src={directoryState.clickedMenuItem.imageURL} borderRadius="full" boxSize="10" mr={2} />
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