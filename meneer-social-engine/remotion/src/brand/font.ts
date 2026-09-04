import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

export const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700", "800"],
  subsets: ["latin"],
});
