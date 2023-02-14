import { defaultItem } from '@/src/atoms/menuAtom';
import { auth } from '@/src/firebase/configApp';
import ClickDirectory from '@/src/hooks/ClickDirectory';
import { Flex, Image } from '@chakra-ui/react';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import Directory from './Directory/Directory';
import RightContent from './RightContent/RightContent';
import SearchBar from './SearchBar';

const Navbar:React.FC = () => {

    const [user, loading, error] = useAuthState(auth);
    const { clickedMenuItem } = ClickDirectory();
    
    return (
        <Flex bg="white" height="50px" padding="0px 75px" 
            justify={{ md: "space-between" }}>
            {/* PitchStacks logos */}
            <Flex 
                align="center" 
                mr={3}
                onClick={() => clickedMenuItem(defaultItem)}
                cursor="pointer"
            >
                
                <Image src='/images/pitchstacks_h_logo.png' draggable="false" height="50px" display={{ base: "none", md: "unset" }}/>
                <Image src='/images/icon_white_background.png' draggable="false" height="45px" paddingTop="1" display={{ base: "unset", md: "none" }}/>
                
            </Flex>
            <SearchBar user={user} /> {/* search bar */}
            {user && <Directory />} {/* drop down */}
            <RightContent user={user} /> {/* icons + profile drop down */}
        </Flex>
    );
}
export default Navbar;