import { authModalState } from '@/src/atoms/authModalAtom';
import { auth } from '@/src/firebase/configApp';
import { useDisclosure, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Flex, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState } from 'recoil';
import AuthInputs from './AuthInputs';
import OAuthBtn from './OAuthBtn';
import ResetPassword from './ResetPassword';


const AuthModal:React.FC = () => {
    
    const [modalState, setModalState] = useRecoilState(authModalState);
    const [user, loading, error] = useAuthState(auth);
    const handleClose = () => {
        setModalState(prev => ({
            ...prev,
            open: false,
        }));
    };

    // closes model when auth is good or page refreshed
    useEffect(() => {
        if(user) handleClose();
        console.log("user", user); // terminal display of user
    }, [user]);

    
    return (
        <>
        <Modal isOpen={modalState.open} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign="center">
                    {modalState.view == 'login' && 'Login'}
                    {modalState.view == 'signup' && 'Create an account'}
                    {modalState.view == 'resetPassword' && 'Reset password'}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody display="flex" flexDirection="column" alignItems="center" justifyContent="center" pb={6}>
                    <Flex direction="column" align="center" justify="center" width="70%">
                        {modalState.view == "login" || modalState.view == "signup" ? (
                            <>
                            <OAuthBtn />
                        <Text>or</Text>
                        <AuthInputs />
                            </>
                        ) : (
                            <ResetPassword />
                        )}
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
        </>
    )
}
export default AuthModal;