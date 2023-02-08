import { Flex, Stack, Text } from "@chakra-ui/react";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";
import { trackerCurrent } from "../atoms/trackerAtom";
import { Upload, UploadVote } from "../atoms/uploadAtom";
import MainContentLayout from "../components/Layout/MainContentLayout"
import CreatePostBtn from "../components/Tracker/CreatePostBtn";
import FirmAccount from "../components/Tracker/FirmAccount";
import TopTrackers from "../components/Tracker/TopTrackers";
import UploadItem from "../components/Uploads/UploadItem";
import UploadLoader from "../components/Uploads/UploadLoader";
import { auth, firestore } from "../firebase/configApp";
import returnUploadList from "../hooks/returnUploads";
import uploadedTrackerData from "../hooks/uploadedTrackerData";

const Home: NextPage = () => {

  const [user, loadingUser] = useAuthState(auth);
  const trackerStateValue = useRecoilValue(trackerCurrent);
  const [loading, setLoading] = useState(false);
  const { uploadValue, setUploadValue, uploadClicked, uploadDeleted, voteAction } = returnUploadList();
  const { trackerSValue } = uploadedTrackerData(); // returns all data -> home page

  
  // Feed: logged in
  const createUserFeed = async () => {

    setLoading(true);
    try {

      // return uploads of followed funds
      if (trackerStateValue.myTrackers.length) {

        // get funds following
        const myTrackersIds = trackerStateValue.myTrackers.map((snippet) => snippet.trackerId);

        const returnQuery = query(
          collection(firestore, "uploads"),
          where("trackerId", "in", myTrackersIds),
          limit(30)
        );

        const uploadDocs = await getDocs(returnQuery);
        const uploads = uploadDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setUploadValue((prev) => ({
          ...prev,
          uploads: uploads as Upload[],
        })); // retrieved and stored in state


      }
      else {
        createNonUserFeed(); // not following anyone
      }


      
    } catch (error) {
      console.log("feed error:", error);
    }
    setLoading(false);
  };




  // FEED: not logged in
  const createNonUserFeed = async () => {
    
    setLoading(true);
    try {

      // feed algorithm (top 10 only) [retunr uploads : order by totalVotes]
      const returnQuery = query(
        collection(firestore, "uploads"), 
        orderBy("totalVotes", "desc"), 
        limit(10) // # of upoads shown
      );

      const uploadDocs = await getDocs(returnQuery);
      const uploads = uploadDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      setUploadValue((prev) => ({
        ...prev,
        uploads: uploads as Upload[],
      })); // retrieved and stored in state

    } catch (error) {
      console.log("feed error", error);
    }

    setLoading(false);

  };
  
  



  // show vote values in feed
  const returnUploadVotes = async () => {

    try {

      const uploadIds = uploadValue.uploads.map((upload) => upload.id);
      const votesQuery = query(collection(firestore, `/users/${user?.uid}/votes`), where("uploadId", "in", uploadIds));

      const voteDocs = await getDocs(votesQuery);
      const uploadVotes = voteDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setUploadValue((prev) => ({
        ...prev,
        uploadVotes: uploadVotes as UploadVote[],
      }));
      
    } catch (error) {
      console.log("error", error);
    }

  };
  
  
  
  // loggedin feed
  useEffect(() => {
     if (trackerStateValue.snippetsReturned) createUserFeed();
  }, [trackerStateValue.snippetsReturned]) // must see if users follow trackers
  
  // loggedout feed
  useEffect(() => {
    if (!user && !loadingUser) createNonUserFeed();
  }, [user, loadingUser]); // user will be null before fetched, can still be returned from hook
  
  //voted return
  useEffect(() => {
    if (user && uploadValue.uploads.length) returnUploadVotes();
    return () => {
      setUploadValue((prev) => ({
        ...prev,
        uploadVotes: [],
      }))
    };
  }, [user, uploadValue.uploads])


  
  
  return (
    <MainContentLayout>
      <>
        <CreatePostBtn />
        {loading ? (
          <UploadLoader />
        ) : (
          <Stack>
            {uploadValue.uploads.map((upload) => (
              <UploadItem
                key={upload.id}
                upload={upload}
                uploadClicked={uploadClicked}
                uploadDeleted={uploadDeleted}
                voteAction={voteAction}
                voteValue={uploadValue.uploadVotes.find((item) => item.uploadId == upload.id)?.voteNumber}
                isUserAdmin={user?.uid == upload.creatorId}
                feedPage
              />
            ))}
          </Stack>
        )}
      </>
      <>
        <TopTrackers />
        <FirmAccount />
      </>
    </MainContentLayout>
  );
};

export default Home;

function returnTrackerData() {
  throw new Error("Function not implemented.");
}
