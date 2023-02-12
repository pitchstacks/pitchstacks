import { Button, Flex, Image, Stack, Text } from '@chakra-ui/react';
import React, { useRef } from 'react';

type PdfUploadProps = {
    selectPDF?: string; // optional
    userUploadPDF: (event: React.ChangeEvent<HTMLInputElement>) => void;
    selectedTabItem: (value: string) => void;
    setselectPDF: (value: string) => void;
};

const PdfUpload:React.FC<PdfUploadProps> = ({ 
    selectPDF, userUploadPDF, selectedTabItem, setselectPDF
    }) => {

    // select file hook
    const selectImageFile = useRef<HTMLInputElement>(null);
    
    return (
        <Flex justify="center" align="center" direction="column" mt={10} width="100%">

            {selectPDF ? (
                <>
               
                    <Text>PDF file selected</Text>

                    

                    <Stack direction="row" mt={10} mb={10}>
                        
                        <Button
                            height="25px"
                            variant="outline"
                            onClick={() => setselectPDF("")}
                        >
                            Remove
                        </Button>

                        <Button
                            height="25px"
                            onClick={() => selectedTabItem("Info")}
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
                    Select PDF File
                </Button>
                <input 
                    ref={selectImageFile} 
                    type="file"
                    accept='application/pdf'
                    hidden
                    onChange={userUploadPDF} 
                />
                
                {/* display selected file */}
                <img src={selectPDF} />

            </Flex>
            )}

        </Flex>
    );
}
export default PdfUpload;








