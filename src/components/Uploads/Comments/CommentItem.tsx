import { Box, Flex, Icon, Spinner, Stack, Text } from '@chakra-ui/react';
import { Timestamp } from 'firebase/firestore';
import moment from 'moment';
import React from 'react';
import { BiUserCircle } from "react-icons/bi";
import { BsDot } from 'react-icons/bs';
import { cursorTo } from 'readline';


export type Comment = {
    id: string;
    createdBy: string;
    createdByText: string;
    trackerId: string;
    uploadId: string;
    title: string;
    text: string;
    uploadTime: Timestamp;
}


type CommentItemProps = {
    comment: Comment;
    userDeleteComment: (comment: Comment) => void;
    isDeleting: boolean;
    userId: string;
};

const CommentItem:React.FC<CommentItemProps> = ({ comment, userDeleteComment, isDeleting, userId }) => {
    
    return (
        <Flex>
            <Box mr={3}>
                {/*<Icon as={BiUserCircle} fontSize={30} color="gray.300" />*/}
            </Box>
            <Stack spacing={1}>
                <Stack direction="row" align="center" fontSize="10pt">
                    <Text fontWeight={700}>{comment.createdByText}</Text>
                    <Text color="gray.400">
                        {moment(new Date(comment.uploadTime.seconds * 1000)).fromNow()}
                    </Text>
                    {userId == comment.createdBy && (
                        <>
                        <Icon as={BsDot} />
                        <Text 
                            fontSize="8pt"
                            _hover={{ color: "blue.500", cursor: "pointer" }} 
                            onClick={() => userDeleteComment(comment)}
                        >
                            Delete your reply
                        </Text>
                        </>
                    )}
                    {isDeleting && <Spinner size="sm" />}
                </Stack>
                <Text fontSize={13}>{comment.text}</Text>
                {/*<Stack direction="row" align="center" cursor="pointer" color="gray.500">
                    delete btn
                </Stack>*/}
            </Stack>
        </Flex>
    );
}
export default CommentItem;