import { auth } from '@/src/firebase/configApp';
import { Button, Flex } from '@chakra-ui/react';
import { signOut, User } from 'firebase/auth';
import React from 'react';
import AuthModal from '../../Modal/Auth/AuthModal';
import AuthButtons from './AuthButtons';
import MenuDrop from './MenuDrop';
import NavIcons from './NavIcons';

type RightContentProps = {
    user?: User | null;
};

const RightContent:React.FC<RightContentProps> = ({ user }) => {
    
    return (
        <>
        <AuthModal />
        <Flex justify="center" align="center">
            {/*<Button onClick={() => signOut(auth)}>Logout</Button>*/}
            
            
            {/* user loggdin = show icons | not logged in = auth btns */}
            {user ? (
                <NavIcons />
            ) : (<AuthButtons />
            )}
            <MenuDrop user={user} />
        </Flex>
        </>
    );
};
export default RightContent;