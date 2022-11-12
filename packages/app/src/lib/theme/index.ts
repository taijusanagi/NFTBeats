import { theme } from "@chakra-ui/pro-theme";
import { extendTheme } from "@chakra-ui/react";
import { lightTheme } from "@rainbow-me/rainbowkit";

export const myChakraUITheme = extendTheme(
  {
    colors: { ...theme.colors, brand: theme.colors.blue },
  },
  theme
);

const rainbowKitTheme = lightTheme();
export const myRainbowKitTheme = {
  ...rainbowKitTheme,
  colors: {
    ...rainbowKitTheme.colors,
    accentColor: myChakraUITheme.colors.brand[500],
  },
  fonts: {
    ...rainbowKitTheme.fonts,
  },
  shadows: {
    ...rainbowKitTheme.shadows,
    connectButton: myChakraUITheme.shadows.md,
  },
};
