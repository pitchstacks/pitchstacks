import { Stack, Text } from '@chakra-ui/react';
import React from 'react';

type EndOfFeedProps = {
    
};

const EndOfFeed:React.FC<EndOfFeedProps> = () => {
    
    return (
        <Stack mt={7} mb={5} pl="32%">
            <Text color="gray.500">{`👏 You've seen it all today!`}</Text>
        </Stack>
    );
}
export default EndOfFeed;