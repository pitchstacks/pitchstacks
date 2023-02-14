import { Upload } from '@/src/atoms/uploadAtom';
import { firestore, storage } from '@/src/firebase/configApp';
import SelectIMG from '@/src/hooks/SelectIMG';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Flex, Icon, TableContainer } from '@chakra-ui/react';
import { async } from '@firebase/util';
import { Readex_Pro } from '@next/font/google';
import { User } from 'firebase/auth';
import { addDoc, collection, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { BsCardText } from 'react-icons/bs';
import { IoDocumentText } from 'react-icons/io5';
import TabNav from './TabNav';
import ImageUpload from './UploadForm/ImageUpload';
import PdfUpload from './UploadForm/PdfUpload';
import TextInput from './UploadForm/TextInput';
import UploadItem from './UploadItem';

type UploadFormProps = {
    //user?: User | null;
    user: User;
    trackerImageURL?: string;
    trackerPDFURL?: string;
    trackerId: string;
};

const uploadTabInfo: TabItem[] = [
    {
        title: 'Info',
        icon: BsCardText,
    },
    {
        title: "Add PDF",
        icon: IoDocumentText,
    },
    {
        title: "Add File",
        icon: IoDocumentText,
    }
];

export type TabItem = {
    title: string;
    icon: typeof Icon.arguments;
}

const UploadForm: React.FC<UploadFormProps> = ({ user, trackerImageURL, trackerPDFURL }) => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [selectedTabItem, setSelectedTabItem] = useState(uploadTabInfo[0].title);
    const router = useRouter();
    const [textInputs, setTextInputs] = useState({
        title: "",
        body: "",
        ticker: "",
        type: "",
    });
    const [selectedFile, setSelectedFile] = useState<string>();
    const [selectedPDF, setSelectedPDF] = useState<string>();
    

    const userCreateUpload = async () => {

        
        //include file?

        const { trackerId } = router.query;
        const { title, body, ticker } = textInputs;

        

        //store in backend
        setLoading(true);
        try {


            
            {/*
            const newUpload: Upload = {
                //id: uploadDocRef.id, // big change
                trackerId: trackerId as string,
                trackerImageURL: trackerImageURL || "",
                trackerPDFURL: trackerPDFURL || "",
                creatorId: user.uid,
                creatorDisplayName: user.email!.split('@')[0],
                title: textInputs.title,
                body: textInputs.body,
                ticker: textInputs.ticker,
                type: textInputs.type,
                totalComments: 0,
                totalVotes: 0,
                uploadTime: serverTimestamp() as Timestamp,
            };

            const uploadDocRef = await addDoc(collection(firestore, "uploads"), newUpload);
        */}

        const uploadDocRef = await addDoc(collection(firestore, "uploads"), {
            id: uploadDocRef.id, // big change
            trackerId: trackerId as string,
            trackerImageURL: trackerImageURL || "",
            trackerPDFURL: trackerPDFURL || "",
            creatorId: user.uid,
            creatorDisplayName: user.email!.split('@')[0],
            title: textInputs.title,
            body: textInputs.body,
            ticker: textInputs.ticker,
            type: textInputs.type,
            totalComments: 0,
            totalVotes: 0,
            uploadTime: serverTimestamp() as Timestamp,
        });



            console.log("HERE IS NEW POST ID", uploadDocRef.id);





            if (selectedFile) {
                const imgRef = ref(storage, `/uploads/${uploadDocRef.id}/image`); //location
                await uploadString(imgRef, selectedFile, "data_url"); // store upload
                const refURL = await getDownloadURL(imgRef);


                // update upload doc
                await updateDoc(uploadDocRef, {
                    imageURL: refURL,
                });


            }

            if (selectedPDF) {
                const pdfRef = ref(storage, `/uploads/${uploadDocRef.id}/image`); //location
                await uploadString(pdfRef, selectedPDF, "data_url"); // store upload
                const refURL = await getDownloadURL(pdfRef);


                // update upload doc
                await updateDoc(uploadDocRef, {
                    pdfURL: refURL,
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


    {/* pdf userUploadPDF */}
    const userUploadPDF = (
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
                setSelectedPDF(readerEvent.target.result as string);
            }
        }


    };





    const textChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
                {selectedTabItem == "Info" && (
                    <TextInput 
                        textInputs={textInputs}
                        userCreateUpload={userCreateUpload}
                        onChange={textChange}
                        loading={loading}
                    />
                )}

                {/* PDF upload */}
                {selectedTabItem == "Add PDF" && (
                    <PdfUpload 
                        selectPDF={selectedPDF} 
                        userUploadPDF={userUploadPDF} 
                        selectedTabItem={setSelectedTabItem} 
                        setselectPDF={setSelectedPDF}
                    />
                )}

                {/* Image upload */}
                {selectedTabItem == "Add File" && (
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