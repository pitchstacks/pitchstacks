import ClickDirectory from '@/src/hooks/ClickDirectory';
import { Flex, Icon, Image, MenuItem } from '@chakra-ui/react';
import React from 'react';
import { IconType } from 'react-icons';

type ListDirectoryProps = {
    textShown: string;
    link: string;
    icon: IconType;
    iconColor: string;
    imageURL?: string;
};

const ListDirectory:React.FC<ListDirectoryProps> = ({ textShown, link, icon, iconColor, imageURL }) => {
    

    const { clickedMenuItem } = ClickDirectory();

    return (
        <MenuItem width="100%" fontSize="10pt"
            _hover={{ bg: "gray.100" }}
            onClick={() => clickedMenuItem({ textShown, link, icon, iconColor, imageURL })}> {/* link -> tracker page */}
                <Flex align="center">
                    {imageURL ? (
                        <Image src={imageURL} borderRadius="full" boxSize="16px" mr={2} />
                    ) : (
                        <Icon as={icon} fontSize={15} mr={2} color={iconColor} />
                    )}{textShown}
                    
                </Flex>
        </MenuItem>
    );
}
export default ListDirectory;