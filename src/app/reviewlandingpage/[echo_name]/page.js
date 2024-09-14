"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { useUser, useClerk } from "@clerk/nextjs";

const ReviewPage = ({ params }) => {
  const echo_name = params.echo_name;
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    stars: "",
    note: "",
  });
  const [aiResponse, setAiResponse] = useState(""); // Store AI response
  const { isSignedIn, user } = useUser();
  const { signIn } = useClerk();

  const MODEL_NAME = "gemini-1.0-pro";
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  // Hard-coded prompt
  const hardCodedPrompt = `generate a funnier and unique thank you note than before in 2-3 lines about thanking the person for reviewing with ${formData.stars} stars out of 5 to make it look funnily dramatic but never overdo it, don't focus on using many other language words just remain comical with the responses about rating with 1 being worst and 5 being best out of 5 obviously`;

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!isSignedIn) {
  //     signIn(); // Prompt user to sign in
  //     return;
  //   }
  //   try {
  //     const response = await fetch(`/api/review/${echo_name}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(formData),
  //     });

  //     if (response.ok) {
  //       const result = await response.json();
  //       console.log("Review created successfully:", result);
  //       await runAI(hardCodedPrompt);
  //     } else {
  //       console.error("Failed to create review");
  //     }
  //   } catch (error) {
  //     console.error("Error during form submission:", error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isSignedIn) {
      signIn(); // Prompt user to sign in
      return;
    }
    console.log("user info", user);

    // Use fallback values for user data
    const payload = {
      ...formData,
      username: `${user?.firstName} ${user?.lastName}`.trim() || "Anonymous",
      useremail: user?.primaryEmailAddress?.emailAddress || "no-email@domain.com",
      userimageurl: user?.imageUrl || "/default-avatar.png",
    };

    console.log("Payload:", payload); // Check payload before submission

    try {
      const response = await fetch(`/api/review/${echo_name}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // Send payload with user data
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Review created successfully:", result);
        await runAI(hardCodedPrompt); // Run AI prompt after successful review creation
      } else {
        console.error("Failed to create review");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!reviewData) {
    return <div>No review data found for {echo_name}</div>;
  }

  return (
    <div>
      {!aiResponse ? (
        <div>
          <h1>Review for: {echo_name}</h1>

          <p>
            <strong>Title:</strong> {reviewData.echo_title}
          </p>
          <p>
            <strong>Details:</strong> {reviewData.echo_details}
          </p>
          <p>
            <strong>Message:</strong> {reviewData.echo_message}
          </p>
          <p>
            <strong>Sender:</strong> {reviewData.sender_name}
          </p>
          <p>
            <strong>Attachment:</strong> {reviewData.attachment}
          </p>
          <p>
            <strong>Logo:</strong> {reviewData.echo_logo}
          </p>
          <p>
            <strong>Additional Questions:</strong> {reviewData.add_questions}
          </p>

          <form onSubmit={handleSubmit}>
            {/* Stars input */}
            <input
              type="text"
              className="border-2 border-black"
              placeholder="Stars (1-5)"
              name="stars"
              value={formData.stars}
              onChange={handleChange}
              required
            />

            {/* Note textarea */}
            <textarea
              cols="30"
              rows="10"
              className="border-2 border-black"
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Add a note for us"
              required
            />

            <Button type="submit">Submit</Button>
          </form>
        </div>
      ) : (
        <div>
          <h2>AI-Generated Content:</h2>
          <p>{aiResponse}</p>
          <p>- by {reviewData.sender_name}</p>
        </div>
      )}
    </div>
  );
};

export default ReviewPage;
