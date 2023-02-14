import React, { useState } from "react";
import { Button, Flex, Icon, Input, Text } from "@chakra-ui/react";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { authModalState } from "../../../atoms/authModalAtom";
import { auth } from "../../../firebase/configApp";
import { useSetRecoilState } from "recoil";


const ResetPassword: React.FC = () => {
  const setAuthModalState = useSetRecoilState(authModalState);
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await sendPasswordResetEmail(email);
    setSuccess(true);
  };
  return (
    <Flex direction="column" alignItems="center" width="100%">
      {/*<Text fontWeight={700} mb={2}>
        Reset your password
  </Text>*/}
      {success ? (
        <Text mb={4}>Check your email :)</Text>
      ) : (
        <>
          <Text fontSize="sm" textAlign="center" mb={4}>
            Enter the email associated with your account and we will send you a reset link
          </Text>
          <form onSubmit={onSubmit} style={{ width: "100%" }}>
            <Input
              required
              name="email"
              placeholder="email"
              type="email"
              mb={2}
              onChange={(event) => setEmail(event.target.value)}
              fontSize="10pt"
              _placeholder={{ color: "gray.500" }}
              _hover={{
                bg: "white",
                border: "1px solid",
                borderColor: "blue.500",
              }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "blue.500",
              }}
              bg="gray.50"
            />
            <Text textAlign="center" fontSize="10pt" color="red">
              {error?.message}
            </Text>
            <Button
              width="100%"
              height="36px"
              mb={4}
              mt={2}
              type="submit"
              isLoading={sending}
            >
              Reset Password
            </Button>
          </form>
        </>
      )}
      <Flex
        alignItems="center"
        fontSize="9pt"
        color="brand.200"
        cursor="pointer"
      >
        <Text
          onClick={() =>
            setAuthModalState((prev) => ({
              ...prev,
              view: "login",
            }))
          }
        >
          back to log in
        </Text>
        {/*<Icon as={BsDot} />
        <Text color="gray.500" pl={1} pr={1}>or</Text>*/}
        {/*<Text
          onClick={() =>
            setAuthModalState((prev) => ({
              ...prev,
              view: "signup",
            }))
          }
        >
          sign up
        </Text>*/}
      </Flex>
    </Flex>
  );
};
export default ResetPassword;