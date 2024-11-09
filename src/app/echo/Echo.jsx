// src/app/page.js
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import toast from "react-hot-toast";

export default function FormPage() {
  const [echo_name, setEchoName] = useState("");
  const [echo_title, setEchoTitle] = useState("");
  const [echo_details, setEchoDetails] = useState("");
  const [echo_message, setEchoMessage] = useState("");
  const [sender_name, setSenderName] = useState("");
  const [attachment, setAttachment] = useState("");
  const [echo_logo, setLogo] = useState(null); // For the logo file
  const [logoPreview, setLogoPreview] = useState("");
  const [message, setMessage] = useState(""); // For logo preview
  const { user } = useUser();
  const router = useRouter();

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!echo_logo) {
  //     alert("Please upload an image");
  //     return;
  //   }

  //   try {
  //     // Convert the image file to a base64 string
  //     const base64Image = await toBase64(echo_logo);

  //     const res = await fetch("/api/echoes", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         echo_name,
  //         echo_title,
  //         echo_details,
  //         echo_message,
  //         sender_name,
  //         attachment,
  //         echo_logo: base64Image,
  //         user: user.id, // Send the base64 string
  //       }),
  //     });

  //     if (!res.ok) {
  //       throw new Error("Failed to submit form");
  //     }

  //     const data = await res.json();
  //     setMessage(data.message);
  //     router.push(`/reviewlandingpage/${echo_name}`);
  //   } catch (error) {
  //     console.error("Error submitting form:", error);
  //     setMessage("Error submitting form");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!echo_logo) {
      alert("Please upload an image");
      return;
    }

    // Show loading toast before form submission
    toast.loading("Submitting form...", { id: "submit-toast" });

    try {
      // Convert the image file to a base64 string
      const base64Image = await toBase64(echo_logo);

      const res = await fetch("/api/echoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          echo_name,
          echo_title,
          echo_details,
          echo_message,
          sender_name,
          attachment,
          echo_logo: base64Image,
          user: user.id, // Send the base64 string
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit form");
      }

      const data = await res.json();
      setMessage(data.message);
      router.push(`/reviewlandingpage/${echo_name}`);

      // Replace loading toast with success message
      toast.success("Form submitted successfully!", {
        id: "submit-toast",
        icon: "✅",
        style: {
          border: "1px solid #34D399",
          padding: "16px",
          color: "#4CAF50",
        },
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("Error submitting form");

      // Replace loading toast with error message
      toast.error("Error submitting form. Please try again.", {
        id: "submit-toast",
        icon: "❌",
        style: {
          border: "1px solid #F87171",
          padding: "16px",
          color: "#DC2626",
        },
      });
    }
  };

  // Utility function to convert file to base64
  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result); // Convert image to base64
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="bg-black min-h-full p-6">
      <div className="h-full mx-auto flex flex-col md:flex-row items-start justify-center">
        {/* Right Side (Form Section) */}
        <div className="w-full md:w-3/6 bg-white p-2 rounded-lg shadow-lg ">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 ">
            <div className="flex items-center justify-center text-4xl font-extrabold font-poppins">
              Create A New Echo
            </div>
            <div className="text-center font-light font-poppins text-customGray">
              Create a dedicated landing page to collect reviews about your echo
            </div>

            <div className="w-full justify-center flex">
              <div className="w-1/2 flex flex-col gap-6">
                <div className="w-full">
                  <div className="text-purple-500 font-extrabold">
                    Echo Logo
                  </div>
                  {/* <div className="imgbox border-4 w-full flex justify-center items-center max-h-52">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="max-h-full max-w-full object-cover"
                      />
                    ) : (
                      <label
                        htmlFor="echo_logo_upload"
                        className="custom-file-upload flex flex-col cursor-pointer"
                      >
                        <span className="text-8xl text-gray-400 flex justify-center font-roboto">
                          +
                        </span>
                        <span className="text-xl text-gray-400 font-bold font-roboto">
                          Add Image
                        </span>
                      </label>
                    )}
                    <input
                      id="echo_logo_upload"
                      type="file"
                      name="echo_logo"
                      onChange={(e) => setLogo(e.target.files[0])} // Update state with the file
                      accept="image/*"
                      required // Hide the default file input
                    />
                  </div> */}
                  <div className="imgbox border-4 w-full flex justify-center items-center max-h-52 overflow-hidden">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="h-full w-full object-contain" // Use object-contain to ensure it fits within the container
                      />
                    ) : (
                      <label
                        htmlFor="echo_logo_upload"
                        className="custom-file-upload flex flex-col cursor-pointer justify-center items-center h-full w-full"
                      >
                        <span className="text-8xl text-gray-400 flex justify-center font-roboto">
                          +
                        </span>
                        <span className="text-xl text-gray-400 font-bold font-roboto">
                          Add Image
                        </span>
                      </label>
                    )}
                    <input
                      id="echo_logo_upload"
                      type="file"
                      name="echo_logo"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setLogo(file); // Set the logo file
                          setLogoPreview(URL.createObjectURL(file)); // Generate preview URL
                        }
                      }}
                      accept="image/*"
                      required
                      className="hidden" // Hide default file input
                    />
                  </div>
                </div>
                {/* Echo Name */}
                <div className="w-full">
                  <div className="text-purple-500 font-extrabold">
                    Echo Name
                  </div>
                  <input
                    type="text"
                    name="echo_name"
                    placeholder="name your echo...."
                    value={echo_name}
                    onChange={(e) => setEchoName(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </div>

                {/* Echo Title */}
                <div className="w-full">
                  <div className="text-purple-500 font-extrabold">
                    Echo Title
                  </div>
                  <input
                    type="text"
                    name="echo_title"
                    placeholder="What do you want to name this echo for reviewing?"
                    value={echo_title}
                    onChange={(e) => setEchoTitle(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </div>

                {/* Echo Details */}
                <div className="w-full">
                  <div className="text-purple-500 font-extrabold">
                    Echo Details
                  </div>
                  <input
                    type="text"
                    name="echo_details"
                    placeholder="Provide details about your echo...."
                    value={echo_details}
                    onChange={(e) => setEchoDetails(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </div>

                {/* Echo Message */}
                <div className="w-full">
                  <div className="text-purple-500 font-extrabold">
                    Echo Message
                  </div>
                  <input
                    type="text"
                    name="echo_message"
                    placeholder="Your message for this echo...."
                    value={echo_message}
                    onChange={(e) => setEchoMessage(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </div>

                {/* Sender Name */}
                <div className="w-full">
                  <div className="text-purple-500 font-extrabold">
                    Sender Name
                  </div>
                  <input
                    type="text"
                    name="sender_name"
                    placeholder="Your name...."
                    value={sender_name}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </div>

                {/* Attachment */}
                <div className="w-full">
                  <div className="text-purple-500 font-extrabold">
                    Attachment
                  </div>
                  <input
                    type="text"
                    name="attachment"
                    placeholder="Link to any attachments...."
                    value={attachment}
                    onChange={(e) => setAttachment(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </div>

                <div className="w-full flex justify-center mt-4">
                  <Button
                    type="submit"
                    className="bg-purple-500 text-white rounded px-4 py-2"
                  >
                    Create Echo
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {message}
    </div>
  );
}
