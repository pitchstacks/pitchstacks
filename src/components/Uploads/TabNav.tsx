import { Flex, Icon, Text } from '@chakra-ui/react';
import React from 'react';
import { TabItem } from './UploadForm';

type TabNavProps = {
    item: TabItem;
    selected: boolean;
    setSelectedTab: (value: string) => void;
};

const TabNav:React.FC<TabNavProps> = ({ item, selected, setSelectedTab }) => {
    
    return (
        <Flex justify="center" align="center" flexGrow={1} p="14px 0px" cursor="pointer" 
            _hover={{ bg: "gray.50" }}
            fontWeight={700}
            color={selected ? "brand.100" : "gray.500"}
            borderWidth={selected ? "0px 1px 2px 0px" : "0px 1px 1px 0px"}
            borderBottomColor={selected ? "brand.100" : "gray.500"}
            borderRightColor="gray.200"
            onClick={() => setSelectedTab(item.title)}
            >
            {/*<Flex align="center" height="25px" mr={3}>
                <Icon as={item.icon} />
            </Flex>*/}
            <Text fontSize="12pt" mr={3}>{item.title}</Text>
        </Flex>
    );
};
export default TabNav;