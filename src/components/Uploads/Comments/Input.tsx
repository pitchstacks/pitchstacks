import { Flex, Textarea, Button, Text } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import React from 'react';
import AuthButtons from '../../Navbar/RightContent/AuthButtons';

type InputProps = {
    commentText: string;
    setCommentText: (value: string) => void;
    user: User;
    startLoading: boolean;
    userCreateComment: (commentText: string) => void;
};

const Input:React.FC<InputProps> = ({ commentText, setCommentText, user, startLoading, userCreateComment }) => {
    
    return (
        <Flex direction="column" position="relative" mt={3}>
      {user ? (
        <>
          <Text mb={2}>
            Reply to upload as{" "}
            <span style={{ color: "blue" }}>
              {user?.email?.split("@")[0]}
            </span>
          </Text>
          <Textarea
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            placeholder="type your thoughts..."
            fontSize="10pt"
            borderRadius={4}
            minHeight="160px"
            pb={10}
            _placeholder={{ color: "gray.500" }}
            _focus={{
              outline: "none",
              bg: "white",
              border: "1px solid black",
            }}
          />
          <Flex
            position="absolute"
            left="1px"
            right={0.1}
            bottom="1px"
            justify="flex-end"
            bg="gray.100"
            p="6px 8px"
            borderRadius="0px 0px 4px 4px"
          >
            <Button
              height="26px"
              disabled={!commentText.length}
              isLoading={startLoading}
              onClick={() => userCreateComment(commentText)}
            >
              Comment
            </Button>
          </Flex>
        </>
      ) : (
        <Flex
          align="center"
          justify="space-between"
          borderRadius={2}
          border="1px solid"
          borderColor="gray.100"
          p={4}
        >
          <Text fontWeight={600}>Join PitchStacks to comment</Text>
          <AuthButtons />
        </Flex>
      )}
    </Flex>
    );
}
export default Input;