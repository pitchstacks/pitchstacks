import { Button, Flex, Input, Stack, Textarea } from '@chakra-ui/react';
import React from 'react';

type TextInputProps = {
    textInputs: {
        title: string;
        body: string;
    };
    onChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    userCreateUpload: () => void;
    loading: boolean;
};

const TextInput:React.FC<TextInputProps> = ({
    textInputs, onChange, userCreateUpload, loading
    }) => {
    
    return (
        <Stack pt={4} spacing={3} width="100%">
            <Input 
                name="title"
                placeholder='Title'
                value={textInputs.title}
                onChange={onChange}
                fontSize="10pt"
                borderRadius={4}
                _placeholder={{ color: "gray.500" }}
                _focus={{
                    outline: "none",
                    bg: "white",
                    border: "1px solid",
                    borderColor: "gray.200",
                }}
            />
            <Textarea 
                name="body"
                placeholder='type here...'
                value={textInputs.body}
                height="150px"
                onChange={onChange}
                fontSize="10pt"
                borderRadius={4}
                _placeholder={{ color: "gray.500" }}
                _focus={{
                    outline: "none",
                    bg: "white",
                    border: "1px solid",
                    borderColor: "gray.200",
                }} 
            />
            <Flex bg="gray.200">
                <Button
                    height="32px"
                    padding="0px 40px"
                    disabled={!textInputs.title}
                    isLoading={loading}
                    onClick={userCreateUpload}
                >
                    Upload
                </Button>
            </Flex>
        </Stack>
    )
}
export default TextInput;