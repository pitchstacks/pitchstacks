import { SearchIcon } from '@chakra-ui/icons';
import { Flex, Input, InputGroup, InputLeftAddon, InputLeftElement, InputRightAddon, InputRightElement } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import React from 'react';
import { isWhiteSpaceLike } from 'typescript';

type SearchBarProps = {
    user?: User | null;
    
};

const SearchBar:React.FC<SearchBarProps> = ({ user }) => {
    
    return (
        <Flex flexGrow={1} maxWidth={user ? "auto" : "600px"} mr={2} align="center">
            <InputGroup>
                <InputLeftElement
                    pointerEvents='none'
                    children={<SearchIcon color='gray.400' />}
                />
                <Input 
                    placeholder='Find your friends' 
                    fontSize="10pt" 
                    _placeholder={{ color: "grey.500" }} 
                    _hover={{
                        bg: "white",
                        border: "1px solid",
                        bordercolor: "blue.500",
                    }}
                    _focus={{
                        outline: "none",
                        border: "1px solid",
                        bordercolor: "blue.500",
                    }}
                    height="40px"
                    bg="gray.50"
                    
                />
            </InputGroup>
        </Flex>
    );
}
export default SearchBar;