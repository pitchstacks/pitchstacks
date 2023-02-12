import { Tracker } from '@/src/atoms/trackerAtom';
import { firestore } from '@/src/firebase/configApp';
import uploadedTrackerData from '@/src/hooks/uploadedTrackerData';
import { Box, Button, Flex, Icon, Image, Skeleton, Stack, Text } from '@chakra-ui/react';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { AiOutlineFund } from 'react-icons/ai';



const TopTrackers: React.FC = () => {


    const [trackers, setTrackers] = useState<Tracker[]>([]);
    const [loading, setLoading] = useState(false);
    const { trackerSValue, onMemInteraction } = uploadedTrackerData();


    const getTopTrackers = async () => {
        
        setLoading(true);

        try {

            const returnQuery = query(
                collection(firestore, "trackers"), 
                orderBy("numberOfMembers", "desc"), 
                limit(20) // [TOP ## PAGES]
            );

            const trackerDocs = await getDocs(returnQuery);
            const trackers = trackerDocs.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setTrackers(trackers as Tracker[]);


        } catch (error) {
            console.log("top trackers error", error);
        }
        setLoading(false);
    }




    useEffect(() => {
        getTopTrackers();
    }, []);


    
    return (
        <Flex direction="column" bg="white" borderRadius={2} border="1px solid" borderColor="gray.400" >
            <Flex 
                align="flex-end"
                bg="gray.50"
                color="gray.600"
                p="12px 20px"
                height="50px"
                borderRadius="4px 4px 0px 0px"
                fontWeight={700}
                backgroundSize="cover"
                //bgGradient="linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.1))"
            >
                Find your fund...
            </Flex>
            <Flex direction="column">
                {loading ? (
                    <Stack>
                        <Skeleton height='40px' />
                        <Skeleton height='40px' />
                        <Skeleton height='40px' />
                        <Skeleton height='40px' />
                        <Skeleton height='40px' />
                        <Skeleton height='40px' />
                        <Skeleton height='40px' />
                        <Skeleton height='40px' />
                        <Skeleton height='40px' />
                    </Stack>
                ) : (
                    <>
                        {trackers.map((item, index) => {
                            const following = !!trackerSValue.myTrackers.find(
                                (tracker) => tracker.trackerId == item.id);

                            return (
                                <Link key={item.id} href={`/$/${item.id}`}>
                                    <Flex 
                                        position="relative" 
                                        align="center" 
                                        fontSize="10pt" 
                                        borderBottom="1px solid" 
                                        borderColor="gray.200" 
                                        p="10px 12px" 
                                        _hover={{ bg: "gray.100" }}
                                    >
                                        <Flex width="7%">
                                            <Text>{index +1}.</Text>
                                        </Flex>
                                        <Flex align="center" width="75%">
                                            {item.imageURL ? (
                                                <Image src={item.imageURL} borderRadius="full" boxSize="22px" mr={2} />
                                            ) : (
                                                <Icon as={AiOutlineFund} fontSize={30} color="brand.100" mr={2} />
                                            )}
                                            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                {`@${item.id}`}
                                            </span>
                                        </Flex>
                                        <Box position="absolute" right="10px">
                                        <Button height="20px" fontSize="8pt" variant={following ? "outline" : "solid"}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                onMemInteraction(item, following);
                                            }}
                                        >
                                                {following ? "Following" : "Follow"}
                                        </Button>
                                    </Box>
                                    </Flex>
                                </Link>
                            );
                        })}
                        {/*
                        <Box p="10px 20px">
                            <Button height="30px" width="100%">
                                View all funds
                            </Button>
                        </Box>
                        */}
                    </>
                )}

            </Flex>
        </Flex>
    );
}
export default TopTrackers;