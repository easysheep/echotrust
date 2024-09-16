"use client";
import React, { useState } from "react";
import { Tweet } from "react-tweet";
import { useParams } from "next/navigation";

// Twitter Embed Component
const TwitterEmbed = ({ params }) => {
  const { echo_id } = useParams();
  const [tweetId, setTweetId] = useState("");
  const [tweetIds, setTweetIds] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tweetId) {
      const updatedTweetIds = [...tweetIds, tweetId];
      setTweetIds(updatedTweetIds);
      setTweetId(""); // Clear the input after submission

      // Send POST request to save the Tweet IDs to the database
      try {
        const response = await fetch(`/api/embeds/${echo_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tweetIds: updatedTweetIds }), // You can adjust this to save all tweet IDs
        });
        if (!response.ok) {
          throw new Error("Failed to save Tweet IDs");
        }
      } catch (error) {
        console.error("Error saving Tweet IDs:", error);
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Submit Tweet ID</h2>
      <form
        onSubmit={handleSubmit}
        className="flex items-center space-x-4 mb-6"
      >
        <input
          type="text"
          value={tweetId}
          onChange={(e) => setTweetId(e.target.value)}
          placeholder="Enter Tweet ID"
          className="p-2 border rounded-lg w-full max-w-md"
        />
        <button
          type="submit"
          className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700"
        >
          Submit
        </button>
      </form>
      <h2 className="text-2xl font-bold mb-4">Twitter Posts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tweetIds.map((id, index) => (
          <div key={index} className="p-4 bg-white shadow-md rounded-lg">
            <Tweet id={id} />
          </div>
        ))}
      </div>
    </div>
  );
};

// YouTube Embed Component
const YouTubeEmbed = ({ params }) => {
  const { echo_id } = useParams();
  const [videoUrl, setVideoUrl] = useState("");
  const [embedUrls, setEmbedUrls] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const videoId = extractVideoID(videoUrl);
    if (videoId) {
      const newEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
      const updatedEmbedUrls = [...embedUrls, newEmbedUrl];
      setEmbedUrls(updatedEmbedUrls);
      setVideoUrl(""); // Clear the input field after submission

      // Send POST request to save the YouTube embed URLs to the database
      try {
        const response = await fetch(`/api/embeds/${echo_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ youtubeUrls: updatedEmbedUrls }), // Adjust this to save all YouTube URLs
        });
        if (!response.ok) {
          throw new Error("Failed to save YouTube URLs");
        }
      } catch (error) {
        console.error("Error saving YouTube URLs:", error);
      }
    } else {
      alert("Invalid YouTube URL. Please enter a valid link.");
    }
  };

  const extractVideoID = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Submit YouTube Video URL</h2>
      <form onSubmit={handleSubmit} className="flex flex-col items-center mb-8">
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
          className="p-2 border rounded-lg w-full max-w-md mb-4"
          required
        />
        <button
          type="submit"
          className="bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-purple-700"
        >
          Embed Video
        </button>
      </form>
      <h2 className="text-2xl font-bold mb-4">YouTube Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {embedUrls.map((embedUrl, index) => (
          <div
            key={index}
            className="relative"
            style={{ paddingBottom: "56.25%" }}
          >
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={embedUrl}
              frameBorder="0"
              allowFullScreen
              title={`Embedded YouTube Video ${index + 1}`}
            ></iframe>
          </div>
        ))}
      </div>
    </div>
  );
};

// Instagram Embed Component
const InstagramEmbed = ({ params }) => {
  const { echo_id } = useParams();
  const [postUrl, setPostUrl] = useState("");
  const [postUrls, setPostUrls] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (postUrl) {
      const updatedPostUrls = [...postUrls, postUrl];
      setPostUrls(updatedPostUrls);
      setPostUrl(""); // Clear the input after submission

      // Send POST request to save the Instagram post URLs to the database
      try {
        const response = await fetch(`/api/embeds/${echo_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ instagramUrls: updatedPostUrls }), // Adjust to save all Instagram URLs
        });
        if (!response.ok) {
          throw new Error("Failed to save Instagram URLs");
        }
      } catch (error) {
        console.error("Error saving Instagram URLs:", error);
      }
    }
  };

  const getPostIdFromUrl = (url) => {
    const regex = /https:\/\/www.instagram.com\/p\/([a-zA-Z0-9-_]*)\/?/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        Submit Instagram Post URL here
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex items-center space-x-4 mb-6"
      >
        <input
          type="text"
          value={postUrl}
          onChange={(e) => setPostUrl(e.target.value)}
          placeholder="Enter Instagram Post URL"
          className="p-2 border rounded-lg w-full max-w-md"
        />
        <button
          type="submit"
          className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700"
        >
          Submit
        </button>
      </form>
      <h2 className="text-2xl font-bold mb-4">Instagram Posts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {postUrls.map((url, index) => (
          <div
            key={index}
            className="w-full h-[300px] overflow-hidden bg-white shadow-md rounded-lg relative"
          >
            <iframe
              src={`https://www.instagram.com/p/${getPostIdFromUrl(url)}/embed`}
              height="100%"
              width="100%"
              frameBorder="0"
              scrolling="no"
              allowTransparency="true"
              allowFullScreen=""
              title={`Instagram Post ${index + 1}`}
              className="absolute top-0 left-0"
            ></iframe>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Integration Component
const SocialMediaIntegration = () => {
  const [activeTab, setActiveTab] = useState("Twitter");

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Social Media Integration
      </h1>

      {/* Tab Navigation */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setActiveTab("Twitter")}
          className={`py-2 px-4 rounded-lg font-semibold ${
            activeTab === "Twitter" ? "bg-purple-600 text-white" : "bg-gray-200"
          }`}
        >
          Twitter
        </button>
        <button
          onClick={() => setActiveTab("YouTube")}
          className={`py-2 px-4 rounded-lg font-semibold ${
            activeTab === "YouTube" ? "bg-purple-600 text-white" : "bg-gray-200"
          }`}
        >
          YouTube
        </button>
        <button
          onClick={() => setActiveTab("Instagram")}
          className={`py-2 px-4 rounded-lg font-semibold ${
            activeTab === "Instagram"
              ? "bg-purple-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Instagram
        </button>
      </div>

      {/* Conditionally Render Components Based on Active Tab */}
      {activeTab === "Twitter" && <TwitterEmbed />}
      {activeTab === "YouTube" && <YouTubeEmbed />}
      {activeTab === "Instagram" && <InstagramEmbed />}
    </div>
  );
};

export default SocialMediaIntegration;
