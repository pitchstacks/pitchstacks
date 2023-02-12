import { ComponentStyleConfig } from '@chakra-ui/theme';

export const Button: ComponentStyleConfig = {
    baseStyle: {
      borderRadius: "60px",
      fontSize: "10pt",
      fontWeight: 700,
      _focus: {
        boxShadow: "none",
      },
    },
    sizes: {
      sm: {
        fontSize: "8pt",
      },
      md: {
        fontSize: "10pt",
        // height: "28px",
      },
    },
    variants: {
      solid: {
        color: "white",
        bg: "blue.500",
        _hover: {
          bg: "blue.400",
        },
      },
      outline: {
        color: "brand.100",
        border: "1px solid",
        borderColor: "brand.100",
      },
      oauth: {
        height: "34px",
        border: "1px solid",
        borderColor: "gray.300",
        _hover: {
          bg: "gray.50",
        },
      },
    },
  };