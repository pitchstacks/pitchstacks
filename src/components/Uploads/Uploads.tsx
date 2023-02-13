import { Tracker } from '@/src/atoms/trackerAtom';
import { Upload } from '@/src/atoms/uploadAtom';
import { auth, firestore } from '@/src/firebase/configApp';
import { Stack } from '@chakra-ui/react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import ReturnUploadList from "../../hooks/ReturnUploadList"
import UploadItem from './UploadItem';
import UploadLoader from './UploadLoader';

type UploadsProps = {
    trackerData: Tracker;
};

const Uploads:React.FC<UploadsProps> = ({ trackerData }) => {
    
    const [user] = useAuthState(auth);
    const [loading, setLoading] = useState(false);
    const { uploadValue, setUploadValue, voteAction, uploadClicked, uploadDeleted } = ReturnUploadList();

    const returnUploads = async () => {
        try {
            setLoading(true);
            const uploadQ = query(collection(firestore, "uploads"), 
                where("trackerId", "==", trackerData.id),
                orderBy("uploadTime", "desc")
            );

            const uploadDocs = await getDocs(uploadQ);
            const uploads = uploadDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            setUploadValue(prev => ({
                ...prev,
                uploads: uploads as Upload[],
            }));

            //console.log("click here:", uploads); // logs uploads returned

        } catch (error: any) {
            console.log("return uploads in tracker page:", error.message);
        }
        setLoading(false);

    };


    useEffect(() => {
        returnUploads();
    }, [trackerData]);



    return (
        <>
        {loading ? (<UploadLoader />) : (
            <Stack>
                {uploadValue.uploads.map((item) => (
                    <UploadItem 
                        key={item.id}
                        upload={item}
                        isUserAdmin={user?.uid == item.creatorId}
                        voteValue={
                            uploadValue.uploadVotes.find((vote) => vote.uploadId == item.id)?.voteNumber
                        }
                        voteAction={voteAction}
                        uploadClicked={uploadClicked}
                        uploadDeleted={uploadDeleted}
                    />
                ))}
            </Stack>
        )}
        
        </>
    );
}
export default Uploads;