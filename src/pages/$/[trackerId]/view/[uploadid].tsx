import { Upload } from '@/src/atoms/uploadAtom';
import MainContentLayout from '@/src/components/Layout/MainContentLayout';
import Info from '@/src/components/Tracker/Info';
import Comments from '@/src/components/Uploads/Comments/Comments';
import UploadItem from '@/src/components/Uploads/UploadItem';
import { auth, firestore } from '@/src/firebase/configApp';
import returnUploadList from '@/src/hooks/ReturnUploads';
import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';



const UploadPage:React.FC = () => {

    const [user] = useAuthState(auth);
    const { uploadValue, setUploadValue, voteAction, uploadClicked, uploadDeleted } = returnUploadList();
    const router = useRouter();



    const returnUpload = async (uploadId: string) => {
        try {

            const uploadDocRef = doc(firestore, "uploads", uploadId);
            const uploadDoc = await getDoc(uploadDocRef);

            setUploadValue(prev => ({
                ...prev,
                selectedUpload: { id: uploadDoc.id, ...uploadDoc.data() } as Upload,
            }));

            
        } catch (error) {
            console.log('error:', error);
        }
    };

    useEffect(() => {
        const { uploadid } = router.query;

        if(uploadid && !uploadValue.selectedUpload) {
            returnUpload(uploadid as string);
        }


    }, [router.query, uploadValue.selectedUpload]);
    
    return (
        <MainContentLayout>
            <>
                {uploadValue.selectedUpload && (
                <UploadItem upload={uploadValue.selectedUpload} voteAction={voteAction} uploadDeleted={uploadDeleted} voteValue={uploadValue.uploadVotes.find(item => item.uploadId == uploadValue.selectedUpload?.id)?.voteNumber} 
                    isUserAdmin={user?.uid == uploadValue.selectedUpload?.creatorId}
                />)}
                <Comments 
                    user={user as User} 
                    selectedUpload={uploadValue.selectedUpload} 
                    trackerId={uploadValue.selectedUpload?.trackerId as string} 
                />
            </>
            <>
                {/* side info */}
                {/*<Info trackerData={} />*/}
                
            </>
        </MainContentLayout>
    );
};
export default UploadPage;