import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700", "800"],
  subsets: ["latin"],
});

export const headlineFontFamily = fontFamily;
export const bodyFontFamily = fontFamily;
