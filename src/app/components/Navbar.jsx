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
    <div className="flex items-center h-20 px-28 justify-between">
      <div className="flex gap-10 font-roboto font-medium ">
        {/* Left Side: Pricing and Features */}
        <p className="text-white text-sm border-b-2 border-transparent hover:border-white transition-all cursor-pointer">
          Pricing
        </p>
        <p className="text-white text-sm  border-b-2 border-transparent hover:border-white transition-all cursor-pointer">
          Features
        </p>
        <p className="text-white text-sm  border-b-2 border-transparent hover:border-white transition-all cursor-pointer">
          Customers
        </p>
      </div>

      {/* Center Title */}
      <div className="flex text-center text-5xl font-protest tracking-tight text-white" style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4)' }}>
        E c h o   T r u s t
      </div>

      {/* Right Side: Sign In / Sign Up */}
      <div className="flex gap-4">
        <SignedIn>
          <div className="flex items-center gap-2">
            <UserButton afterSignOutUrl="/" />
            <p className="text-white text-sm border-b-2 border-transparent hover:border-white transition-all cursor-default">
            </p>
          </div>
        </SignedIn>

        <SignedOut>
          <div className="flex items-center gap-10">
            <SignInButton className="text-sm  border-b-2 border-transparent hover:border-white transition-all cursor-pointer text-white" />
            <SignUpButton className="text-sm  border-b-2 border-transparent hover:border-white transition-all cursor-pointer text-white" />
          </div>
        </SignedOut>
      </div>
    </div>
  );
};

export default Navbar;
