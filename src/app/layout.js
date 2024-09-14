// import { Inter } from "next/font/google";
// import "./globals.css";
// import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

// export default function RootLayout({ children }) {
//   return (
//     <ClerkProvider>
//       <html lang="en">
//         <body className={inter.className}>
//           {/* SignedIn: Content shown when user is authenticated */}
//           <SignedIn>
//             <UserButton afterSignOutUrl="/" />
//             {children}
//           </SignedIn>

//           {/* SignedOut: Content shown when user is not authenticated */}
//           <SignedOut>
//             <SignInButton />
//           </SignedOut>
//         </body>
//       </html>
//     </ClerkProvider>
//   );
// }



import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";  // Use this to get the current route

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Add a condition to skip Clerk on the '/walloftrust' route
  const isWallOfTrust = pathname === "/walloftrust";

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {/* Skip Clerk authentication for '/walloftrust' */}
          {isWallOfTrust ? (
            children  // Directly render children for public access
          ) : (
            <>
              {/* SignedIn: Content shown when user is authenticated */}
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
                {children}
              </SignedIn>

              {/* SignedOut: Content shown when user is not authenticated */}
              <SignedOut>
                <SignInButton />
              </SignedOut>
            </>
          )}
        </body>
      </html>
    </ClerkProvider>
  );
}

