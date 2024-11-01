import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tweet } from "react-tweet";
import { CiSquarePlus } from "react-icons/ci";
const WallOfTrust = ({ echoId, isEmbed = false }) => {
  const [embedData, setEmbedData] = useState({
    tweetIds: [],
    youtubeUrls: [],
    instagramUrls: [],
  });
  const [reviews, setReviews] = useState([]);
  const [showEmbedLink, setShowEmbedLink] = useState(false);
  const [embedLink, setEmbedLink] = useState("");

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
    setEmbedLink(`http://localhost:3000/walloftrust/${echoId}`);
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

  // Map the shuffled data to smallBoxIndices, filling with "empty" if needed
  const filledData = smallBoxIndices.map(
    (_, index) => combinedData[index] || { type: "empty" }
  );

  const filledLargeData = largeBoxIndices.map(
    (_, index) => combinedLargeData[index] || { type: "empty" }
  );

  const renderSmallBox = (index) => {
    const data = filledData[index];

    if (data.type === "youtube") {
      return (
        <iframe
          className="w-full h-full"
          src={data.content}
          frameBorder="0"
          allowFullScreen
          title={`YouTube Video ${index}`}
        />
      );
    } else if (data.type === "review") {
      const review = data.content;
      return (
        <div
          key={review._id}
          className="bg-slate-900 text-white p-4 rounded-md h-full w-full"
        >
          <div className="">
            <div className="flex gap-3 justify-between items-center h-full w-full">
              <div className="flex items-center gap-3">
                {review.userimageurl ? (
                  <img
                    src={review.userimageurl}
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
                <span>{review.username}</span>
              </div>
            </div>
            <div className="mt-3 italic font-poppins font-semibold">
              - {review.note}
            </div>
          </div>
        </div>
      );
    }

    return <div className="bg-black w-full h-full" />;
  };

  const renderLargeBox = (index) => {
    const data = filledLargeData[index];

    if (data?.type === "tweet") {
      return (
        <div
          className="w-full h-full flex flex-start overflow-hidden"
          style={{ maxHeight: "100%", maxWidth: "100%", margin: 0, padding: 0 }}
        >
          <div className="w-full h-full flex items-start">
            <Tweet id={data.content} />
          </div>
        </div>
      );
    } else if (data?.type === "instagram") {
      const postId = getPostIdFromUrl(data.content);
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
    return <div className="bg-black w-full h-full" />;
  };

  return (
    <div className="bg-black">
      <div
        className="grid h-[2200px] grid-cols-6 bg-black px-3 py-3 gap-2 grid-rows-auto"
        style={{ gridTemplateRows: "repeat(10, 200px)" }}
      >
        <div className="col-span-2 row-span-2 flex "> {renderLargeBox(1)}</div>
        <div className="col-span-2 row-span-1  flex">{renderSmallBox(0)}</div>
        <div className="col-span-2 row-span-2 flex">{renderLargeBox(2)}</div>
        <div className="col-span-2 row-span-1  flex ">{renderSmallBox(1)}</div>
        <div className="col-span-2 row-span-1 flex ">{renderSmallBox(2)}</div>
        <div className="col-span-2 row-span-1 flex">{renderSmallBox(3)}</div>
        <div className="col-span-2 row-span-1 flex">{renderSmallBox(4)}</div>
        <div className="col-span-2 row-span-2 flex">{renderLargeBox(3)}</div>
        <div className="col-span-2 row-span-1 flex">{renderSmallBox(5)}</div>
        <div className="col-span-2 row-span-1 flex">{renderSmallBox(6)}</div>
        <div className="col-span-2 row-span-1 flex">{renderSmallBox(7)}</div>
        <div className="col-span-2 row-span-1 flex">{renderSmallBox(8)}</div>
        <div className="col-span-2 row-span-1 flex">{renderSmallBox(9)}</div>
        <div className="col-span-2 row-span-2 flex">{renderLargeBox(4)}</div>
        <div className="col-span-2 row-span-2 flex ">{renderLargeBox(5)}</div>
        <div className="col-span-2 row-span-2 flex">{renderLargeBox(6)}</div>
        <div className="col-span-2 row-span-1 flex">{renderSmallBox(10)}</div>
        <div className="col-span-2 row-span-1 flex">{renderSmallBox(11)}</div>
        <div className="col-span-2 row-span-1 flex">{renderSmallBox(12)}</div>
        <div className="col-span-2 row-span-2 flex">{renderLargeBox(7)}</div>
        <div className="col-span-2 row-span-2 flex">{renderLargeBox(0)}</div>
        <div className="col-span-2 row-span-1 flex">{renderSmallBox(13)}</div>
      </div>
      <div className="text-white mt-4 bg-black">
        <button
          onClick={() => setShowEmbedLink(!showEmbedLink)}
          className="bg-purple-700 hover:bg-purple-900 text-white py-2 px-4 rounded"
        >
          Embed Wall
        </button>
        {showEmbedLink && (
          <div className="mt-3 bg-black p-3 rounded text-white">
            <p>Embed this Wall of Trust:</p>
            <code>{`<iframe src="${embedLink}" width="600" height="800"></iframe>`}</code>
          </div>
        )}
      </div>
    </div>
  );
};

export default WallOfTrust;

// <div className="grid h-[2000px] grid-cols-6 bg-black px-3 py-3 gap-2 grid-rows-auto">
//   <div className="col-span-2 row-span-2 bg-blue-500 flex items-center justify-center"></div>
//   <div className="col-span-2 row-span-1 bg-blue-500 flex items-center justify-center"></div>
//   <div className="col-span-2 row-span-2 bg-blue-500 flex items-center justify-center"></div>
//   <div className="col-span-2 row-span-1 bg-red-500 flex items-center justify-center"></div>
//   <div className="col-span-2 row-span-1 bg-blue-500 flex items-center justify-center"></div>
//   <div className="col-span-2 row-span-1 bg-blue-500 flex items-center justify-center"></div>
//   <div className="col-span-2 row-span-1 bg-blue-500 flex items-center justify-center"></div>
//   <div className="col-span-2 row-span-2 bg-red-500 flex items-center justify-center"></div>
//   <div className="col-span-2 row-span-1 bg-blue-500 flex items-center justify-center"></div>
//   <div className="col-span-2 row-span-1 bg-blue-500 flex items-center justify-center"></div>
//   <div className="col-span-2 row-span-1 bg-blue-500 flex items-center justify-center"></div>
//   <div className="col-span-2 row-span-1 bg-blue-500 flex items-center justify-center"></div>
//   <div className="col-span-2 row-span-1 bg-blue-500 flex items-center justify-center"></div>
//   <div className="col-span-2 row-span-2 bg-red-500 flex items-center justify-center"></div>
//   <div className="col-span-2 row-span-2 bg-red-500 flex items-center justify-center"></div>
//   <div className="col-span-2 row-span-2 bg-red-500 flex items-center justify-center"></div>
//   <div className="col-span-2 row-span-1 bg-blue-500 flex items-center justify-center"></div>
//   <div className="col-span-2 row-span-1 bg-blue-500 flex items-center justify-center"></div>
//   <div className="col-span-2 row-span-1 bg-blue-500 flex items-center justify-center"></div>
//   <div className="col-span-2 row-span-2 bg-red-500 flex items-center justify-center"></div>
//   <div className="col-span-2 row-span-2 bg-red-500 flex items-center justify-center"></div>
//   <div className="col-span-2 row-span-1 bg-blue-500 flex items-center justify-center"></div>

// </div>
