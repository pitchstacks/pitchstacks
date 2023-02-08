import { Upload } from '@/src/atoms/uploadAtom';
import { firestore, storage } from '@/src/firebase/configApp';
import selectIMG from '@/src/hooks/selectIMG';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Flex, Icon, TableContainer } from '@chakra-ui/react';
import { async } from '@firebase/util';
import { Readex_Pro } from '@next/font/google';
import { User } from 'firebase/auth';
import { addDoc, collection, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { IoDocumentText, IoImageOutline } from 'react-icons/io5';
import TabNav from './TabNav';
import ImageUpload from './UploadForm/ImageUpload';
import TextInput from './UploadForm/TextInput';

type UploadFormProps = {
    //user?: User | null;
    user: User;
    trackerImageURL?: string;
};

const uploadTabInfo: TabItem[] = [
    {
        title: 'Upload',
        icon: IoDocumentText,
    },
    {
        title: "Image & Video",
        icon: IoImageOutline,
    }
];

export type TabItem = {
    title: string;
    icon: typeof Icon.arguments;
}

const UploadForm: React.FC<UploadFormProps> = ({ user, trackerImageURL }) => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [selectedTabItem, setSelectedTabItem] = useState(uploadTabInfo[0].title);
    const router = useRouter();
    const [textInputs, setTextInputs] = useState({
        title: "",
        body: "",
    });
    const [selectedFile, setSelectedFile] = useState<string>();
    //const { selectedFile, setSelectedFile, userUploadImage,} = selectIMG();



    const userCreateUpload = async () => {

        
        //include file?

        const { trackerId } = router.query;

        //new upload obj
        const newUpload: Upload = {
            trackerId: trackerId as string,
            trackerImageURL: trackerImageURL || "",
            creatorId: user.uid,
            creatorDisplayName: user.email!.split('@')[0],
            title: textInputs.title,
            body: textInputs.body,
            totalComments: 0,
            totalVotes: 0,
            uploadTime: serverTimestamp() as Timestamp,
        };

        //store in backend
        setLoading(true);
        try {
            const uploadDocRef = await addDoc(collection(firestore, "uploads"), newUpload);

            if (selectedFile) {
                const imgRef = ref(storage, `/uploads/${uploadDocRef.id}/image`); //location
                await uploadString(imgRef, selectedFile, "data_url"); // store upload
                const refURL = await getDownloadURL(imgRef);


                // update upload doc
                await updateDoc(uploadDocRef, {
                    imageURL: refURL,
                });


            }
            router.back(); // returns user to prev page


        } catch (error: any) {
            console.log('Upload post error', error.message);
            setError(true);
        }
        setLoading(false);
        
    };


    
    const userUploadImage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const fileRead = new FileReader();

        // only taking one array element
        if(event.target.files?.[0]) {
            fileRead.readAsDataURL(event.target.files[0]);
        }

        // store file in state (appear as preview on page)
        fileRead.onload = (readerEvent) => {
            if (readerEvent.target?.result) {
                setSelectedFile(readerEvent.target.result as string);
            }
        }


    };

    const textChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { target: { name, value }, } = event;
        setTextInputs(prev => ({
            ...prev,
            [name]: value,
        }));
    };
    


    return (
        <Flex direction="column" bg="white" mt={2} borderRadius={5}>
            {/* Tab */}
            <Flex width="100%">
                {uploadTabInfo.map((item) => (
                    <TabNav 
                        key={item.title}
                        item={item} 
                        selected={item.title == selectedTabItem}
                        setSelectedTab={setSelectedTabItem}    
                    />
                ))}
            </Flex>
            <Flex>
                {/* Text input areas */}
                {selectedTabItem == "Upload" && (
                    <TextInput 
                        textInputs={textInputs}
                        userCreateUpload={userCreateUpload}
                        onChange={textChange}
                        loading={loading}
                    />
                )}

                {/* Image upload */}
                {selectedTabItem == "Image & Video" && (
                    <ImageUpload 
                        selectImage={selectedFile} 
                        userUploadImage={userUploadImage} 
                        selectedTabItem={setSelectedTabItem} 
                        setselectImage={setSelectedFile}
                    />
                )}
            </Flex>
            {error && (
                <Alert status='error' mt={5}>
                <AlertIcon />
                <AlertTitle>Error!</AlertTitle>
                <AlertDescription>Upload could not be completed</AlertDescription>
              </Alert>
            )}
        </Flex>
    );
};
export default UploadForm;