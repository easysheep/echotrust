import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs"; // Keep only ClerkProvider here
import ClientAuthWrapper from "@/components/ClientAuthWrapper";
import { Toaster } from "react-hot-toast"; // Import Toaster
import { dark } from "@clerk/themes";
const inter = Inter({ subsets: ["latin"] });


export const metadata = {
  title: "EchoTrust",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
    frontendApi="https://clerk.echotrust.shop"
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          {/* Render children inside the ClientAuthWrapper */}

          <ClientAuthWrapper>{children}</ClientAuthWrapper>
          <Toaster position="top-center" reverseOrder={false} />
        </body>
      </html>
    </ClerkProvider>
  );
}
