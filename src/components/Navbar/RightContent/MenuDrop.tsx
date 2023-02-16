import { ChevronDownIcon } from '@chakra-ui/icons';
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Flex,
    Icon,
    Text,
  } from '@chakra-ui/react'
import { signOut, User } from 'firebase/auth';
import React from 'react';
import { VscAccount } from "react-icons/vsc";
import { auth } from '@/src/firebase/configApp';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '@/src/atoms/authModalAtom';



type MenuDropProps = {
    user?: User | null;
};

const MenuDrop:React.FC<MenuDropProps> = ({ user }) => {
    const setAuthModalState = useSetRecoilState(authModalState);
    const logout = async () => {
        await signOut(auth);
    };
    
    return (
        <Menu>
            <MenuButton cursor="pointer" padding="0px 6px" borderRadius={4} _hover={{ outline: "1px solid", outlineColor:"gray.200" }}>
            <Flex align="center">
                <Flex align="center">
                {user ? (
                            <>
                            
                            <Icon 
                                fontSize={24} 
                                mr={1} 
                                color="gray" 
                                as={VscAccount} 
                            />
                            <Flex
                                display={{ base: "none", lg: "flex" }}
                                direction="column"
                                fontSize="8pt"
                                alignItems="flex-start"
                                ml={1}
                                mr={8}
                                >
                                <Text fontWeight={700}>
                                    {user?.displayName || user?.email?.split("@")[0]}
                                </Text>
                                <Flex alignItems="center">
                                    <Text color="gray.400">PitchStacks BETA v.1.0.0</Text>
                                    {/*<Text color="gray.400">[university name...]</Text>*/}
                                </Flex>
                            </Flex>
                            </>

                )
                : 
                    <Icon fontSize={24} color="gray.400" mr={1} as={VscAccount} />
                }
                </Flex>
                <ChevronDownIcon />
            </Flex>
            </MenuButton>
            <MenuList>
                {user ? (
                    <>
                    <MenuItem fontSize="10pt" fontWeight={700}
                    _hover={{ bg: "blue.300", color: "white" }}>
                    <Flex align="center">
                        {/*<Icon fontSize={15} mr={2} as={CgProfile} />*/}
                        Profile (coming soon)
                    </Flex>
                </MenuItem>{/*
                <MenuItem fontSize="10pt" fontWeight={700}
                    _hover={{ bg: "blue.300", color: "white" }}>
                    <Flex align="center">
                        <Icon fontSize={20} mr={2} as={CgProfile} />
                        item 2
                    </Flex>
                </MenuItem>
                <MenuItem fontSize="10pt" fontWeight={700}
                    _hover={{ bg: "blue.300", color: "white" }}>
                    <Flex align="center">
                        <Icon fontSize={20} mr={2} as={CgProfile} />
                        item 3
                    </Flex>
                </MenuItem>*/}
                <MenuDivider />
                <MenuItem fontSize="10pt" fontWeight={700}
                    _hover={{ bg: "blue.300", color: "white" }}
                    onClick={logout}
                >
                    <Flex align="center">
                        {/*<Icon fontSize={15} mr={2} as={MdOutlineLogin} />*/}
                        Logout
                    </Flex>
                </MenuItem>
                    </>
                ) : (
                    <>
                    <MenuItem fontSize="10pt" fontWeight={700}
                        _hover={{ bg: "blue.300", color: "white" }}
                        onClick={() => setAuthModalState({ open: true, view: "login" })}
                    >
                    <Flex align="center">
                        {/*<Icon fontSize={15} mr={2} as={MdOutlineLogin} />*/}
                        Sign in
                    </Flex>
                    </MenuItem>
                    </>
                )}


            </MenuList>
        </Menu>
    );
};
export default MenuDrop;