import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import { Providers } from "./redux/provider/provider";
import "./globals.css";

const raleway = Raleway({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Retro Tool 4",
  description: "Retro Tool 4",
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={raleway.className}>
        <Providers>{children}</Providers>
        </body>
    </html>
  );
}
