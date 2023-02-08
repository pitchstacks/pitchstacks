import { collection, doc, getDoc, getDocs, increment, writeBatch } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { authModalState } from '../atoms/authModalAtom';
import { Tracker, TrackerBits, trackerCurrent } from '../atoms/trackerAtom';
import { auth, firestore } from '../firebase/configApp';


const uploadedTrackerData = () => {
    
    const [user] = useAuthState(auth);
    const [trackerSValue, settrackerSValue] = useRecoilState(trackerCurrent);
    const isAuth = useSetRecoilState(authModalState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    // clicks the main btn
    const onMemInteraction = (trackerData: Tracker, following: boolean) => {
        //user signed in?
            // if not: trigger sign in modal

        // not signed in: onclick->open sign in modal    
        if (!user) {
            isAuth({ open: true, view: "login" });
            return;
        }


        setLoading(true);
        if(following) {
            unfollowTracker(trackerData.id);
            return;
        }
        followTracker(trackerData);
    };


    // return all followed tracker pages
    const getmyTrackers = async () => {
        
        setLoading(true); //waiting for this data to load
        try {
            //return myTrackers
            const trackerDocs = await getDocs(collection(firestore, `/users/${user?.uid}/trackerMemberships`));

            // convert extracted data into objects
            const trackers = trackerDocs.docs.map(doc => ({ ...doc.data() }));
            settrackerSValue(prev => ({
                ...prev,
                myTrackers: trackers as TrackerBits[], // return items as array
                snippetsReturned: true,
            }));

        } catch (error: any) {
            console.log('error detected:', error);
            setError(error.message);
        }
        setLoading(false);
    };



    // follow tracker page
    const followTracker = async (trackerData: Tracker) => {
        // add tracker to tracker collection (firebase)
        // + follow count
        // update state
        try {
            const batch = writeBatch(firestore);
            const newTracker: TrackerBits = {
                trackerId: trackerData.id,
                imageURL: trackerData.imageURL || "",
                canEdit: user?.uid == trackerData.creatorId,
            };

            batch.set(doc(
                firestore, 
                `/users/${user?.uid}/trackerMemberships`, 
                trackerData.id), 
                newTracker
            );

            batch.update(doc(firestore, "trackers", trackerData.id), {
                numberOfMembers: increment(1),
            });

            // execute these writes
            await batch.commit();
            settrackerSValue(prev => ({
                ...prev,
                trackerMemberships: [...prev.myTrackers, newTracker],
            }))


        } catch (error: any) {
            console.log('follow tracker error:', error);
            setError(error.message);
        }

    };

    // unfollow tracker page
    const unfollowTracker = async (trackerId: string) => {
        // remove tracker to tracker collection (firebase)
        // - follow count
        // update state
        try {
            const batch = writeBatch(firestore);

            batch.delete(doc(
                firestore, 
                `/users/${user?.uid}/trackerMemberships`, 
                trackerId
            ));

            batch.update(doc(firestore, "trackers", trackerId), {
                numberOfMembers: increment(-1),
            });


            // execute these writes
            await batch.commit();
            settrackerSValue(prev => ({
                ...prev,
                trackerMemberships: 
                    prev.myTrackers.filter(
                        item => item.trackerId !== trackerId
                ),
            }));



        } catch (error: any) {
            console.log('unfollow tracker error:', error);
            setError(error.message);
        }
        setLoading(false);
    };

    const returnTrackerData = async (trackerId: string) => {
        try {
            
            const trackerDocRef = doc(firestore, "trackers", trackerId);
            const trackerDoc = await getDoc(trackerDocRef);


            settrackerSValue((prev) => ({
                ...prev,
                currentTracker: {
                    id: trackerDoc.id,
                    ...trackerDoc.data(),
                } as Tracker,
            }));

        } catch (error) {
            console.log("error", error);            
        }
    }



    // call the return func
    useEffect(() => {
        if (!user) {
            settrackerSValue(prev => ({
                ...prev,
                myTrackers: [],
                snippetsReturned: false, // update to rebuild feed
            }));
            return;
        };
        getmyTrackers();
    }, [user]);



    useEffect(() => {
        const { trackerId } = router.query;
    
        if (trackerId && !trackerSValue.currentTracker) {
          returnTrackerData(trackerId as string);
        }
      }, [router.query, trackerSValue.currentTracker]);




    return {
        trackerSValue,
        onMemInteraction,
        loading,
    }
}
export default uploadedTrackerData;