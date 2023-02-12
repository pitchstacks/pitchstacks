import { Upload } from '@/src/atoms/uploadAtom';
import { Text, Flex, Icon, Stack, Image, Skeleton, Spinner, Alert, AlertDescription, AlertIcon, AlertTitle, Button } from '@chakra-ui/react';
import { async } from '@firebase/util';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

//icons (change later)
import { AiOutlineDelete } from "react-icons/ai";
import { BiUserCircle, BiWorld } from 'react-icons/bi';
import { BsChat, BsDot } from "react-icons/bs";
import { IoArrowDownCircleOutline, IoArrowDownCircleSharp, IoArrowUpCircleOutline, IoArrowUpCircleSharp } from "react-icons/io5";

//pdf imports (react pdf viewer)
import { Viewer } from '@react-pdf-viewer/core';
import { Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';



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
    

    const [modal, setModal] = useState(false); //pdf modal


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
            borderRadius={10}
            _hover={{ borderColor: onUploadPage ? "none" : "gray.500" }}
            cursor={onUploadPage ? "unset" : "pointer"}
            onClick={() => uploadClicked && uploadClicked(upload)}
        >    

            <Flex direction="column">
                <Stack spacing={1} p="10px">
                    
                    <Stack direction="row" spacing={0.5} align="center" fontSize="9pt">
                    
                        {/* home page check */}
                        
                        {feedPage && (
                            <>
                                
                                {/*{upload.trackerImageURL ? (
                                    <Image src={upload.trackerImageURL} borderRadius="full" boxSize="18px" mr={2} />
                                ) : (
                                    <Icon as={BiUserCircle} fontSize="18pt" mr={2} color="brand.100" />
                                )}*/}
                                <Link href={`/$/${upload.trackerId}`}>
                                    <Text
                                        fontWeight={700}
                                        _hover={{ color: "brand.200" }}
                                        onClick={(event) => event.stopPropagation()} // direct to fund url and back
                                    >
                                        {`@${upload.trackerId}`}
                                    </Text>
                                </Link>
                            </>
                        )}
                    

                        <Text 
                            color="gray.500"
                        >
                            &nbsp; {upload.creatorDisplayName}{" | "}{moment(new Date(upload.uploadTime?.seconds * 1000)).fromNow()}{" "}<Icon as={BiWorld} />
                        </Text>
                    </Stack>
                    <Flex 
                        //backgroundColor="gray.100" 
                        //borderRadius="4px 4px 0px 0px"
                    >
                        <Text 
                            fontSize="14pt" 
                            fontWeight={600} 
                            pl={2}
                        >
                            {upload.title}
                        </Text>
                    </Flex>

                    <Text fontSize="10pt" pl={2} pb={2}>
                        {upload.ticker} | {upload.type} | [industry]
                    </Text>


                    <Text fontSize="10pt" pl={2}>
                        {upload.body}
                    </Text>


                    


                    {/* IMAGE VIEW */}
                    {upload.imageURL && (
                        <Flex justify="center" align="center" p={2}>
                            {loadingFile && (
                                <Skeleton height="300px" width="500px" borderRadius={4} />
                            )}
                            <Image src={upload.imageURL} draggable="false" maxHeight="450px" alt="Upload File" display={loadingFile ? "none" : "unset"} onLoad={() => setLoadingFile(false)} />
                        </Flex>
                    )}



                    {/* FILE VIEW */}
                    {/* file open btn */}
                    {upload.pdfURL && (

                            
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.3.122/build/pdf.worker.min.js">
                        
                            <Viewer fileUrl={upload.pdfURL} />
                        
                        </Worker>

                        
                        
                    )}


                    
                    







                </Stack>
                <Flex ml={1} mb={1} color="gray.500" fontWeight={300}>
                    <Flex align="center" p="8px 10px">
                        <Text mr={3} fontSize="9pt" fontWeight={400}></Text>
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
                            color={voteValue == -1 ? "gray" : "gray.400"}
                            fontSize={22}
                            ml={3}
                            mr={2}
                            cursor="pointer"
                            onClick={(event) => voteAction(event, upload, -1, upload.trackerId)}
                        />
                        {/*<Text fontSize="9pt">{upload.totalVotes}</Text>*/}

                        
                        <Icon as={BsChat} ml={5} mr={2} />
                        <Text fontSize="9pt">{upload.totalComments} comments</Text>
                        
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