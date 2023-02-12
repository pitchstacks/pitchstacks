import { Button, Flex, Input, Select, Stack, Textarea } from '@chakra-ui/react';
import React, { useState } from 'react';

type TextInputProps = {
    textInputs: {
        title: string;
        body: string;
        ticker: string;
        //industry: ;
        type: string;
    };
    onChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => void;
    userCreateUpload: () => void;
    loading: boolean;
};

const TextInput:React.FC<TextInputProps> = ({
    textInputs, onChange, userCreateUpload, loading
    }) => {



    const [selectedOption, setSelectedOption] = useState<String>();
    
    return (
        <Stack pt={4} spacing={3} width="100%">
            <Input 
                name="title"
                width="90%"
                position="relative"
                right="-5%"
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



            {/* New inputs */}


            <Input 
                name="ticker"
                width="90%"
                position="relative"
                right="-5%"
                placeholder='Ticker or company (ex: AAPL)'
                value={textInputs.ticker}
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

            {/*<Stack 
                spacing={3}
                width="90%"
                position="relative"
                right="-5%"
                fontSize="10pt"
                borderRadius={4}
                _placeholder={{ color: "gray.500" }}
                _focus={{
                    outline: "none",
                    bg: "white",
                    border: "1px solid",
                    borderColor: "gray.200",
                }}
            
            >
                <Select onChange={onChange} color="gray.500" fontSize="10pt" size='md'>
                    <option selected disabled>
                        Select Industry
                    </option>
                    <option value='comm'>Communication Services</option>
                    <option value='cd'>Consumer Discretionary</option>
                    <option value='cs'>Consumer Staples</option>
                    <option value='energy'>Energy</option>
                    <option value='financials'>Financials</option>
                    <option value='hc'>Health Care</option>
                    <option value='industrials'>Industrials</option>
                    <option value='it'>Information Technology</option>
                    <option value='materials'>Materials</option>
                    <option value='re'>Real Estate</option>
                    <option value='utilities'>Utilities</option>
                </Select>
            </Stack>*/}





            <Input 
                name="type"
                width="90%"
                position="relative"
                right="-5%"
                placeholder='Type (Buy, Sell, Hold, Macro, etc.)'
                value={textInputs.type}
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
                width="90%"
                position="relative"
                right="-5%"
                placeholder='Type here...'
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
            <Flex bg="gray.100" pt={4}>
                <Button
                    position="relative"
                    right="-72%"
                    height="32px"
                    padding="0px 40px"
                    disabled={!textInputs.title}
                    isLoading={loading}
                    onClick={userCreateUpload}
                    color="white"
                    backgroundColor="brand.100"
                    _hover={{ backgroundColor: "brand.200" }}
                >
                    Upload
                </Button>
            </Flex>
        </Stack>
    )
}
export default TextInput;