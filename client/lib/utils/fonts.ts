import localFont from "next/font/local";

export const displayFont = localFont({
  variable: "--font-display",
  src: [
    {
      path: "../../public/fonts/circular-medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/circular-bold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/circular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
});
