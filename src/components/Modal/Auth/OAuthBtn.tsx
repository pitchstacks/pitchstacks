import { Flex, Button, Image, Text } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../../../firebase/configApp'


const OAuthBtn:React.FC = () => {
    
    // firebase user creation (google sign in) hook
    const [
        signInWithGoogle,
        userCred,
        loading,
        error,
      ] = useSignInWithGoogle(auth);


      const createUserDoc = async (user: User) => {
        const userDocR = doc(firestore, "users", user.uid);
        await setDoc(userDocR, JSON.parse(JSON.stringify(user)));
    };

    useEffect(() => {
        if(userCred) {
            createUserDoc(userCred.user);
        }
    }, [userCred]);

    

    return (
        <Flex direction="column" width="100%" mb={4}>
            <Button 
                variant="oauth" 
                mb={2} 
                isLoading={loading} 
                onClick={() => signInWithGoogle()}>
                    {/*<Image 
                        src="images/google.png"
                        height="20px"
                        mr={4}
                    />*/}
                    Continue with Google
            </Button>
            {error && <Text>{error.message}</Text>}
        </Flex>
    );
}
export default OAuthBtn;