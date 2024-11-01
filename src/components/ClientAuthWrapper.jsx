// "use client"; // This ensures it's a client component

// import { usePathname } from "next/navigation";
// import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

// export default function ClientAuthWrapper({ children }) {
//   const pathname = usePathname();

//   // Define paths where the UserButton should be displayed
//   const userButtonPaths = ["/dashboard", "/profile"]; // Add other paths as needed

//   // Determine if we are on the 'walloftrust' page or any other protected route
//   const isWallOfTrust = pathname === "/";

//   return (
//     <>
//       {isWallOfTrust ? (
//         children // Directly render children if the route is '/walloftrust'
//       ) : (
//         <>
//           {/* SignedIn: Content shown when user is authenticated */}
//           <SignedIn>
//             {/* Only render UserButton if the current path is in the userButtonPaths array */}
//             {userButtonPaths.includes(pathname) ? (
//               <UserButton afterSignOutUrl="/" />
//             ) : null}
//             {children}
//           </SignedIn>

//           {/* SignedOut: Content shown when user is not authenticated */}
//           <SignedOut>
//             <SignInButton />
//           </SignedOut>
//         </>
//       )}
//     </>
//   );
// }





"use client";

import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function ClientAuthWrapper({ children }) {
  const pathname = usePathname();

  // Define paths where the UserButton should be displayed
  const userButtonPaths = ["/walloftrust", "/profile"];

  // Determine if the current path is public and does not need authentication
  const isWallOfTrust = pathname === "/" || pathname.startsWith("/walloftrust");

  return (
    <>
      {isWallOfTrust ? (
        children // Directly render children if the route is public
      ) : (
        <>
          {/* SignedIn: Content shown when user is authenticated */}
          <SignedIn>
            {userButtonPaths.includes(pathname) ? (
              <UserButton afterSignOutUrl="/" />
            ) : null}
            {children}
          </SignedIn>

          {/* SignedOut: Content shown when user is not authenticated */}
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </>
      )}
    </>
  );
}
