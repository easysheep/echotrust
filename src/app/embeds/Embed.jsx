// "use client";
// import React, { useState } from "react";
// import { Tweet } from 'react-tweet';

// const Embed = () => {
//   const [tweetId, setTweetId] = useState("");
//   const [tweetIds, setTweetIds] = useState([]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (tweetId) {
//       setTweetIds([...tweetIds, tweetId]);
//       setTweetId(""); // Clear the input after submission
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4">Submit Tweet ID</h2>

//       {/* Form to submit tweet IDs */}
//       <form onSubmit={handleSubmit} className="flex items-center space-x-4 mb-6">
//         <input
//           type="text"
//           value={tweetId}
//           onChange={(e) => setTweetId(e.target.value)}
//           placeholder="Enter Tweet ID"
//           className="p-2 border rounded-lg w-full max-w-md"
//         />
//         <button
//           type="submit"
//           className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700"
//         >
//           Submit
//         </button>
//       </form>

//       {/* Display submitted tweets in grid format */}
//       <h2 className="text-2xl font-bold mb-4">Testimonials</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {tweetIds.map((id, index) => (
//           <div key={index} className="p-4 bg-white shadow-md rounded-lg">
//             <Tweet id={id} />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Embed;

// "use client";
// import React, { useState } from "react";

// const Embed = () => {
//   const [videoUrl, setVideoUrl] = useState("");
//   const [embedUrls, setEmbedUrls] = useState([]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const videoId = extractVideoID(videoUrl);
//     if (videoId) {
//       const newEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
//       setEmbedUrls([...embedUrls, newEmbedUrl]);
//       setVideoUrl(""); // Clear the input field after submission
//     } else {
//       alert("Invalid YouTube URL. Please enter a valid link.");
//     }
//   };

//   const extractVideoID = (url) => {
//     const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
//     const match = url.match(regex);
//     return match ? match[1] : null;
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-3xl font-bold text-center mb-6">Embed YouTube Videos</h1>

//       {/* Form for URL Submission */}
//       <form onSubmit={handleSubmit} className="flex flex-col items-center mb-8">
//         <label htmlFor="ytLink" className="text-lg mb-2">Paste YouTube Video URL:</label>
//         <input
//           type="text"
//           id="ytLink"
//           value={videoUrl}
//           onChange={(e) => setVideoUrl(e.target.value)}
//           placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
//           className="border rounded-lg p-2 w-full max-w-lg mb-4 text-center"
//           required
//         />
//         <button
//           type="submit"
//           className="bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-purple-700 transition"
//         >
//           Embed Video
//         </button>
//       </form>

//       {/* Display Embedded Videos */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {embedUrls.map((embedUrl, index) => (
//           <div key={index} className="relative" style={{ paddingBottom: '56.25%' }}>
//             <iframe
//               className="absolute top-0 left-0 w-full h-full"
//               src={embedUrl}
//               frameBorder="0"
//               allowFullScreen
//               title={`Embedded YouTube Video ${index + 1}`}
//             ></iframe>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Embed;

"use client";
import React, { useState } from "react";

const InstagramEmbed = () => {
  const [postUrl, setPostUrl] = useState("");
  const [postUrls, setPostUrls] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (postUrl) {
      setPostUrls([...postUrls, postUrl]);
      setPostUrl(""); // Clear the input after submission
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Submit Instagram Post URL</h2>

      {/* Form to submit Instagram Post URLs */}
      <form onSubmit={handleSubmit} className="flex items-center space-x-4 mb-6">
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

      {/* Display submitted Instagram posts in grid format */}
      <h2 className="text-2xl font-bold mb-4">Instagram Posts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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

const getPostIdFromUrl = (url) => {
  const regex = /https:\/\/www.instagram.com\/p\/([a-zA-Z0-9-_]*)\/?/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export default InstagramEmbed;

