import { Box, Flex, Icon, MenuItem, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import CreateTrackerModal from '../../Modal/CreateTracker/CreateTrackerModal';
import { GrAdd } from "react-icons/gr";
import { RiFundsBoxLine } from "react-icons/ri"
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/src/firebase/configApp';
import { useRecoilValue } from 'recoil';
import { trackerCurrent } from '@/src/atoms/trackerAtom';
import ListDirectory from './ListDirectory';


type TrackersProps = {
    
};

const Trackers:React.FC<TrackersProps> = () => {
    
    const [open, setOpen] = useState(false);
    const [user] = useAuthState(auth);
    const myTrackers = useRecoilValue(trackerCurrent).myTrackers;


    return (
        <>
            <CreateTrackerModal open={open} closecreate={() => setOpen(false)} userId={user?.uid!} />
            

            <Box mt={3} mb={4}>
                <Text pl={3} mb={1} fontSize="10pt" fontWeight={500} color="gray.400">
                    Created:
                </Text>
                
                    {myTrackers.filter((snippet) => snippet.canEdit).map((snippet) => (
                        <ListDirectory key={snippet.trackerId} icon={RiFundsBoxLine} textShown={`@${snippet.trackerId}`} link={`/$/${snippet.trackerId}`} imageURL={snippet.imageURL} iconColor="brand.100" />
                    ))}
                <MenuItem 
                    width="100%" 
                    _hover={{ bg: "gray.100" }}
                    onClick={() => setOpen(true)}
                    >
                    <Flex align="center" fontSize={15}>
                        <Icon fontSize={15} mr={2} as={GrAdd} />
                        Create New
                    </Flex>
                </MenuItem>
            </Box>

            <Box mt={3} mb={4}>
                <Text pl={3} mb={1} fontSize="10pt" fontWeight={500} color="gray.400">
                    Following:
                </Text>
                
                    {myTrackers.map((snippet) => (
                        <ListDirectory key={snippet.trackerId} icon={RiFundsBoxLine} textShown={`@${snippet.trackerId}`} link={`/$/${snippet.trackerId}`} imageURL={snippet.imageURL} iconColor="blue.300" />
                    ))}
                
            </Box>
        </>
    );
}
export default Trackers;