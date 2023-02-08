import { authModalState } from '@/src/atoms/authModalAtom';
import { Button, Flex, Input, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase/configApp'
import { FIREBASE_ERRORS } from '@/src/firebase/error';

type LoginProps = {
    
};

const Login:React.FC<LoginProps> = () => {
    
    const setAuthModalState = useSetRecoilState(authModalState);
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
    });

    // firebase user creation (e & p) signin hook
    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
      ] = useSignInWithEmailAndPassword(auth);

    // parse data to backend databse
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // don't refresh onSubmit (form)

        signInWithEmailAndPassword(loginForm.email, loginForm.password);
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        //updated form state 
        setLoginForm(prev => ({
            ...prev,
            [event.target.name]: event.target.value,
        }))
    };

    return (
        <form onSubmit={onSubmit}>
            <Input 
                required
                name="email" 
                placeholder="email" 
                type="email" 
                mb={2}
                onChange={onChange} 
                fontSize="10pt"
                _placeholder={{ color: "gray.500" }}
                _hover={{
                    bg: "white",
                    border: "1px solid",
                    borderColor: "blue.500",
                }}
                _focus={{
                    outline: "none",
                    bg: "white",
                    border: "1px solid",
                    borderColor: "blue.500",
                }}
                bg="gray.50"
            />
            <Input 
                required
                name="password" 
                placeholder="password" 
                type="password" 
                mb={2}
                onChange={onChange} 
                fontSize="10pt"
                _placeholder={{ color: "gray.500" }}
                _hover={{
                    bg: "white",
                    border: "1px solid",
                    borderColor: "blue.500",
                }}
                _focus={{
                    outline: "none",
                    bg: "white",
                    border: "1px solid",
                    borderColor: "blue.500",
                }}
                bg="gray.50"
            />
            {/* error message */}
            <Text textAlign="center" color="red.600" fontSize="8pt">
                {FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}
            </Text>
            {/* sign in btn */}
            <Button width="100%" height="35px" mt={2} mb={2} type="submit" isLoading={loading}>Log in</Button>
            {/* reset password btn */}
            <Flex justifyContent="center" mb={4} mt={3}>
                <Text fontSize="9pt" mr={1}>
                    Forgot your password?
                </Text>
                <Text
                    fontSize="9pt"
                    color="blue.500"
                    cursor="pointer"
                    onClick={() => setAuthModalState((prev) => ({
                        ...prev,
                        view: "resetPassword",
                    }))
                }
                >
                    Reset
                </Text>

            </Flex>
            <Flex fontSize="9pt" justifyContent="center">
                <Text mr={1}>Need an account?</Text>
                <Text 
                    color="blue.500" 
                    fontWeight={500} 
                    cursor="pointer" 
                    onClick={() => 
                        setAuthModalState((prev) => ({
                            ...prev,
                            view: "signup",
                    }))
                }
                >Sign up</Text>
            </Flex>
        </form>
    );
};
export default Login;