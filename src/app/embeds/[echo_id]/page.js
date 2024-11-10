

"use client";
import React, { useState, useEffect } from "react";
import { Tweet } from "react-tweet";
import { useParams } from "next/navigation";

// Main Component
const SocialMediaIntegration = () => {
  const { echo_id } = useParams();
  const [activeTab, setActiveTab] = useState("twitter");
  const [embedData, setEmbedData] = useState({
    tweetIds: [],
    youtubeUrls: [],
    instagramUrls: [],
  });
  const [tweetId, setTweetId] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [postUrl, setPostUrl] = useState("");

  useEffect(() => {
    const fetchEmbedData = async () => {
      try {
        const response = await fetch(`/api/embeds/${echo_id}`);
        const data = await response.json();
        if (data.success) {
          setEmbedData({
            tweetIds: data.data.tweetIds || [],
            youtubeUrls: data.data.youtubeUrls || [],
            instagramUrls: data.data.instagramUrls || [],
          });
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching embed data:", error);
      }
    };

    fetchEmbedData();
  }, [echo_id]);

  const handleTweetSubmit = async (e) => {
    e.preventDefault();
    if (tweetId) {
      const updatedTweetIds = [...embedData.tweetIds, tweetId];
      setEmbedData((prev) => ({ ...prev, tweetIds: updatedTweetIds }));
      setTweetId("");

      // Send POST request to save the Tweet IDs
      try {
        await fetch(`/api/embeds/${echo_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tweetIds: updatedTweetIds }),
        });
      } catch (error) {
        console.error("Error saving Tweet IDs:", error);
      }
    }
  };

  const handleYouTubeSubmit = async (e) => {
    e.preventDefault();
    const videoId = extractVideoID(videoUrl);
    if (videoId) {
      const newEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
      const updatedYoutubeUrls = [...embedData.youtubeUrls, newEmbedUrl];
      setEmbedData((prev) => ({ ...prev, youtubeUrls: updatedYoutubeUrls }));
      setVideoUrl("");

      // Send POST request to save the YouTube embed URLs
      try {
        await fetch(`/api/embeds/${echo_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ youtubeUrls: updatedYoutubeUrls }),
        });
      } catch (error) {
        console.error("Error saving YouTube URLs:", error);
      }
    } else {
      alert("Invalid YouTube URL. Please enter a valid link.");
    }
  };

  const handleInstagramSubmit = async (e) => {
    e.preventDefault();
    if (postUrl) {
      const updatedPostUrls = [...embedData.instagramUrls, postUrl];
      setEmbedData((prev) => ({ ...prev, instagramUrls: updatedPostUrls }));
      setPostUrl("");

      // Send POST request to save the Instagram post URLs
      try {
        await fetch(`/api/embeds/${echo_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ instagramUrls: updatedPostUrls }),
        });
      } catch (error) {
        console.error("Error saving Instagram URLs:", error);
      }
    }
  };

  const extractVideoID = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getPostIdFromUrl = (url) => {
    const regex = /https:\/\/www.instagram.com\/p\/([a-zA-Z0-9-_]*)\/?/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  return (
  

    <div className="flex flex-grow min-h-0">
      {/* Left Tabs */}
      <div className="leftcol w-1/6 bg-[#0A0A0A] p-4">
        <div className="flex flex-col space-y-4">
          <button
            className={`py-2 px-4 rounded-lg ${
              activeTab === "twitter"
                ? "bg-purple-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("twitter")}
          >
            Twitter
          </button>
          <button
            className={`py-2 px-4 rounded-lg ${
              activeTab === "youtube"
                ? "bg-purple-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("youtube")}
          >
            YouTube
          </button>
          <button
            className={`py-2 px-4 rounded-lg ${
              activeTab === "instagram"
                ? "bg-purple-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("instagram")}
          >
            Instagram
          </button>
        </div>
      </div>

      {/* Right Content */}
      <div className="rightcol w-5/6 bg-black px-4">
        {activeTab === "twitter" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Submit Tweet ID</h2>
            <form
              onSubmit={handleTweetSubmit}
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
              {embedData.tweetIds.map((id, index) => (
                <div key={index} className="p-4 bg-white shadow-md rounded-lg">
                  <Tweet id={id} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "youtube" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Submit YouTube Video URL
            </h2>
            <form
              onSubmit={handleYouTubeSubmit}
              className="flex flex-col items-center mb-8"
            >
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
              {embedData.youtubeUrls.map((embedUrl, index) => (
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
        )}

        {activeTab === "instagram" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Submit Instagram Post URL
            </h2>
            <form
              onSubmit={handleInstagramSubmit}
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
              {embedData.instagramUrls.map((url, index) => (
                <div key={index} className="p-4 bg-white shadow-md rounded-lg">
                  <iframe
                    src={`https://www.instagram.com/p/${getPostIdFromUrl(
                      url
                    )}/embed`}
                    className="w-full"
                    frameBorder="0"
                    scrolling="no"
                    allowTransparency="true"
                    allow="encrypted-media"
                  ></iframe>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialMediaIntegration;
