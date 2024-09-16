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

const Echo = () => {
  const { user } = useUser();
  const router = useRouter();
  const MODEL_NAME = "gemini-1.0-pro";
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const [formData, setFormData] = useState({
    echo_name: "",
    echo_title: "",
    echo_details: "",
    echo_message: "",
    sender_name: "",
    attachment: "",
    echo_logo: "",
    add_questions: "",
  });
  const [description, setDescription] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (!user) {
      console.error("User is not authenticated.");
      return;
    }

    const updatedFormData = {
      ...formData,
      user: user.id, // Clerk userId
    };

    try {
      const response = await fetch("/api/echoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData), // Send user along with form data
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Echo created successfully:", result);

        // Redirect to the review landing page using the echo_name
        router.push(`/reviewlandingpage/${formData.echo_name}`);
      } else {
        console.error("Failed to create Echo");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  const runAI = async () => {
    setLoadingAI(true);
    try {
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

      const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: [
          {
            role: "user",
            parts: [{ text: `${description}, this  tells us what the echo is about it could be a service, could be a webiste,project,evenet etc what ever comes in this ask 3-4 questions which are meant to be asked to the reviewer about the particular echo, dont make question long and dont make them very techincal, mak ethe questions personal not very hard to answer like dont ask for highest/most/biggest things in questions` }],
          },
        ],
      });

      const result = await chat.sendMessage(description);
      const questions = result.response.text().split("\n").filter(Boolean).slice(0, 4);

      setFormData((prevData) => ({
        ...prevData,
        add_questions: questions.join("\n"),
      }));
    } catch (error) {
      console.error("Error generating AI questions:", error);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input
          type="text"
          name="echo_name"
          placeholder="Echo Name"
          value={formData.echo_name}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="echo_title"
          placeholder="Echo Title"
          value={formData.echo_title}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="echo_details"
          placeholder="Echo Details"
          value={formData.echo_details}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="echo_message"
          placeholder="Echo Message"
          value={formData.echo_message}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="sender_name"
          placeholder="Sender Name"
          value={formData.sender_name}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="attachment"
          placeholder="Attachment"
          value={formData.attachment}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="echo_logo"
          placeholder="Echo Logo"
          value={formData.echo_logo}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {/* Description for AI Question Generation */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            name="description"
            placeholder="Describe your Echo"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <Button onClick={runAI} disabled={loadingAI} className="bg-purple-500 text-white p-2 rounded">
            {loadingAI ? "Generating..." : "Auto Fill with AI"}
          </Button>
        </div>

        {/* Add Questions field */}
        <textarea
          name="add_questions"
          placeholder="Add Questions"
          value={formData.add_questions}
          onChange={handleChange}
          className="border p-2 rounded h-32"
        />

        <Button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Create Echo
        </Button>
      </form>
    </div>
  );
};

export default Echo;
