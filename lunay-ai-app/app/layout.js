import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

import AuthProvider from "../components/providers/AuthProvider";
import TRPCProvider from "../components/providers/TRPCProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Luna AI - Your AI Agent Platform",
  description: "Create, customize, and collaborate with intelligent AI agents. Featuring natural language conversations, custom agent creation, and powerful tool integrations.",
  keywords: ["AI agents", "conversational AI", "custom AI", "digital assistant", "AI collaboration"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        <AuthProvider>
          <TRPCProvider>
            {children}
          </TRPCProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
