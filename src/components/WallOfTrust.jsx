import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tweet } from "react-tweet";
import { CiSquareMinus } from "react-icons/ci";
import { FaCopy } from "react-icons/fa";
import toast from "react-hot-toast";
const WallOfTrust = ({ echoId, isEmbed = false }) => {
  const [embedData, setEmbedData] = useState({
    tweetIds: [],
    youtubeUrls: [],
    instagramUrls: [],
  });
  const [reviews, setReviews] = useState([]);
  const [embedLink, setEmbedLink] = useState("");
  const [showEmbedLink, setShowEmbedLink] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");
  const handleCopy = () => {
    navigator.clipboard
      .writeText(
        `<iframe src="${embedLink}" width="1200" height="800"></iframe>`
      )
      .then(() => {
        alert("Copied to clipboard!");
      })
      .catch((err) => console.error("Failed to copy text:", err));
  };

  // GET request to fetch embed data and reviews
  const fetchWallOfTrustData = async () => {
    try {
      const res = await fetch(`/api/walloftrust/${echoId}`);
      const data = await res.json();

      if (data) {
        setEmbedData({
          tweetIds: data.tweetIds || [],
          youtubeUrls: data.youtubeUrls || [],
          instagramUrls: data.instagramUrls || [],
        });
      }

      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Error fetching WallOfTrust data:", error);
    }
  };

  const getPostIdFromUrl = (url) => {
    const regex = /https:\/\/www.instagram.com\/p\/([a-zA-Z0-9-_]*)\/?/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  useEffect(() => {
    fetchWallOfTrustData();
    setEmbedLink(`http://echotrust.vercel.app/walloftrust/${echoId}`);
  }, [echoId]);

  const renderTweetEmbed = (index) => {
    if (embedData.tweetIds && embedData.tweetIds.length > index) {
      return <Tweet id={embedData.tweetIds[index]} />;
    }
    return null;
  };

  const renderInstagramEmbed = (index) => {
    if (embedData.instagramUrls && embedData.instagramUrls.length > index) {
      const postId = getPostIdFromUrl(embedData.instagramUrls[index]);
      if (postId) {
        return (
          <iframe
            className="w-full h-full"
            src={`https://www.instagram.com/p/${postId}/embed`}
            frameBorder="0"
            allowTransparency="true"
            allow="encrypted-media"
            title={`Instagram Post ${index}`}
          />
        );
      }
    }
    return null;
  };

  const smallBoxIndices = [1, 6, 4, 3, 7, 8, 10, 11, 12, 14, 17, 18, 19, 22];
  const largeBoxIndices = [0, 2, 5, 9, 15, 16, 20, 21];

  // Function to shuffle an array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap
    }
    return array;
  };

  // Combine and shuffle YouTube URLs and reviews
  const combinedData = shuffleArray([
    ...embedData.youtubeUrls.map((url) => ({ type: "youtube", content: url })),
    ...reviews.map((review) => ({ type: "review", content: review })),
  ]);

  const combinedLargeData = shuffleArray([
    ...embedData.tweetIds.map((id) => ({ type: "tweet", content: id })),
    ...embedData.instagramUrls.map((url) => ({
      type: "instagram",
      content: url,
    })),
  ]);
  const isEmpty =
    combinedData.length === 0 &&
    embedData.tweetIds.length === 0 &&
    embedData.instagramUrls.length === 0;

  // Map the shuffled data to smallBoxIndices, filling with "empty" if needed
  const filledData = smallBoxIndices.map(
    (_, index) => combinedData[index] || { type: "empty" }
  );

  const filledLargeData = largeBoxIndices.map(
    (_, index) => combinedLargeData[index] || { type: "empty" }
  );
  const deleteEmbed = async (embedType, embedValue) => {
    console.log("deleteEmbed called with:", { embedType, embedValue });

    toast.promise(
      (async () => {
        // Sending the DELETE request to the specified API endpoint
        const response = await fetch(`/api/walloftrust/${echoId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json", // Set the content type to JSON
          },
          body: JSON.stringify({ embedType, embedValue }), // Send embedType and embedValue in the request body
        });

        // Log the response status
        console.log("Response Status:", response.status);

        // Check if the response is not OK
        if (!response.ok) {
          // Attempt to parse the response as JSON for detailed error messages
          let errorData;
          try {
            errorData = await response.json();
          } catch (jsonError) {
            console.error("Failed to parse error response as JSON:", jsonError);
            const text = await response.text(); // Get response as text to see if it's HTML or another format
            console.error("Response text:", text);
            throw new Error("Failed to delete embed: Unable to parse response");
          }

          console.error(
            "Failed to delete embed:",
            errorData.message || "Unknown error"
          );
          throw new Error(errorData.message || "Unknown error"); // Throw an error to trigger the toast error message
        }

        // Parse the successful response data
        const data = await response.json();
        console.log("Embed deleted successfully:", data);

        // Optionally, update your state here if needed to remove the deleted embed from the UI

        return data; // Return the successful data for the toast success message
      })(),
      {
        loading: "Deleting embed...",
        success: <b>Embedding deleted successfully!</b>,
        error: (error) => <b>Error deleting embed: {error.message}</b>,
      }
    );
  };

  function truncateText(text, wordLimit) {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  }

  const renderSmallBox = (index) => {
    const data = filledData[index];

    return (
      <div className="relative w-full h-full">
        {/* Minus Icon */}

        {data.type === "youtube" ? (
          <>
            <CiSquareMinus
              className="absolute top-3.5 right-1 bg-black text-white cursor-pointer hover:text-gray-200 transition duration-300 z-10"
              size={30}
              onClick={() => deleteEmbed("youtube", data.content)} // Function to handle removal
            />
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={data.content}
              frameBorder="0"
              allowFullScreen
              title={`YouTube Video ${index}`}
              style={{ zIndex: 1 }}
            />
          </>
        ) : data.type === "review" ? (
          <>
            <CiSquareMinus
              className="absolute top-3.5 right-1 bg-black text-white cursor-pointer hover:text-gray-200 transition duration-300 z-10"
              size={30}
              onClick={() => deleteEmbed("review", data.content._id)} // Function to handle removal
            />

            <div
              key={data.content._id}
              className="bg-slate-900 text-white p-4 rounded-md h-full w-full"
            >
              <div className="">
                <div className="flex gap-3 justify-between items-center h-full w-full">
                  <div className="flex items-center gap-3">
                    {data.content.userimageurl ? (
                      <img
                        src={data.content.userimageurl}
                        alt="User Image"
                        className="h-8 w-8 rounded-full bg-black"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/64x64/000000/FFFFFF?text=No+Image";
                        }}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-black"></div>
                    )}
                    <span>{data.content.username}</span>
                  </div>
                </div>
                <div className="mt-3 italic font-poppins font-semibold">
                  - {truncateText(data.content.note, 30)}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-black w-full h-full" />
        )}
      </div>
    );
  };

  const renderLargeBox = (index) => {
    const data = filledLargeData[index];

    return (
      <div className="relative w-full h-full">
        {/* Minus Icon */}
        <CiSquareMinus
          className="absolute top-3.5 right-1 bg-black text-white cursor-pointer hover:text-gray-200 transition duration-300 z-10"
          size={30}
          onClick={() => deleteEmbed(data.type, data.content)} // Function to handle removal
        />

        {data?.type === "tweet" ? (
          <div
            className="w-full h-full flex flex-start overflow-hidden"
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              margin: 0,
              padding: 0,
            }}
          >
            <div className="w-full h-full flex items-start">
              <Tweet id={data.content} />
            </div>
          </div>
        ) : data?.type === "instagram" ? (
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.instagram.com/p/${getPostIdFromUrl(
              data.content
            )}/embed`}
            frameBorder="0"
            allowTransparency="true"
            allow="encrypted-media"
            title={`Instagram Post ${index}`}
          />
        ) : (
          <div className="bg-black w-full h-full" />
        )}
      </div>
    );
  };
  

  return (
    <div className="bg-black">
      {isEmpty ? (
        <div className="flex flex-col items-center justify-start h-screen">
          <h1 className="text-white text-6xl font-monte font-extrabold mt-20">
            Why so empty?
          </h1>
          <h2 className="font-monte mt-3 font-bold">
            Start embeding to the WallOfTrust
          </h2>
        </div>
      ) : (
        <>
          <div
            className="grid h-[2200px] grid-cols-6 bg-black px-3 py-3 gap-2 grid-rows-auto"
            style={{ gridTemplateRows: "repeat(10, 200px)" }}
          >
            <div className="col-span-2 row-span-2 flex ">
              {" "}
              {renderLargeBox(1)}
            </div>
            <div className="col-span-2 row-span-1  flex">
              {renderSmallBox(0)}
            </div>
            <div className="col-span-2 row-span-2 flex">
              {renderLargeBox(2)}
            </div>
            <div className="col-span-2 row-span-1  flex ">
              {renderSmallBox(1)}
            </div>
            <div className="col-span-2 row-span-1 flex ">
              {renderSmallBox(2)}
            </div>
            <div className="col-span-2 row-span-1 flex">
              {renderSmallBox(3)}
            </div>
            <div className="col-span-2 row-span-1 flex">
              {renderSmallBox(4)}
            </div>
            <div className="col-span-2 row-span-2 flex">
              {renderLargeBox(3)}
            </div>
            <div className="col-span-2 row-span-1 flex">
              {renderSmallBox(5)}
            </div>
            <div className="col-span-2 row-span-1 flex">
              {renderSmallBox(6)}
            </div>
            <div className="col-span-2 row-span-1 flex">
              {renderSmallBox(7)}
            </div>
            <div className="col-span-2 row-span-1 flex">
              {renderSmallBox(8)}
            </div>
            <div className="col-span-2 row-span-1 flex">
              {renderSmallBox(9)}
            </div>
            <div className="col-span-2 row-span-2 flex">
              {renderLargeBox(4)}
            </div>
            <div className="col-span-2 row-span-2 flex ">
              {renderLargeBox(5)}
            </div>
            <div className="col-span-2 row-span-2 flex">
              {renderLargeBox(6)}
            </div>
            <div className="col-span-2 row-span-1 flex">
              {renderSmallBox(10)}
            </div>
            <div className="col-span-2 row-span-1 flex">
              {renderSmallBox(11)}
            </div>
            <div className="col-span-2 row-span-1 flex">
              {renderSmallBox(12)}
            </div>
            <div className="col-span-2 row-span-2 flex">
              {renderLargeBox(7)}
            </div>
            <div className="col-span-2 row-span-2 flex">
              {renderLargeBox(0)}
            </div>
            <div className="col-span-2 row-span-1 flex">
              {renderSmallBox(13)}
            </div>
          </div>
          <div className="text-white p-4 rounded-md shadow-lg transition duration-300 ease-in-out flex items-center justify-center space-x-2">
            <button
              onClick={() => setShowEmbedLink(!showEmbedLink)}
              className=" relative -right-11  bg-purple-600 text-white py-2 px-6 rounded-3xl shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:bg-white hover:text-purple-600 z-10"
            >
              Embed Wall
            </button>

            {showEmbedLink && (
              <div className="flex items-center bg-gray-800 p-2 rounded-3xl shadow-inner transition duration-300 ease-in-out z-0 relative">
                <div className="flex items-center bg-gray-900 rounded-md border border-gray-700 overflow-hidden pl-8">
                  <code className="text-sm text-gray-200 px-3 overflow-x-auto ">
                    {`<iframe src="${embedLink}" width="1200" height="800"></iframe>`}
                  </code>
                  <button
                    onClick={handleCopy}
                    className="ml-3 text-purple-500 hover:text-purple-700 focus:outline-none transition duration-300 ease-in-out"
                  >
                    <FaCopy className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default WallOfTrust;
