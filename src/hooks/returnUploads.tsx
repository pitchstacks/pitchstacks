import { collection, deleteDoc, doc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Upload, uploadState } from '../atoms/uploadAtom';
import { auth, firestore, storage } from '../firebase/configApp';
import { UploadVote } from '../atoms/uploadAtom';
import { trackerCurrent } from '../atoms/trackerAtom';
import { authModalState } from '../atoms/authModalAtom';
import { useRouter } from 'next/router';



const returnUploadList = () => {

    const [user] = useAuthState(auth);
    const router = useRouter();
    const [uploadValue, setUploadValue] = useRecoilState(uploadState);
    const currentTracker = useRecoilValue(trackerCurrent).currentTracker;
    const modalState = useSetRecoilState(authModalState);
    
    // func: controls user voting actions
    const voteAction = async (event: React.MouseEvent<SVGElement, MouseEvent>, upload: Upload, vote: number, trackerId: string ) => {
        event.stopPropagation();
        // user auth
        if (!user?.uid) {
            modalState({ open: true, view: "login" });
        }

        try {

            const { totalVotes } = upload;
            const isVoteMade = uploadValue.uploadVotes.find(
                (vote) => vote.uploadId == upload.id
            );

            const batch = writeBatch(firestore);
            const updatedUpload = { ...upload };
            const updatedUploads = [...uploadValue.uploads];
            let updatedUploadVotes = [...uploadValue.uploadVotes];
            let voteValueChange = vote;
            

            if (!isVoteMade) {
                const uploadVoteRef = doc(collection(firestore, "users", `/${user?.uid}/votes`));
            
                const newVote: UploadVote = {
                    id: uploadVoteRef.id,
                    uploadId: upload.id!,
                    trackerId,
                    voteNumber: vote, // 1, -1 incremental values
                };

                batch.set(uploadVoteRef, newVote);
                
                updatedUpload.totalVotes = totalVotes + vote;
                updatedUploadVotes = [...updatedUploadVotes, newVote];
            
            }
            else {

                // might be where the vote error is occuring (path)

                const uploadVoteRef = doc(firestore, "users", `/${user?.uid}/votes/${isVoteMade.id}`);

                // user removing vote
                if (isVoteMade.voteNumber == vote) {
                    updatedUpload.totalVotes = totalVotes - vote;
                    updatedUploadVotes = updatedUploadVotes.filter(vote => vote.id !== isVoteMade.id);
                
                    // remove vote
                    batch.delete(uploadVoteRef);
                    voteValueChange *=1;
                    
                }
                // user chnages existing vote
                else {

                    updatedUpload.totalVotes = totalVotes + 2 * vote;

                    const voteNewVal = uploadValue.uploadVotes.findIndex(
                        (vote) => vote.id == isVoteMade.id
                    );

                    updatedUploadVotes[voteNewVal] = {
                        ...isVoteMade,
                        voteNumber: vote,
                    };

                    batch.update(uploadVoteRef, {
                        voteNumber: vote,
                    });

                    voteValueChange = 2 * vote;
    
                }
            }

            // update backend

            const voteNewVal = uploadValue.uploads.findIndex(item => item.id == upload.id);
            updatedUploads[voteNewVal] = updatedUpload;

            setUploadValue((prev) => ({
                ...prev,
                uploads: updatedUploads,
                uploadVotes: updatedUploadVotes,
            }));

            if(uploadValue.selectedUpload) {
                setUploadValue(prev => ({
                    ...prev,
                    selectedUpload: updatedUpload,
                }))
            };


            const uploadRef = doc(firestore, "uploads", upload.id!);
            batch.update(uploadRef, { totalVotes: totalVotes + voteValueChange });

            await batch.commit(); // write to firebase


        } catch (error) {
            console.log("voting error:", error);
        }
    };


    // func: user clicks on post
    const uploadClicked = async (upload: Upload) => {
        setUploadValue((prev) => ({
            ...prev,
            selectedUpload: upload,
        }));
        router.push(`/$/${upload.trackerId}/view/${upload.id}`);
    };


    // func: user clicks delete 
    const uploadDeleted = async (upload: Upload): Promise<boolean> => {

        try {
           
            if(upload.imageURL) {
                const imgRef = ref(storage, `/uploads/${upload.id}/image`);
                await deleteObject(imgRef);
            }


            const uploadDocR = doc(firestore, "uploads", upload.id!);
            await deleteDoc(uploadDocR);


            setUploadValue(prev => ({
                ...prev,
                uploads: prev.uploads.filter(item => item.id !== upload.id),
            }));



            
            return true;
        } catch (error) {
            return false;
        }


        return true;
    };

    const returnTrackerUploadVote = async (trackerId: string) => {
        const voteQuery = query(
            collection(firestore, "users", `/${user?.uid}/votes`), where("trackerId", "==", trackerId));
    
        const uploadVoteDocs = await getDocs(voteQuery);
        const uploadVotes = uploadVoteDocs.docs.map(doc => ({ id: doc.id, ...doc.data(), }));

        setUploadValue((prev) => ({
            ...prev,
            uploadVotes: uploadVotes as UploadVote[],
        }));
    
    };


    useEffect(() => {
        if (!user || !currentTracker?.id) return;
        returnTrackerUploadVote(currentTracker?.id);
    }, [user, currentTracker]);

    
    // user loggedin?
    useEffect(() => {
        if (!user) {
            setUploadValue((prev) => ({
                ...prev,
                uploadVotes: [],
            }));
        }
    }, [user]);



    return {
        uploadValue,
        setUploadValue,
        voteAction,
        uploadClicked,
        uploadDeleted,
    };
};
export default returnUploadList;