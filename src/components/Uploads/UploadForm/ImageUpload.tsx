import { Button, Flex, Image, Stack, Text } from '@chakra-ui/react';
import React, { useRef } from 'react';

type ImageUploadProps = {
    selectImage?: string; // optional
    userUploadImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
    selectedTabItem: (value: string) => void;
    setselectImage: (value: string) => void;
};

const ImageUpload:React.FC<ImageUploadProps> = ({ 
    selectImage, userUploadImage, selectedTabItem, setselectImage
    }) => {

    // select file hook
    const selectImageFile = useRef<HTMLInputElement>(null);
    
    return (
        <Flex justify="center" align="center" direction="column" mt={10} width="100%">

            {selectImage ? (
                <>
                    <Image src={selectImage} maxWidth="400px" maxHeight="400px" />
                    <Stack direction="row" mt={10} mb={10}>
                        
                        <Button
                            height="25px"
                            variant="outline"
                            onClick={() => setselectImage("")}
                        >
                            Remove
                        </Button>

                        <Button
                            height="25px"
                            onClick={() => selectedTabItem("Upload")}
                        >
                            Review upload
                        </Button>
                        
                    </Stack>
                </>
            ) : (
            <Flex justify="center" align="center" p={20} mb={10} border="1px dashed" borderColor="gray.100" width="100%" borderRadius={5}>
                <Button
                    variant="outline"
                    height="25px"
                    onClick={() => selectImageFile.current?.click()}
                >
                    Select Image
                </Button>
                <input 
                    ref={selectImageFile} 
                    type="file" 
                    hidden
                    onChange={userUploadImage} 
                />
                
                {/* display selected file */}
                <img src={selectImage} />

            </Flex>
            )}

        </Flex>
    );
}
export default ImageUpload;