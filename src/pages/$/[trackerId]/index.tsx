import { Tracker } from '@/src/atoms/trackerAtom';
import { uploadState } from '@/src/atoms/uploadAtom';
import MainContentLayout from '@/src/components/Layout/MainContentLayout';
import CreatePostBtn from '@/src/components/Tracker/CreatePostBtn';
import Header from '@/src/components/Tracker/Header';
import Info from '@/src/components/Tracker/Info';
import PageNotFound from '@/src/components/Tracker/PageNotFound';
import Uploads from '@/src/components/Uploads/Uploads';
import { auth, firestore } from '@/src/firebase/configApp';
import { doc, getDoc } from 'firebase/firestore';
import { GetServerSidePropsContext } from 'next';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useSetRecoilState } from 'recoil';
import safeJsonStringify from 'safe-json-stringify';

type TrackerPageProps = {
    trackerData: Tracker;
};

const TrackerPage: React.FC<TrackerPageProps> = ({ trackerData }) => {
    
    const [user, loadingUser] = useAuthState(auth);
    const setTrackerView = useSetRecoilState(uploadState);
    
    //tracker page url does not exist:
    if (!trackerData) {
        return <PageNotFound />;
    }

    //after data renders
    useEffect(() => {
        setTrackerView((prev) => ({
            ...prev,
            currentTracker: trackerData,
        }));
    }, [trackerData]);

    //tracker page url exists:
    return (
        <>
            {/* components of the tracker page */}
            <Header trackerData={trackerData} />
            <MainContentLayout>
                <>
                    {/*<CreatePostBtn />*/} {/* link -> upload page */}
                    <Uploads trackerData={trackerData} /> {/* list of uploads */}
                </>
                <>
                    <Info trackerData={trackerData} />
                </>
            </MainContentLayout>
        </>
    );
};


// MOST IMPORTANT FUNC (getServerSideProps)
// server side rendering page content data
export async function getServerSideProps(context: GetServerSidePropsContext) {
    // get page data --> to client
    try {
        const trackerDocR = doc(firestore, "trackers", context.query.trackerId as string);
        const trackerDoc = await getDoc(trackerDocR);
        return {
            props: {
                trackerData: trackerDoc.exists() 
                    ? JSON.parse(
                        safeJsonStringify({ id: trackerDoc.id, ...trackerDoc.data() })
                    )
                    : "",
            },
        };


    } catch (error) {
        // add error page [here]
        console.log('error:', error);
    };
};



export default TrackerPage;