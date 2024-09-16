"use client";
import React, { useEffect, useState } from "react";

const Dashboard = ({ params }) => {
  const echo_id = params.echo_id; // This is now the MongoDB _id
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]); // To hold filtered reviews
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStar, setSelectedStar] = useState(null); // State to store the selected star filter

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
  }, [echo_id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // return (
  //   <div>
  //     <h1>Reviews</h1>

  //     {/* Star filter buttons */}
  //     <div className="flex space-x-2 my-4">
  //       <button
  //         className={`px-4 py-2 ${selectedStar === null ? "bg-blue-500" : "bg-gray-300"} text-white`}
  //         onClick={() => filterReviewsByStars(null)}
  //       >
  //         All Stars
  //       </button>
  //       {[1, 2, 3, 4, 5].map((star) => (
  //         <button
  //           key={star}
  //           className={`px-4 py-2 ${selectedStar === star ? "bg-blue-500" : "bg-gray-300"} text-white`}
  //           onClick={() => filterReviewsByStars(star)}
  //         >
  //           {star} Star{star > 1 ? "s" : ""}
  //         </button>
  //       ))}
  //     </div>

  //     {/* Reviews list */}
  //     {filteredReviews.length > 0 ? (
  //       filteredReviews.map((review) => (
  //         <div key={review._id} className="bg-[#5D5DFF] my-2 w-96 text-white p-4 rounded-md">
  //           <p>Stars: {review.stars}</p>
  //           <p>Note: {review.note}</p>
  //           <p>{review.username}</p>
  //           {review.userimageurl ? (
  //             <img
  //               src={review.userimageurl}
  //               alt="User Image"
  //               className="h-16 w-16 rounded-full bg-black"
  //               onError={(e) => {
  //                 e.target.src =
  //                   "https://via.placeholder.com/64x64/000000/FFFFFF?text=No+Image"; // Black image fallback
  //               }}
  //             />
  //           ) : (
  //             <div className="h-16 w-16 rounded-full bg-black"></div> // Black div as fallback
  //           )}
  //         </div>
  //       ))
  //     ) : (
  //       <p>No reviews found</p>
  //     )}
  //   </div>
  // );
  return (
    <div>
      <h1>Reviews</h1>
  
      {/* Star filter buttons */}
      <div className="flex space-x-2 my-4">
        <button
          className={`px-4 py-2 ${selectedStar === null ? "bg-blue-500" : "bg-gray-300"} text-white`}
          onClick={() => filterReviewsByStars(null)}
        >
          All Stars
        </button>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`px-4 py-2 ${selectedStar === star ? "bg-blue-500" : "bg-gray-300"} text-white`}
            onClick={() => filterReviewsByStars(star)}
          >
            {star} Star{star > 1 ? "s" : ""}
          </button>
        ))}
      </div>
  
      {/* Reviews list in grid layout */}
      {filteredReviews.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {filteredReviews.map((review) => (
            <div key={review._id} className="bg-[#5D5DFF] text-white p-4 rounded-md">
              <p>Stars: {review.stars}</p>
              <p>Note: {review.note}</p>
              <p>{review.username}</p>
              {review.userimageurl ? (
                <img
                  src={review.userimageurl}
                  alt="User Image"
                  className="h-16 w-16 rounded-full bg-black"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/64x64/000000/FFFFFF?text=No+Image"; // Black image fallback
                  }}
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-black"></div> // Black div as fallback
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No reviews found</p>
      )}
    </div>
  );


};



export default Dashboard;
