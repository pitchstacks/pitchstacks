import { Tracker, trackerCurrent } from '@/src/atoms/trackerAtom';
import { auth, firestore, storage } from '@/src/firebase/configApp';
import SelectIMG from '@/src/hooks/SelectIMG';
import { Box, Button, Divider, Flex, Stack, Text, Image, Icon, Spinner } from '@chakra-ui/react';
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useSetRecoilState } from 'recoil';

type InfoProps = {
    trackerData: Tracker;
};

const Info:React.FC<InfoProps> = ({ trackerData }) => {
    
    //const router = useRouter();
    const [user] = useAuthState(auth);
    const selectProfilePicRef = useRef<HTMLInputElement>(null);
    const { selectedFile, setSelectedFile, userUploadImage } = SelectIMG();
    const [changingImage, setChangingImage] = useState(false);
    const trackerStateValue = useSetRecoilState(trackerCurrent);


    // change profile pic func
    const clickedUpdateImage = async () => {
        if(!selectedFile) return; // if no file
        setChangingImage(true);
        try {
            const imageRef = ref(storage, `/trackers/${trackerData.id}/image`);
            await uploadString(imageRef, selectedFile, "data_url");

            const accessURL = await getDownloadURL(imageRef);

            // update backend
            await updateDoc(doc(firestore, "trackers", trackerData.id), {
                imageURL: accessURL,
            });

            trackerStateValue((prev) => ({
                ...prev,
                currentTracker: {
                    ...prev.currentTracker,
                    imageURL: accessURL,
                } as Tracker,
            }));


        } catch (error) {
            console.log("Editing pic error:", error);
        }
        setChangingImage(false);
    };




    return (

        <Box>
            <Flex
                justify="space-between"
                align="center"
                bg="#3366ff"
                color="white"
                p={3}
                borderRadius="4px 4px 4px 4px"
            >
                <Text fontSize="10pt" fontWeight={700}>
                    Upload to @{trackerData.id}
                </Text>
            </Flex>
            <Flex 
                direction="row"
                p={3}
                bg="white"
                borderRadius="0px 0px 4px 4px"
            >
                <Stack>
                    <Flex width="100%" p={2} align="center" fontSize="10pt">
                        <Flex direction="row" flexGrow={1}>
                            <Link href={`/$/${trackerData.id}/upload`}>
                                <Button variant="outline" width="230px">
                                    Create new upload
                                </Button>
                            </Link>
                        </Flex>
                    </Flex>

                    {/* admin edit func */}
                    {user?.uid == trackerData.creatorId && (
                        <>
                        <Divider />
                        <Stack spacing={3} fontSize="10pt">
                            <Text fontWeight={600}>Edit page as creator</Text>
                            <Flex align="center" justify="space-between">
                                <Text 
                                    color="brand.100"
                                    cursor="pointer"
                                    _hover={{ textDecoration: "underline" }}
                                    onClick={() => selectProfilePicRef.current?.click()}
                                
                                >
                                    Change page profile
                                </Text>
                                {trackerData.imageURL || selectedFile ? (
                                    <Image src={selectedFile || trackerData.imageURL}
                                        borderRadius="full"
                                        boxSize="40px"
                                        alt="Profile Pic"
                                    />
                                ) : (
                                    <Image src="/images/icon_white_background.png"
                                    draggable="false"
                                    borderRadius="full"
                                    boxSize="40px"
                                    alt="Profile Pic"
                            />
                                )}
                            </Flex>
                            {selectedFile && (
                                changingImage ? <Spinner /> :
                                <Text cursor="pointer" onClick={clickedUpdateImage}>
                                    Save
                                </Text>
                            )}
                            <input 
                                id="file-upload"
                                type="file" 
                                accept="image/x-png, image/gif, image/jpeg"
                                hidden
                                ref={selectProfilePicRef}
                                onChange={userUploadImage}
                            />
                        </Stack>
                        </>
                    )};

                </Stack>
            </Flex>
        </Box>

    );
}
export default Info;