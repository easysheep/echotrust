"use client"
import React, { useEffect, useState } from "react";

const Dashboard = ({ params }) => {
  const echo_id = params.echo_id; // This is now the MongoDB _id
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setLoading(false);// Set the reviews state with the fetched data
      } else {
        console.error("Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
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

  return (
    <div>
      <h1>Reviews</h1>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review._id} className="bg-[#5D5DFF] my-2 w-96 text-white">
            <p>Stars: {review.stars}</p>
            <p>Note: {review.note}</p>
            <p>{review.username}</p>
            {/* <img src={review.userimageurl} alt="" className="h-16 w-16" /> */}
            {review.userimageurl ? (
            <img
              src={review.userimageurl}
              alt="User Image"
              className="h-16 w-16 rounded-full bg-black"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/64x64/000000/FFFFFF?text=No+Image"; // Black image fallback
              }}
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-black"></div> // Black div as fallback
          )}
          </div>
        ))
      ) : (
        <p>No reviews found</p>
      )}
    </div>
  );
};

export default Dashboard;
