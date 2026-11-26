import localFont from "next/font/local"

export const fontInter = localFont({
  src: "../assets/fonts/inter-latin.woff2",
  weight: "400 700",
  style: "normal",
  display: "swap",
  variable: "--font-inter",
})

export const fontSourceSerif = localFont({
  src: "../assets/fonts/source-serif-4-latin.woff2",
  weight: "400 700",
  style: "normal",
  display: "swap",
  variable: "--font-source-serif",
})
