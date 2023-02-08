import { Upload, uploadState } from '@/src/atoms/uploadAtom';
import { firestore } from '@/src/firebase/configApp';
import { Box, Flex, SkeletonCircle, SkeletonText, Stack, Text } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import { collection, doc, getDocs, increment, orderBy, query, serverTimestamp, Timestamp, where, writeBatch } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import Input from './Input';
import CommentItem, { Comment } from './CommentItem';

type CommentsProps = {
    user: User;
    selectedUpload: Upload | null;
    trackerId: string;
};



const Comments:React.FC<CommentsProps> = ({ user, selectedUpload, trackerId }) => {

    const [commentText, setCommentText] = useState(""); // ind. comments
    const [comments, setComments] = useState<Comment[]>([]); // array of returned comments
    const [returnLoading, setReturnLoading] = useState(true);
    const [startLoading, setStartLoading] = useState(false);
    const [deleteId, setDeleteId] = useState("");
    const setUploadState = useSetRecoilState(uploadState);



    // create comment -> backend
    const userCreateComment = async (commentText: string) => {
        setStartLoading(true);
        
        try {
            const batch = writeBatch(firestore);
            const commentRef = doc(collection(firestore, "comments")); // create new doc

            const newCommentCreated: Comment = {
                id: commentRef.id,
                createdBy: user.uid,
                createdByText: user.email!.split("@")[0],
                trackerId,
                uploadId: selectedUpload?.id!,
                title: selectedUpload?.title!,
                text: commentText,
                uploadTime: serverTimestamp() as Timestamp,
            };

            batch.set(commentRef, newCommentCreated); // set in backend
            newCommentCreated.uploadTime = { seconds: Date.now() / 1000 } as Timestamp;


            // # of comments update (as string)
            const uploadRef = doc(firestore, "uploads", selectedUpload?.id!);
            batch.update(uploadRef, {
                totalComments: increment(1),
            });

            await batch.commit(); // process done


            setCommentText("");
            setComments((prev) => [newCommentCreated, ...prev]);
            setUploadState((prev) => ({
                ...prev,
                selectedUpload: {
                    ...prev.selectedUpload,
                    totalComments: prev.selectedUpload?.totalComments! + 1, 
                } as Upload,
            }));


            

        } catch (error) {
            console.log("comment creation error:", error);
        }
        setStartLoading(false);
        
    };

    
    
    
    // delete comment
    const userDeleteComment = async (comment: Comment) => {
        setDeleteId(comment.id);
        try {

            const batch = writeBatch(firestore);

            const commentRef = doc(firestore, "comments", comment.id);
            batch.delete(commentRef); // delete from backend

            // rremove comment #
            const uploadRef = doc(firestore, "uploads", selectedUpload?.id!);
            batch.update(uploadRef, {
                totalComments: increment(-1)
            });

            await batch.commit(); // update backend

            setUploadState((prev) => ({
                ...prev,
                selectedUpload: {
                    ...prev.selectedUpload,
                    totalComments: prev.selectedUpload?.totalComments! - 1, 
                } as Upload,
            }));

            setComments((prev) => prev.filter((item) => item.id !== comment.id));

            

        } catch (error) {
            console.log("delete comment error:", error);
        }
    
        setDeleteId("");
    
    };





    // gets the array of comments
    const returnComments = async () => {
        try {
            const commentsReturn = query(
                collection(firestore, "comments"), 
                where("uploadId", "==", selectedUpload?.id),
                orderBy("uploadTime", "desc")
            );

            const commentDocs = await getDocs(commentsReturn);
            const comments = commentDocs.docs.map(doc => ({ id: doc.id, ...doc.data(), }));

            setComments(comments as Comment[]);


        } catch (error) {
            console.log("return comments:", error);
        }
        setReturnLoading(false); // comments loading done
    };


    useEffect(() => {
        if (!selectedUpload) return;
        returnComments();
    }, [selectedUpload]);


    return (
        <Box bg="white" borderRadius="0px 0px 4px 4px" p={2}>
            <Flex direction="column" pl={10} pr={4} mb={6} fontSize="10pt" width="100%">
                {!returnLoading && (
                    <Input commentText={commentText} setCommentText={setCommentText} user={user} startLoading={startLoading} userCreateComment={userCreateComment} />
                )}
            </Flex>
            <Stack spacing={5} p={2}>


                {returnLoading ? (
                    <>
                        <Box p={3} pt={4}>
                            <SkeletonCircle size="10" />
                            <SkeletonText mt="4" noOfLines={2} spacing="4" />
                            <SkeletonCircle size="10" mt={4} />
                            <SkeletonText mt="4" noOfLines={2} spacing="4" />
                            <SkeletonCircle size="10" mt={4} />
                            <SkeletonText mt="4" noOfLines={2} spacing="4" />
                            <SkeletonCircle size="10" mt={4} />
                            <SkeletonText mt="4" noOfLines={2} spacing="4" />
                        </Box>
                    </>
                ) : (
                    <>
                        {comments.length == 0 ? (
                            <Flex 
                                direction="column"
                                justify="center"
                                align="center"
                                p={30}
                            >
                                <Text fontWeight={500} opacity={0.5}>
                                    👋 Be the first to reply to this upload
                                </Text>
                            </Flex>
                        ) : (
                            <>
                            {comments.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                userDeleteComment={userDeleteComment}
                                isDeleting={deleteId == comment.id}
                                userId={user.uid}
                            />
                ))}
                            </>
                        )}
                    </>
                )}

                


            </Stack>
        </Box>
    );
};
export default Comments;