"use client"; // This ensures it's a client component

import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function ClientAuthWrapper({ children }) {
  const pathname = usePathname();

  // For example, you don't want authentication on the '/walloftrust' page
  const isWallOfTrust = pathname === "/walloftrust";

  return (
    <>
      {isWallOfTrust ? (
        children // Directly render children if the route is '/walloftrust'
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
    </>
  );
}
