import { Skeleton, Stack } from '@chakra-ui/react';
import React from 'react';

type UploadLoaderProps = {
    
};

const UploadLoader:React.FC<UploadLoaderProps> = () => {
    
    return (
        <Stack>
            <Skeleton height='40px' />
            <Skeleton height='40px' />
            <Skeleton height='40px' />
            <Skeleton height='40px' />
            <Skeleton height='40px' />
            <Skeleton height='40px' />
            <Skeleton height='40px' />
            <Skeleton height='40px' />
            <Skeleton height='40px' />
        </Stack>
    );
}
export default UploadLoader;