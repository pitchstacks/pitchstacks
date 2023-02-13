import { authModalState } from '@/src/atoms/authModalAtom';
import { auth } from '@/src/firebase/configApp';
import ClickDirectory from '@/src/hooks/ClickDirectory';
import { Flex, Icon, Input, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BsLink45Deg } from 'react-icons/bs';
import { IoImageOutline } from 'react-icons/io5';
import { RiFundsBoxLine } from 'react-icons/ri';
import { useSetRecoilState } from 'recoil';



const CreatePostBtn: React.FC = () => {
    
    const router = useRouter();
    const [user] = useAuthState(auth);
    const setLoginModal = useSetRecoilState(authModalState);
    const { makeMenuOpen } = ClickDirectory();


    // links user to /upload page
    const onClick = () => {
        if(!user) {
            setLoginModal({ open: true, view: "signup" });
            return;
        }
        const { trackerId } = router.query;

        if(trackerId) {
          router.push(`/$/${trackerId}/upload`);
          return;
        }

        makeMenuOpen();
    };


  return (
    <Flex
      justify="space-evenly"
      align="center"
      bg="white"
      height="56px"
      borderRadius={4}
      border="1px solid"
      borderColor="gray.400"
      p={2}
      mb={4}
    >
      {/*<Icon as={RiFundsBoxLine} fontSize={36} color="gray.300" mr={4} />*/}
      <Input
        placeholder="Welcome to PitchStacks (click here to get started)"
        fontSize="10pt"
        cursor="pointer"
        _placeholder={{ color: "gray.500" }}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "brand.100",
        }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        bg="gray.50"
        borderColor="gray.200"
        height="36px"
        borderRadius={4}
        mr={4}
        onClick={onClick}
      />
      
      {/*
      <Icon
        as={IoImageOutline}
        fontSize={24}
        mr={4}
        color="gray.400"
        cursor="pointer"
        onClick={onClick}
      />
      <Icon as={BsLink45Deg} fontSize={24} color="gray.400" cursor="pointer" onClick={onClick} />
      */}

    </Flex>
  );
};



export default CreatePostBtn;