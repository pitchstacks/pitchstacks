import React, { useState } from 'react';

const selectIMG = () => {

    const [selectedFile, setSelectedFile] = useState<string>();

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


    
    return {
        selectedFile, setSelectedFile, userUploadImage,
    };
};
export default selectIMG;