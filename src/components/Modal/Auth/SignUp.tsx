import { authModalState } from '@/src/atoms/authModalAtom';
import { Button, Flex, Input, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../../../firebase/configApp'
import { FIREBASE_ERRORS } from '../../../firebase/error'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';


const SignUp:React.FC = () => {
    
    const setAuthModalState = useSetRecoilState(authModalState);
    const [signUpForm, setSignUpForm] = useState({
        email: "",
        //fund: "",
        //linkedin: "",
        password: "",
        confirmPassword: "",
    });

    // error
    const[error, setError] = useState('');

    // firebase user creation (e & p) signup hook
    const [
        createUserWithEmailAndPassword,
        userCred,
        loading,
        userError,
      ] = useCreateUserWithEmailAndPassword(auth);


    // parse data to backend databse
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // don't refresh onSubmit (form)
        if (error) setError(''); // reset error each submission
        //password match?
        if(signUpForm.password != signUpForm.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        createUserWithEmailAndPassword(signUpForm.email, signUpForm.password);
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        //updated form state 
        setSignUpForm(prev => ({
            ...prev,
            [event.target.name]: event.target.value,
        }))
    };


    const createUserDoc = async (user: User) => {
        await setDoc(doc(firestore, "users"), JSON.parse(JSON.stringify(user)));
    };

    useEffect(() => {
        if(userCred) {
            createUserDoc(userCred.user);
        }
    }, [userCred]);


    return (
        <form onSubmit={onSubmit}>
            <Input 
                required
                name="email" 
                placeholder="Email" 
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


            {/* sc hool dropdown */}





            <Input 
                required
                //name="fund" 
                placeholder="Name of Investment Fund" 
                type="text" 
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
                //name="linkedin" 
                placeholder="https://www.linkedin.com/in/"
                type="text" 
                mb={2}
                onChange={onChange} 
                fontSize="8pt"
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
                placeholder="Password" 
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
            <Input 
                required
                name="confirmPassword" 
                placeholder="Confirm Password" 
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
            {(error || userError) &&(
                <Text textAlign="center" color="red.600" fontSize="8pt">
                    {error || FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]}
                </Text>
            )}
            <Button width="100%" height="35px" mt={2} mb={2} type="submit" isLoading={loading}>
                Sign up
            </Button>
            <Flex textAlign="center">
                <Text fontSize="9pt" justifyContent="center" mt={2} mb={4}>
                    By clicking Sign up, you agree to our Privacy Policy, Terms of Service, and User Agreement.
                </Text>
            </Flex>
            <Flex fontSize="9pt" justifyContent="center" mb={3} mt={3}>
                <Text mr={1}>Have an account?</Text>
                <Text 
                    color="brand.200" 
                    fontWeight={500} 
                    cursor="pointer" 
                    onClick={() => 
                        setAuthModalState((prev) => ({
                            ...prev,
                            view: "login",
                    }))
                }
                >
                    Log in
                </Text>
            </Flex>
        </form>
    );
}
export default SignUp;