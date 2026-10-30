import { Inter, Source_Serif_4 } from "next/font/google"

export const fontInter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
})

export const fontSourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-source-serif",
})
