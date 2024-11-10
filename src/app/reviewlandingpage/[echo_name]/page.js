"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { useUser, useClerk } from "@clerk/nextjs";
import { QRCodeCanvas } from "qrcode.react"; // Import QRCode component
import toast from "react-hot-toast";

import { FaStar } from "react-icons/fa";
import { FaPaperclip } from "react-icons/fa";
import { motion } from "framer-motion";
import LoadingAnimation from "@/components/LoadingAnimation";

const ReviewPage = ({ params }) => {
  const echo_name = params.echo_name;
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  // State to store the selected GIF
  const [randomGif, setRandomGif] = useState("");
  const [formData, setFormData] = useState({
    stars: "",
    note: "",
  });

  const gifUrls = [
    "https://media.giphy.com/media/ZfK4cXKJTTay1Ava29/giphy.gif",
    "https://media.giphy.com/media/26gsjCZpPolPr3sBy/giphy.gif",
    "https://media.giphy.com/media/nmBKiNb7h3tIv3BO8D/giphy.gif",
    "https://media.giphy.com/media/7rwS6e59S26Ozzud2o/giphy.gif",
    "https://media.giphy.com/media/l3q2wJsC23ikJg9xe/giphy.gif",
    "https://media.giphy.com/media/1YFZrNC272VXOnuuOx/giphy.gif",
    "https://media.giphy.com/media/1QffP8E6nk4gKYZO5S/giphy.gif",
    "https://media.giphy.com/media/QAsBwSjx9zVKoGp9nr/giphy.gif",
    "https://media.giphy.com/media/PW2YmRu5TvbJ7ZJpQg/giphy.gif",
    "https://media.giphy.com/media/5xtDarmwsuR9sDRObyU/giphy.gif",
    "https://media.giphy.com/media/MBjL8mbYsRr72KFD0A/giphy.gif",
    "https://media.giphy.com/media/Yf2udL88YqkDh3cnzn/giphy.gif",
    "https://media.giphy.com/media/w4QmUykBhDP5EmpptJ/giphy.gif",
    "https://media.giphy.com/media/zRKJFP8sOSL6Zu7I7j/giphy.gif",
    "https://media.giphy.com/media/SIBtjtIUgkewDtm65R/giphy.gif",
    "https://media.giphy.com/media/pneG7YsDljrFo2nuFR/giphy.gif",
    "https://media.giphy.com/media/yD5vFVwjK0ZRLgoh65/giphy.gif",
  ];

  const [aiResponse, setAiResponse] = useState(""); // Store AI response
  const { isSignedIn, user } = useUser();
  const { signIn } = useClerk();

  // Randomly select a GIF when the component mounts
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * gifUrls.length);
    setRandomGif(gifUrls[randomIndex]);
  }, []);

  const MODEL_NAME = "gemini-1.0-pro";
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  // Hard-coded prompt
  const hardCodedPrompt = `generate a funnier and unique thank you note than before in 2-3 lines about thanking the person for reviewing with ${formData.stars} stars out of 5 to make it look funnily dramatic but never overdo it, don't focus on using many other language words just remain comical with the responses about rating with 1 being worst and 5 being best out of 5 obviously and dont ever give more than one response`;

  const reviewLink = `/reviewlandingpage/${echo_name}`; // Create the link to share

  useEffect(() => {
    if (echo_name) {
      fetch(`/api/review/${echo_name}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Network response was not ok: ${response.statusText}`
            );
          }
          return response.json();
        })
        .then((data) => {
          setReviewData(data.echo);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching review data:", err);
          setError(err);
          setLoading(false);
        });
    }
  }, [echo_name]);

  const handleStarClick = (rating) => {
    setFormData((prevData) => ({
      ...prevData,
      stars: rating, // Update star rating in formData
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the user is signed in
    if (!isSignedIn) {
      signIn(); // Prompt user to sign in
      return;
    }
    console.log("user info", user);

    const payload = {
      ...formData,
      username: `${user?.firstName} ${user?.lastName}`.trim() || "Anonymous",
      useremail:
        user?.primaryEmailAddress?.emailAddress || "no-email@domain.com",
      userimageurl: user?.imageUrl || "/default-avatar.png",
    };

    console.log("Payload:", payload); // Log the payload before submission

    // Display a loading toast while the submission is in progress
    toast.loading("Submitting your review...", {
      id: "submit-toast", // Assign a unique ID to this toast for update
    });

    try {
      const response = await fetch(`/api/review/${echo_name}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Review created successfully:", result);

        // Update the toast to success after submission completes
        toast.success("Review created successfully!", {
          id: "submit-toast", // Match the ID to replace the loading toast
          icon: "✅",
          style: {
            border: "1px solid #34D399",
            padding: "16px",
            color: "#4CAF50",
          },
        });

        await runAI(hardCodedPrompt); // Run AI prompt after successful review creation
      } else {
        console.error("Failed to create review");

        // Update the toast to error if submission fails
        toast.error("Failed to create review. Please try again.", {
          id: "submit-toast", // Match the ID to replace the loading toast
          icon: "❌",
          style: {
            border: "1px solid #F87171",
            padding: "16px",
            color: "#DC2626",
          },
        });
      }
    } catch (error) {
      console.error("Error during form submission:", error);

      // Update the toast to error if there's a network or other error
      toast.error("An unexpected error occurred. Please try again.", {
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

  const runAI = async (prompt) => {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    try {
      const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      });

      const result = await chat.sendMessage(prompt);
      setAiResponse(result.response.text());
    } catch (error) {
      console.error("Error generating AI content:", error);
    }
  };

  if (loading) {
    return <LoadingAnimation></LoadingAnimation>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!reviewData) {
    return <div>No review data found for {echo_name}</div>;
  }

  const toggleAttachment = () => {
    setIsExpanded((prev) => !prev);
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      {!aiResponse ? (
        <div className="bg-black p-8 min-h-screen flex items-center">
          <div className="rounded-lg bg-white w-3/6 flex h-fit mx-auto p-4 flex-col">
            <div className="topside w-full flex items-center justify-content flex-col">
              <div className="flex justify-center h-1/2 w-96 flex-col items-center border-2 border-gray ">
                <img
                  src={reviewData.echo_logo}
                  alt="Echo Logo"
                  className="h-60 w-96 object-cover shadow-custom"
                />
              </div>

              <div className="font-extrabold mt-8 text-4xl font-protest">
                {reviewData.echo_title}
              </div>
            </div>

            <div className="bottomside w-full px-4 mt-2">
              {/* <h1>Review for: {echo_name}</h1> */}
              <div className="font-light font-greek">
                {reviewData.echo_details}
              </div>

              <div className="flex items-center space-x-2 mt-3">
                {/* Paperclip icon that toggles the link */}
                <button
                  onClick={toggleAttachment}
                  className="p-2 hover:bg-gray-200 rounded"
                >
                  <FaPaperclip className="text-2xl text-gray-600" />
                </button>

                {/* Conditionally show the link with opacity transition */}
                <div
                  className={`transition-opacity duration-300 ease-in-out ${
                    isExpanded ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {isExpanded && (
                    <a
                      href={reviewData.attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {reviewData.attachment}
                    </a>
                  )}
                </div>
              </div>
              <div className="mt-4 flex bg-purple-600 flex-col text-white py-1 px-2 rounded-lg">
                <div className="font-monte text-sm">Message for reviewers-</div>
                <div className="font-poppins text-lg">
                  {reviewData.echo_message}
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="p-4 rounded-lg  bg-white max-w-md mx-auto mt-4"
              >
                {/* Star Rating */}
                <div className="flex items-center mb-6 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      size={35} // Slightly larger stars for a better visual
                      className={`cursor-pointer transition-colors duration-300 ${
                        formData.stars >= star
                          ? "text-yellow-400"
                          : "text-gray-300 hover:text-yellow-400"
                      }`}
                      onClick={() => handleStarClick(star)}
                    />
                  ))}
                </div>

                {/* Note Input */}
                <div className="mb-6">
                  <label
                    htmlFor="note"
                    className="block text-lg font-medium mb-2 text-gray-700"
                  >
                    Leave a kind hearted review for us
                  </label>
                  <textarea
                    id="note"
                    cols="30"
                    rows="6"
                    className="border border-gray-300 w-full rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
                    name="note"
                    value={formData.note}
                    onChange={(e) =>
                      setFormData({ ...formData, note: e.target.value })
                    }
                    placeholder="tell us how you feel..."
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <Button
                    type="submit"
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-300"
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </div>


            <div className="flex">
              <div className="font-greek font-bold">Owner: &nbsp;</div>
              <div className="font-greek">{reviewData.sender_name}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-white min-h-screen bg-black flex items-center justify-center">
          <motion.div
            className="card bg-purple-600 rounded-lg shadow-lg p-6 max-w-md mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            whileHover={{
              scale: 1.1, // Scale up for a more pronounced effect
              // boxShadow: "0 20px 30px rgba(255, 255, 255, 0.5)", // Stronger shadow on hover
              rotateY: 10, // 3D rotation effect
              transition: { duration: 0.3 }, // Smooth transition
            }}
            whileTap={{
              scale: 0.95,
              rotateX: 5,
              rotateY: -5,
              transition: { duration: 0.1 }, // Quick tap response
            }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }} // Smooth exit animation
          >


            <div
              style={{
                width: "100%",
                height: 0,
                paddingBottom: "75%",
                position: "relative",
              }}
            >
              {randomGif && (
                <img
                  src={randomGif}
                  alt="Random GIF"
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                  }}
                />
              )}
            </div>

            <p className="text-xl mb-4 mt-2 font-greek font-bold">
              {aiResponse}
            </p>
            <p className="text-sm italic">- by {reviewData.sender_name}</p>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ReviewPage;
