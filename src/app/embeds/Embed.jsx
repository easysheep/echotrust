"use client";
import React, { useState, useEffect } from "react";
import { Tweet } from "react-tweet";
import { useParams } from "next/navigation";
import { FaYoutube, FaInstagram } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { CiSquarePlus } from "react-icons/ci";
// Main Component
const SocialMediaIntegration = ({ echo_id }) => {
  // const { echo_id } = useParams();
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

  const handleYoutubeEmbeding = async (e, videoUrl) => {
    e.preventDefault();
    const videoId = extractVideoID(videoUrl); // Ensure this function is defined elsewhere
    if (videoId) {
      try {
        const response = await fetch(`/api/embeding/${echo_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ youtubeUrls: [videoUrl] }),
        });

        const responseData = await response.json();
        console.log("Response Status:", response.status); // Check status code
        console.log("Response Data:", responseData); // Log the full response data

        if (!response.ok) {
          console.error(`Error: ${responseData.message}`);
        }
      } catch (error) {
        console.error("Error saving YouTube URLs:", error);
      }
    } else {
      alert("Invalid YouTube URL. Please enter a valid link.");
    }
  };

  const handleInstagramEmbeding = async (e, postUrl) => {
    e.preventDefault();
    if (postUrl) {
      try {
        const response = await fetch(`/api/embeding/${echo_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ instagramUrls: [postUrl] }),
        });

        const responseData = await response.json();
        console.log("Response Status:", response.status); // Check status code
        console.log("Response Data:", responseData); // Log the full response data

        if (!response.ok) {
          console.error(`Error: ${responseData.message}`);
        }
      } catch (error) {
        console.error("Error saving Instagram URLs:", error);
      }
    } else {
      alert("Invalid Instagram URL. Please enter a valid link.");
    }
  };

  const handleTweetEmbeding = async (e, tweetId) => {
    e.preventDefault();
    if (tweetId) {
      try {
        const response = await fetch(`/api/embeding/${echo_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tweetIds: [tweetId] }),
        });

        const responseData = await response.json();
        console.log("Response Status:", response.status); // Check status code
        console.log("Response Data:", responseData); // Log the full response data

        if (!response.ok) {
          console.error(`Error: ${responseData.message}`);
        }
      } catch (error) {
        console.error("Error saving Tweet IDs:", error);
      }
    }
  };

  return (
    <div className="flex flex-grow min-h-0">
      {/* Left Tabs */}
      <div className="leftcol w-1/6 bg-[#0A0A0A]">
        <div className="flex flex-col h-full">
          <div className="flex flex-col flex-grow">
            {/* Twitter */}
            <div
              className={`flex items-center px-2 py-3 transition-colors duration-300 font-poppins ${
                activeTab === "twitter" ? "bg-purple-500" : "bg-[#0A0A0A]"
              } text-white hover:bg-purple-700 focus:ring focus:ring-purple-300 cursor-pointer`}
              onClick={() => setActiveTab("twitter")}
              style={{ borderRadius: "0" }}
            >
              <span className="mr-2">
                <FaSquareXTwitter className="w-8 h-8" />
              </span>
              Twitter
            </div>

            {/* YouTube */}
            <div
              className={`flex items-center px-2 py-3 transition-colors duration-300 font-poppins ${
                activeTab === "youtube" ? "bg-purple-500" : "bg-[#0A0A0A]"
              } text-white hover:bg-purple-700 focus:ring focus:ring-purple-300 cursor-pointer`}
              onClick={() => setActiveTab("youtube")}
              style={{ borderRadius: "0" }}
            >
              <span className="mr-2">
                <FaYoutube className="w-8 h-8" />
              </span>
              YouTube
            </div>

            {/* Instagram */}
            <div
              className={`flex items-center px-2 py-3 transition-colors duration-300 font-poppins ${
                activeTab === "instagram" ? "bg-purple-500" : "bg-[#0A0A0A]"
              } text-white hover:bg-purple-700 focus:ring focus:ring-purple-300 cursor-pointer`}
              onClick={() => setActiveTab("instagram")}
              style={{ borderRadius: "0" }}
            >
              <span className="mr-2">
                <FaInstagram className="w-8 h-8" />
              </span>
              Instagram
            </div>
          </div>

          <div className="flex-grow bg-[#0A0A0A]"></div>
        </div>
      </div>

      {/* Right Content */}
      {/* <div className="rightcol w-5/6 bg-black px-4">
        {activeTab === "twitter" && (
          <div>
            <form
              onSubmit={handleTweetSubmit}
              className="flex items-center justify-center space-x-2 mb-6" // Center items
            >
              <input
                type="text"
                value={tweetId}
                onChange={(e) => setTweetId(e.target.value)}
                placeholder="Enter tweet ID to embed"
                className="px-2 py-1 text-black font-poppins border border-purple-600 w-full max-w-md focus:outline-none focus:ring-0 focus:border-purple-500 transition duration-300" // Adjusted padding for a thinner look
              />
              <button
                type="submit"
                className="bg-purple-600 text-white font-semibold py-1 px-2 focus:outline-none hover:bg-purple-700 transition duration-300 border border-purple-600" // Adjusted padding for a thinner look
              >
                Submit
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {embedData.tweetIds.map((id, index) => (
                <div
                  key={index}
                  className="bg-black shadow-md rounded-lg overflow-hidden"
                  style={{ height: "500px" }}
                >
                  <Tweet id={id} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "youtube" && (
          <div>
            <form
              onSubmit={handleYouTubeSubmit}
              className="flex items-center justify-center space-x-2 mb-8"
            >
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
                className="px-2 py-1 text-black font-poppins border border-purple-600 w-full max-w-md focus:outline-none focus:ring-0 focus:border-purple-500 transition duration-300" // Sharp input
                required
              />
              <button
                type="submit"
                className="bg-purple-600 text-white font-semibold py-1 px-2 focus:outline-none hover:bg-purple-700 transition duration-300 border border-purple-600" // Sharp button
              >
                Embed Video
              </button>
            </form>

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
            <form
              onSubmit={handleInstagramSubmit}
              className="flex items-center justify-center space-x-2 mb-6" // Center items and side-by-side layout
            >
              <input
                type="text"
                value={postUrl}
                onChange={(e) => setPostUrl(e.target.value)}
                placeholder="Enter Instagram Post URL"
                className="px-2 py-1 text-black font-poppins border border-purple-600 w-full max-w-md focus:outline-none focus:ring-0 focus:border-purple-500 transition duration-300" // Sharp input
              />
              <button
                type="submit"
                className="bg-purple-600 text-white font-semibold py-1 px-2 focus:outline-none hover:bg-purple-700 transition duration-300 border border-purple-600" // Sharp button
              >
                Submit
              </button>
            </form>

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
      </div> */}

      <div className="rightcol w-5/6 bg-black px-4">
        {activeTab === "twitter" && (
          <div>
            <form
              onSubmit={handleTweetSubmit}
              className="flex items-center justify-center space-x-2 mb-6"
            >
              <input
                type="text"
                value={tweetId}
                onChange={(e) => setTweetId(e.target.value)}
                placeholder="Enter tweet ID to embed"
                className="px-2 py-1 text-black font-poppins border border-purple-600 w-full max-w-md focus:outline-none focus:ring-0 focus:border-purple-500 transition duration-300"
              />
              <button
                type="submit"
                className="bg-purple-600 text-white font-semibold py-1 px-2 focus:outline-none hover:bg-purple-700 transition duration-300 border border-purple-600"
              >
                Submit
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {embedData.tweetIds.map((id, index) => (
                <div
                  key={index}
                  className="relative bg-black shadow-md rounded-lg overflow-hidden"
                  style={{ height: "500px" }}
                >
                  {/* Plus sign */}
                  <CiSquarePlus
                    className="absolute top-3.5 left-1 bg-black text-white cursor-pointer hover:text-gray-200 transition duration-300"
                    size={30} // Adjust the size as per your preference
                    onClick={(e) => handleTweetEmbeding(e, id)}
                  />
                  <Tweet id={id} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "youtube" && (
          <div>
            <form
              onSubmit={handleYouTubeSubmit}
              className="flex items-center justify-center space-x-2 mb-8"
            >
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
                className="px-2 py-1 text-black font-poppins border border-purple-600 w-full max-w-md focus:outline-none focus:ring-0 focus:border-purple-500 transition duration-300"
                required
              />
              <button
                type="submit"
                className="bg-purple-600 text-white font-semibold py-1 px-2 focus:outline-none hover:bg-purple-700 transition duration-300 border border-purple-600"
              >
                Embed Video
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {embedData.youtubeUrls.map((embedUrl, index) => (
                <div
                  key={index}
                  className="relative"
                  style={{ paddingBottom: "56.25%" }}
                >
                  {/* Plus sign */}
                  <CiSquarePlus
                    className="absolute top-3.5 left-1 bg-black text-white cursor-pointer hover:text-gray-200 transition duration-300"
                    size={30} // Adjust the size as per your preference
                    style={{ zIndex: 10 }}
                    onClick={(e) => handleYoutubeEmbeding(e, embedUrl)}
                  />

                  {/* YouTube Embed */}
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={embedUrl}
                    frameBorder="0"
                    allowFullScreen
                    title={`Embedded YouTube Video ${index + 1}`}
                    style={{ zIndex: 1 }}
                  ></iframe>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "instagram" && (
          <div>
            <form
              onSubmit={handleInstagramSubmit}
              className="flex items-center justify-center space-x-2 mb-6"
            >
              <input
                type="text"
                value={postUrl}
                onChange={(e) => setPostUrl(e.target.value)}
                placeholder="Enter Instagram Post URL"
                className="px-2 py-1 text-black font-poppins border border-purple-600 w-full max-w-md focus:outline-none focus:ring-0 focus:border-purple-500 transition duration-300"
              />
              <button
                type="submit"
                className="bg-purple-600 text-white font-semibold py-1 px-2 focus:outline-none hover:bg-purple-700 transition duration-300 border border-purple-600"
              >
                Submit
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {embedData.instagramUrls.map((url, index) => (
                <div
                  key={index}
                  className="relative shadow-md rounded-lg"
                  style={{ height: "500px" }} // Adjust the height of the container here
                >
                  {/* Plus sign */}
                  <CiSquarePlus
                    className="absolute top-1 left-1 bg-black text-white cursor-pointer hover:text-gray-200 transition duration-300"
                    size={30}
                    style={{ zIndex: 10 }}
                    onClick={(e) => handleInstagramEmbeding(e, url)}
                  />

                  {/* Instagram Embed */}
                  <iframe
                    src={`https://www.instagram.com/p/${getPostIdFromUrl(
                      url
                    )}/embed`}
                    className="absolute top-0 left-0 w-full h-full" // Ensure the iframe takes full height and width of the container
                    frameBorder="0"
                    scrolling="no"
                    allowTransparency="true"
                    allow="encrypted-media"
                    style={{ height: "100%" }} // Ensure iframe respects container height
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
