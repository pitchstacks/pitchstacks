import { trackerCurrent } from '@/src/atoms/trackerAtom';
import MainContentLayout from '@/src/components/Layout/MainContentLayout';
import UploadForm from '@/src/components/Uploads/UploadForm';
import { auth } from '@/src/firebase/configApp';
import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilValue } from 'recoil';



const UploadPost: React.FC = () => {

    const [user] = useAuthState(auth);
    const setTrackerStateView = useRecoilValue(trackerCurrent);
    
    return (
        <MainContentLayout>
            <>
                <Box p="20px 0px">
                    <Text>Create upload</Text>
                </Box>
            {user && <UploadForm user={user} trackerImageURL={setTrackerStateView.currentTracker?.imageURL} />}
            </>
            <>
            {/* about tracker info */}
            </>
        </MainContentLayout>
    );
};
export default UploadPost;