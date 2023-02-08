import "@fontsource/open-sans/300.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/700.css";
import { extendTheme } from "@chakra-ui/react";
import { Button } from "./buttons";

export const theme = extendTheme({
  colors: {
    brand: {
        // main blue color
        100: "#1a53ff",
    },
  },
  fonts: {
    body: "Open Sans, sans-serif", //add cutom font: chakra ui fonts
  },
  styles: {
    global: () => ({
        body: {
            bg: "gray.200", // grey background
        },
    }),
  },
  components: {
    // ex: buttons, items (can be global)
    Button,
  }
})