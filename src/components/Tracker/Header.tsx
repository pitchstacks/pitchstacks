import { Tracker } from '../../atoms/trackerAtom';
import React from 'react';
import { Box, Button, Flex, Icon, Image, Text } from '@chakra-ui/react';
import UploadedTrackerData from '../../hooks/UploadedTrackerData';
import { RiFundsLine } from "react-icons/ri";


type HeaderProps = {
    trackerData: Tracker;
};

const Header:React.FC<HeaderProps> = ({ trackerData }) => {
    
    const {trackerSValue, onMemInteraction, loading } = UploadedTrackerData();
    //const following = false; //default
    const following = !!trackerSValue.myTrackers.find(item => item.trackerId == trackerData.id);

    return (
        <Flex direction="column" width="100%" height="150px">
            <Box height="40%" bg="gray.100" />
            <Flex justify="center" bg="gray.100" flexGrow={1}>
                <Flex width="95%" maxWidth="860px">
                    {trackerSValue.currentTracker?.imageURL ? (
                        <Image 
                            src={trackerSValue.currentTracker?.imageURL} 
                            //borderRadius="full"
                            borderRadius={7}
                            border="2px solid white"
                            boxSize="66px"
                            alt="Profile Image"
                            position="relative"
                            background="white"
                            top={-3}
                        />
                    ) : (
                    <Icon 
                        fontSize={70} 
                        position="relative" 
                        top={-5}
                        border="1px solid gray"
                        backgroundColor="white"
                        borderRadius="50%"
                        as={RiFundsLine}
                        />
                    )}

                    <Flex padding="10px 15px" mr={12}>
                        <Flex direction="column" mr={6}>
                            <Text fontWeight={700} fontSize="14pt">
                                @{trackerData.id}
                            </Text>
                            {/*<Text fontWeight={700} fontSize="10pt" color="gray.400">
                                {trackerData.accountType} page
                                [type] page
                            </Text>*/}
                            {/*
                            <Text fontWeight={700} fontSize="10pt" color="blue.400">
                                ### followers
                            </Text>
                            */}
                        </Flex>
                    </Flex>

                    <Button 
                        variant={following ? 'outline' : 'solid'} 
                        height="30px" 
                        pr={6} pl={6} mt={2} 
                        isLoading={loading}
                        onClick={() => onMemInteraction(trackerData, following)}>
                        {following ? 'Following' : 'Follow'}
                    </Button>

                </Flex>


            </Flex>
             
            
        </Flex>
    );
}
export default Header;