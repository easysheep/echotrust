"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
const Navbar = () => {
  return (
    <div>
      <h1>Authentication Page</h1>

      {/* Show UserButton (Logout) if user is signed in */}
      <SignedIn>
        <div>
          <UserButton afterSignOutUrl="/" />
          <p>You are logged in!</p>
        </div>
      </SignedIn>

      {/* Show Sign In and Sign Up buttons if user is signed out */}
      <SignedOut>
        <div>
          <h2>Welcome, please sign in or sign up</h2>
          <SignInButton />
          <SignUpButton />
        </div>
      </SignedOut>
    </div>
  );
};

export default Navbar;
