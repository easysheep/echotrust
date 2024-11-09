"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SocialMediaIntegration from "@/app/embeds/Embed";
import Analytics from "../../../components/Analytics";
import LineChart from "@/components/LineChart";
import WallOfTrust from "@/components/WallOfTrust";
import LoadingAnimation from "@/components/LoadingAnimation";
import toast from "react-hot-toast";
const Dashboard = ({ params }) => {
  const echo_id = params.echo_id; // This is now the MongoDB _id
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]); // To hold filtered reviews
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStar, setSelectedStar] = useState(null); // State to store the selected star filter
  const [selectedColumn, setSelectedColumn] = useState("review");
  const [wallData, setWallData] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Delay between children animations
      },
    },
  };

  // Animation variants for each review card
  const itemVariants = {
    hidden: { opacity: 0, y: 50 }, // Start slightly down the screen
    show: { opacity: 1, y: 0 }, // Animate to normal position
  };

  const getReviews = async () => {
    try {
      const response = await fetch(`/api/dashboard/${echo_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Reviews fetched successfully:", result.reviews);
        setReviews(result.reviews);
        setFilteredReviews(result.reviews); // Initially display all reviews
        setLoading(false);
      } else {
        console.error("Failed to fetch reviews");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setLoading(false);
    }
  };

  // Filter reviews based on the selected star rating
  const filterReviewsByStars = (starRating) => {
    setSelectedStar(starRating);
    if (starRating) {
      const filtered = reviews.filter((review) => review.stars === starRating);
      setFilteredReviews(filtered);
    } else {
      setFilteredReviews(reviews); // Show all reviews if no star filter is selected
    }
  };

  useEffect(() => {
    getReviews();
    // getWallOfTrustData();
  }, [echo_id]);

  if (loading) {
    return <LoadingAnimation></LoadingAnimation>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const totalReviews = filteredReviews.length;
  const averageRating =
    totalReviews > 0
      ? (
          filteredReviews.reduce((acc, review) => acc + review.stars, 0) /
          totalReviews
        ).toFixed(1) // Rounds to one decimal place
      : 0; // Default to 0 if there are no reviews

  const averageReviewLength =
    totalReviews > 0
      ? Math.round(
          filteredReviews.reduce(
            (acc, review) => acc + (review.note ? review.note.length : 0),
            0
          ) / totalReviews
        ) // Rounds to the nearest integer
      : 0; // Default to 0 if there are no reviews

  const averageReviewWords =
    totalReviews > 0
      ? Math.round(
          filteredReviews.reduce(
            (acc, review) =>
              acc + (review.note ? review.note.split(" ").length : 0),
            0
          ) / totalReviews
        ) // Rounds to the nearest integer
      : 0; // Default to 0 if there are no reviews

  const handlePlusClick = async (reviewId) => {
    try {
      console.log("Echo ID:", echo_id); // Log echo_id to ensure it's available
      console.log("Review ID:", reviewId); // Log reviewId to ensure it's passed correctly

      // Using toast.promise to handle the asynchronous operation
      toast.promise(
        (async () => {
          const response = await fetch(`/api/walloftrust/${echo_id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ reviewId }), // Pass reviewId in the body
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }

          const data = await response.json();
          console.log("Success:", data);
          return data; // Return data for success message
        })(),
        {
          loading: "Embedding review...",
          success: <b>Review Embedded Successfully!</b>,
          error: (error) => <b>Failed to embed review: {error.message}</b>,
        }
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  function truncateText(text, wordLimit) {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  }

  const renderContent = () => {
    switch (selectedColumn) {
      case "review":
        return (
          <div className="flex flex-grow min-h-0">
            <div className="leftcol w-1/6 bg-[#0A0A0A]">
              {/* Star Filter Buttons */}
              <div className="flex flex-col h-full">
                <div className="flex flex-col flex-grow">
                  <div
                    className={`flex items-center px-2 py-3 transition-colors duration-300 ${
                      selectedStar === null ? "bg-purple-500" : "bg-[#0A0A0A]"
                    } text-white hover:bg-purple-700 focus:ring focus:ring-purple-300 cursor-pointer`}
                    onClick={() => filterReviewsByStars(null)}
                    style={{ borderRadius: "0" }}
                  >
                    <span className="text-yellow-400 mr-2">★</span>
                    All Stars
                  </div>

                  {[1, 2, 3, 4, 5].map((star, index) => (
                    <div
                      key={star}
                      className={`flex items-center px-2 py-3 transition-colors duration-300 ${
                        selectedStar === star ? "bg-purple-500" : "bg-[#0A0A0A]"
                      } text-white hover:bg-purple-700 focus:ring focus:ring-purple-300 cursor-pointer`}
                      onClick={() => filterReviewsByStars(star)}
                      style={{
                        borderRadius: "0",
                        marginTop: index === 0 ? "0" : "-1px", // Ensure connected bars
                      }}
                    >
                      {star}
                      <span className="text-yellow-400 ml-2 text-xl">★</span>
                    </div>
                  ))}
                </div>

                <div className="flex-grow bg-[#0A0A0A]"></div>
              </div>
            </div>

            <div className="rightcol w-5/6 bg-black px-4">
              {filteredReviews.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  {filteredReviews.map((review) => (
                    <motion.div
                      key={review._id}
                      className="bg-slate-900 text-white p-4 rounded-md"
                      variants={itemVariants}
                    >
                      <div>
                        <div className="flex gap-3 justify-between items-center">
                          {/* Image and Username on the Left */}
                          <div className="flex items-center gap-3">
                            {review.userimageurl ? (
                              <img
                                src={review.userimageurl}
                                alt="User Image"
                                className="h-8 w-8 rounded-full bg-black"
                                onError={(e) => {
                                  e.target.src =
                                    "https://via.placeholder.com/64x64/000000/FFFFFF?text=No+Image"; // Fallback image
                                }}
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-black"></div> // Black fallback div
                            )}
                            <span>{review.username}</span>
                          </div>

                          {/* Plus Sign on the Right */}
                          <span
                            className="text-xl text-white cursor-pointer"
                            onClick={() => handlePlusClick(review._id)}
                          >
                            +
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 italic font-poppins font-semibold">
                        - {truncateText(review.note, 30)}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <p className="text-white">No reviews found</p>
              )}
            </div>
          </div>
        );
      case "embedding":
        return <SocialMediaIntegration echo_id={echo_id} />;
      case "analytics":
        return (
          // <div className="bg-black flex">
          //   <div className="leftsd w-2/6 flex flex-col items-center flex-start">
          //     <Analytics reviews={filteredReviews} />
          //     <div className="flex justify-center space-x-4 items-center">
          //       {" "}
          //       {/* Add margin on top for spacing */}
          //       <div className="bg-black rounded-lg shadow-md text-center">
          //         <p className="text-6xl">{averageRating}</p>
          //         <h3 className="text-sm font-monte ">Average Rating</h3>
          //       </div>
          //       <div className="bg-black  rounded-lg shadow-md text-center">
          //         <p className="text-6xl">{totalReviews}</p>
          //         <h3 className="text-sm font-monte ">Number of Reviews</h3>
          //       </div>
          //     </div>
          //   </div>
          //   <div className="rightsd w-4/6 flex flex-col ">
          //     {" "}
          //     <LineChart reviews={reviews} />
          //     <div className="bg-black p-4 rounded-lg shadow-md text-center">
          //       <p className="text-xl">{averageReviewLength} characters</p>
          //       <h3 className="text-lg font-bold">Average Review Length</h3>
          //     </div>
          //     <div className="bg-black p-4 rounded-lg shadow-md text-center">
          //       <p className="text-xl">{averageReviewWords} words</p>
          //       <h3 className="text-lg font-bold">Average Words Per Review </h3>
          //     </div>
          //   </div>
          // </div>

          <div className="bg-black flex flex-col px-6 py-4">
            {/* Top container for Analytics and LineChart */}
            <div className="flex w-full">
              <div className="w-2/6 flex flex-col items-center">
                <Analytics reviews={filteredReviews} />
              </div>
              <div className="w-4/6">
                <LineChart reviews={reviews} />
              </div>
            </div>

            {/* Bottom container for the four statistics */}
            <div className="flex flex-wrap justify-between space-x-4">
              <div className="bg-black rounded-lg shadow-md text-center p-4">
                <p className="text-6xl">{averageRating}</p>
                <h3 className="text-sm font-monte">Average Rating</h3>
              </div>
              <div className="bg-black rounded-lg shadow-md text-center p-4">
                <p className="text-6xl">{totalReviews}</p>
                <h3 className="text-sm font-monte">Number of Reviews</h3>
              </div>
              <div className="bg-black rounded-lg shadow-md text-center p-4">
                <p className="text-6xl">{averageReviewLength}</p>
                <h3 className="text-sm font-monte">Average Review Length (characters)</h3>
              </div>
              <div className="bg-black rounded-lg shadow-md text-center p-4">
                
                <p className="text-6xl">{averageReviewWords}</p>
                <h3 className="text-sm font-monte">Average Words Per Review</h3>
              </div>
            </div>
          </div>
        );
      case "walloftrust":
        return <WallOfTrust echoId={echo_id} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-black px-3 py-6 min-h-screen">
      {/* Dashboard Title */}
      <div className="text-white font-protest text-6xl font-extrabold flex justify-center items-center">
        Dashboard
      </div>

      {/* Grid for Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 my-6">
        <button
          className={`text-white font-extrabold text-lg font-poppins transition-colors duration-300 py-2 ${
            selectedColumn === "review" ? "bg-purple-500" : "bg-[#0A0A0A]"
          }`}
          onClick={() => setSelectedColumn("review")}
        >
          Review
        </button>
        <button
          className={`text-white font-extrabold text-lg font-poppins transition-colors duration-300 py-2 ${
            selectedColumn === "embedding" ? "bg-purple-500" : "bg-[#0A0A0A]"
          }`}
          onClick={() => setSelectedColumn("embedding")}
        >
          Embedding
        </button>
        <button
          className={`text-white font-extrabold text-lg font-poppins transition-colors duration-300 py-2 ${
            selectedColumn === "analytics" ? "bg-purple-500" : "bg-[#0A0A0A]"
          }`}
          onClick={() => setSelectedColumn("analytics")}
        >
          Analytics
        </button>
        <button
          className={`text-white font-extrabold text-lg font-poppins transition-colors duration-300 py-2 ${
            selectedColumn === "walloftrust" ? "bg-purple-500" : "bg-[#0A0A0A]"
          }`}
          onClick={() => setSelectedColumn("walloftrust")}
        >
          Wall of Trust
        </button>
      </div>

      {/* Content based on selected column */}
      <div className="bg-gray-800 text-white rounded-md h-fit-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
