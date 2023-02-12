import { auth, firestore } from '@/src/firebase/configApp';
import clickDirectory from '@/src/hooks/clickDirectory';
import { Text, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Box, Input, Stack, Checkbox, Flex, Icon } from '@chakra-ui/react';
import { doc, getDoc, runTransaction, serverTimestamp, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
// icons
import { BsFillPersonFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi";

type CreateTrackerModalProps = {
    open: boolean;
    closecreate: () => void;
    userId: string;
};

const CreateTrackerModal:React.FC<CreateTrackerModalProps> = ({ open, closecreate }) => {
    
    const [trackerName, setTrackerName] = useState('');
    const [user] = useAuthState(auth);
    const [wCount, setWCount] = useState(30);
    const [trackerType, setTrackerType] = useState('public');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { makeMenuOpen } = clickDirectory();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // count we have left
        if(event.target.value.length > 30) return;
        setTrackerName(event.target.value);
        setWCount(30 - event.target.value.length);
    };

    const onTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTrackerType(event.target.name);
    };

    // FUNC route to backend
    const handleCreate = async () => {
        // character check
        if(error) setError("");
        var format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/; // charcters not allowed
        if (trackerName.length < 3) {
            setError("Must be at least 3 charcters");
            return;
        }
        if (format.test(trackerName)) {
            setError("Cannot contain any special charcters");
            return;
        }

        setLoading(true);

        try {
            const trackerStorageRef = doc(firestore, 'trackers', trackerName);
            
            // if one transaction fails, all creation funcs fail too
            await runTransaction(firestore, async (transaction) => {
                
                const trackerStorage = await transaction.get(trackerStorageRef);
                
                // duplicate name error
                if(trackerStorage.exists()) {
                    throw new Error("This name is taken, try another name")
                }

                // name is valid - create in firestore
                // Initial "Tracker" info
                transaction.set(trackerStorageRef, {
                    creatorId: user?.uid,
                    createdAt: serverTimestamp(),
                    numberOfMembers: 1,
                    accountType: trackerType,

                });


                // creat with the user's doc items
                // location in firestore database
                transaction.set(doc(firestore, `users/${user?.uid}/trackerMemberships`, trackerName), {
                    trackerId: trackerName,
                    canEdit: true, // is the user a mod?
                });

            });

            closecreate(); // close modal
            makeMenuOpen(); // close dropdown
            router.push(`/$/${trackerName}`); // newly created tracker page
            
            
            
        } catch (error: any) {
            console.log('handleChange error:', error);
            setError(error.message);
        }


        
        setLoading(false);
    };

    return (
        <>
          <Modal isOpen={open} onClose={closecreate} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader display="flex" flexDirection="column" fontSize={15} padding={3}>
                    Create Fund / Tracker
                </ModalHeader>
                
                <Box pl={3} pr={3}>
                    <ModalCloseButton />
                    <ModalBody display="flex" flexDirection="column" padding="10px 0px">
                        <Text fontWeight={500} fontSize={15}>
                            Add your fund or tracker
                        </Text>
                        <Text fontSize={12} color="gray.500">
                            This username <b>cannot</b> be changed after it is created
                        </Text>
                        <Text 
                            position="relative" 
                            top="28px" 
                            left="5px" 
                            width="20px"
                            color="gray.500"
                            >$/</Text>
                        <Input 
                            value={trackerName}
                            position="relative"
                            placeholder="your_fund"
                            size="sm"
                            pl="22px"
                            onChange={handleChange}
                        />
                        <Text textAlign="right" pt={1} fontSize="9pt" color={wCount == 0 ? "red.500" : "gray.500"}>
                            {wCount}
                        </Text>
                        <Text fontSize="9pt" color="red" pt={1} pb={3}>
                            {error}
                        </Text>
                        <Text pb={3} fontSize="10pt" color="gray.500">
                            wwww.pitchstacks.com/$/{trackerName}
                        </Text>
                        <Box>
                            <Text fontWeight={500} fontSize={15} mt={2} mb={2}>
                                Status (will be implemented later):
                            </Text>
                            <Stack spacing={2}>
                                <Checkbox 
                                    name="public" 
                                    isChecked={trackerType == "public"} 
                                    onChange={onTypeChange}>
                                        <Flex align="center">
                                            <Icon as={BsFillPersonFill} mr={1} />
                                            <Text fontSize="10pt" mr={1}>Open</Text>
                                            <Text fontSize="8pt" color="gray.500" pt={1}>Any user can upload to or view</Text>
                                        </Flex>
                                </Checkbox>
                                <Checkbox 
                                    name="limited" 
                                    isChecked={trackerType == "limited"} 
                                    onChange={onTypeChange}>
                                        <Flex align="center">
                                            <Icon as={HiLockClosed} mr={1} />
                                            <Text fontSize="10pt" mr={1}>Limited</Text>
                                            <Text fontSize="8pt" color="gray.500" pt={1}>Any user can view but must be approved to upload</Text>
                                        </Flex>
                                </Checkbox>
                                <Checkbox 
                                    name="private" 
                                    isChecked={trackerType == "private"} 
                                    onChange={onTypeChange}>
                                        <Flex align="center">
                                            <Icon as={HiLockClosed} mr={1} />
                                            <Text fontSize="10pt" mr={1}>Private</Text>
                                            <Text fontSize="8pt" color="gray.500" pt={1}>Must be approved to upload to or view</Text>
                                        </Flex>
                                </Checkbox>
                            </Stack>
                        </Box>
                    </ModalBody>
                </Box>
              <ModalFooter bg="gray.50" borderRadius="0px 0px 10px 10px" mt={5}>
                <Button variant="outline" height="25px" mr={3} onClick={closecreate}>
                    Cancel
                </Button>
                <Button 
                    height="25px" 
                    onClick={handleCreate} 
                    isLoading={loading}
                    color="white"
                    backgroundColor="brand.100"
                    _hover={{ backgroundColor: "brand.200" }}
                >
                        Create Page
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      );
};
export default CreateTrackerModal;