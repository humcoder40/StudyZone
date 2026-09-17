import type { Metadata } from "next";
import { Fraunces, Noto_Nastaliq_Urdu, Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const nastaliq = Noto_Nastaliq_Urdu({
  variable: "--font-nastaliq",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "StudyZone · Class 10 English Practice",
  description:
    "Interactive board-style practice for PTB Class 10 English — MCQs, short questions, translation, and pairs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${fraunces.variable} ${nastaliq.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col text-ink">
        <div className="relative z-10 flex min-h-full flex-col">{children}</div>
      </body>
    </html>
  );
}
