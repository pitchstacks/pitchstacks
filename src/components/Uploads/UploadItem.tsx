import { Upload } from '@/src/atoms/uploadAtom';
import { Text, Flex, Icon, Stack, Image, Skeleton, Spinner, Alert, AlertDescription, AlertIcon, AlertTitle } from '@chakra-ui/react';
import { async } from '@firebase/util';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';


//icons (change later)
import { AiOutlineDelete } from "react-icons/ai";
import { BiUserCircle } from 'react-icons/bi';
import { BsChat, BsDot } from "react-icons/bs";
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
} from "react-icons/io5";




type UploadItemProps = {
    upload: Upload;
    isUserAdmin: boolean;
    voteValue?: number;
    voteAction: (event: React.MouseEvent<SVGElement, MouseEvent>, upload: Upload, vote: number, trackerId: string ) => void;
    uploadClicked?: (upload: Upload) => void;
    uploadDeleted: (upload: Upload) => Promise<boolean>;
    feedPage?: boolean;
};

const UploadItem:React.FC<UploadItemProps> = ({ upload, isUserAdmin, voteValue, voteAction, uploadClicked, uploadDeleted, feedPage }) => {
    
    const [loadingFile, setLoadingFile] = useState(true);
    const [deleteUploadLoading, setDeleteUploadLoading] = useState(false);
    const [error, setError] = useState(false);
    const onUploadPage = !uploadClicked;
    const router = useRouter();
    const userClickedDelete = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        setDeleteUploadLoading(true);
        try {
            const deleteConfirmed = await uploadDeleted(upload);

            if(!deleteConfirmed) {
                throw new Error("Upload could not be deleted");
            }

            if(onUploadPage) {
                router.push(`/$/${upload.trackerId}`);
            }


        } catch (error: any) {
            setError(error.message);
        }
        setDeleteUploadLoading(false);
    };

    return (
        
        <Flex 
            bg="white" 
            border="1px solid" 
            borderColor={onUploadPage ? "white" : "gray.400"} 
            borderRadius={4}
            _hover={{ borderColor: onUploadPage ? "none" : "gray.500" }}
            cursor={onUploadPage ? "unset" : "pointer"}
            onClick={() => uploadClicked && uploadClicked(upload)}
        >

        
            
            {/*<Flex direction="row" align="center" bg="gray.200" p={2} width="100px">
                <Icon 
                    as={voteValue == 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline}
                    color={voteValue ==1 ? "brand.100" : "gray.400"}
                    fontSize={22}
                    cursor="pointer"
                    onClick={voteAction}
                />
                <Text fontSize="9pt">{upload.totalVotes}</Text>

                <Icon 
                    as={voteValue == -1 ? IoArrowDownCircleSharp : IoArrowDownCircleOutline}
                    color={voteValue == -1 ? "red" : "gray.400"}
                    fontSize={22}
                    cursor="pointer"
                    onClick={voteAction}
                />
                <Text fontSize="9pt">{upload.totalVotes}</Text>


            </Flex>*/}
            

            <Flex direction="column">
                <Stack spacing={1} p="10px">
                    
                    <Stack direction="row" spacing={0.5} align="center" fontSize="9pt">
                    
                        {/* home page check */}
                        {feedPage && (
                            <>
                                {upload.trackerImageURL ? (
                                    <Image src={upload.trackerImageURL} borderRadius="full" boxSize="18px" mr={2} />
                                ) : (
                                    <Icon as={BiUserCircle} fontSize="18pt" mr={2} color="brand.100" />
                                )}
                                <Link href={`/$/${upload.trackerId}`}>
                                    <Text 
                                        fontWeight={700}
                                        _hover={{ textDecoration: "underline" }}
                                        onClick={(event) => event.stopPropagation()} // direct to fund url and back
                                    >
                                        {`@${upload.trackerId}`}
                                    </Text>
                                </Link>
                            </>
                        )}


                        <Text color="gray.500">
                            - uploaded by {upload.creatorDisplayName}{" | "}{moment(new Date(upload.uploadTime?.seconds * 1000)).fromNow()}
                        </Text>
                    </Stack>
                    <Text fontSize="12pt" fontWeight={600}>
                        {upload.title}
                    </Text>
                    <Text fontSize="10pt">
                        {upload.body}
                    </Text>
                    {upload.imageURL && (
                        <Flex justify="center" align="center" p={2}>
                            {loadingFile && (
                                <Skeleton height="300px" width="500px" borderRadius={4} />
                            )}
                            <Image src={upload.imageURL} maxHeight="450px" alt="Upload File" display={loadingFile ? "none" : "unset"} onLoad={() => setLoadingFile(false)} />
                        </Flex>
                    )}
                </Stack>
                <Flex ml={1} mb={1} color="gray.500" fontWeight={300}>
                    <Flex align="center" p="8px 10px">
                        <Text mr={3}>thoughts?</Text>
                        <Icon 
                            as={voteValue == 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline}
                            color={voteValue ==1 ? "brand.100" : "gray.400"}
                            fontSize={22}
                            mr={2}
                            cursor="pointer"
                            onClick={(event) => voteAction(event, upload, 1, upload.trackerId)}
                        />
                        <Text fontSize="9pt">{upload.totalVotes}</Text>

                        <Icon 
                            as={voteValue == -1 ? IoArrowDownCircleSharp : IoArrowDownCircleOutline}
                            color={voteValue == -1 ? "red" : "gray.400"}
                            fontSize={22}
                            ml={3}
                            mr={2}
                            cursor="pointer"
                            onClick={(event) => voteAction(event, upload, -1, upload.trackerId)}
                        />
                        {/*<Text fontSize="9pt">{upload.totalVotes}</Text>*/}

                        
                        <Icon as={BsChat} ml={5} mr={2} />
                        <Text fontSize="9pt">{upload.totalComments}</Text>
                        
                    </Flex>
                    {/* delete func */}
                    {isUserAdmin && 
                        <Flex align="center" p="8px 10px" 
                            _hover={{ bg: "gray.100" }}
                            onClick={userClickedDelete}
                            cursor="pointer"
                            >
                            {deleteUploadLoading ? (
                                <Spinner size="sm" />
                            ): (
                                <>
                                <Icon as={AiOutlineDelete} mr={2} />
                                <Text fontSize="9pt">Delete</Text>
                                </>
                            )}
                        </Flex>
                    }
                    


                </Flex>
                    {error && (
                    <Alert status='error' mt={5} width="100%">
                    <AlertIcon />
                        <AlertDescription>
                            {error}
                        </AlertDescription>
                    </Alert>
            )}
            </Flex>
        </Flex>
    );



}
export default UploadItem;