"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { motion } from "framer-motion"; // Import motion
import Navbar from "../components/Navbar";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import LoadingAnimation from "@/components/LoadingAnimation";
import toast from "react-hot-toast";
const EchoList = () => {
  const [echoes, setEchoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const fetchEchoes = async () => {
        try {
          console.log(user);
          const response = await axios.get(`/api/echolist/${user.id}`);
          setEchoes(response.data);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };

      fetchEchoes();
    }
  }, [user]);

  const deleteEcho = async (echoId) => {
    // Display a loading toast before starting the delete operation
    toast.loading("Deleting echo...", { id: "delete-toast" });

    try {
      await axios.delete(`/api/echolist/${user.id}?echoId=${echoId}`);

      // Update state to remove the deleted echo from the list
      setEchoes((prevEchoes) =>
        prevEchoes.filter((echo) => echo._id !== echoId)
      );

      // Replace the loading toast with a success toast
      toast.success("Echo deleted successfully!", {
        id: "delete-toast",
        icon: "✅",
        style: {
          border: "1px solid #34D399",
          padding: "16px",
          color: "#4CAF50",
        },
      });
    } catch (err) {
      console.error("Error deleting echo:", err);
      setError(err);

      // Replace the loading toast with an error toast if deletion fails
      toast.error("Failed to delete echo. Please try again.", {
        id: "delete-toast",
        icon: "❌",
        style: {
          border: "1px solid #F87171",
          padding: "16px",
          color: "#DC2626",
        },
      });
    }
  };

  function handleReviewPageVisit(echo_name) {
    router.push(`/reviewlandingpage/${echo_name}`);
  }

  if (loading) return <LoadingAnimation></LoadingAnimation>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="w-full p-10 bg-black min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-8 text-center">Your Echoes</h1>
      {echoes.length === 0 ? (
        <p className="text-center text-lg">No echoes found</p>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.4, // Stagger animation
              },
            },
          }}
        >
          {echoes.map((echo) => (
            <motion.div
              key={echo._id}
              className="bg-[#1B1B1F] text-white p-6 rounded-lg cursor-pointer flex flex-col justify-between border-2 border-transparent transition duration-300 ease-in-out relative"
              style={{
                boxShadow: "0 0 10px rgba(92, 47, 197, 0.7)", // Glowing effect
              }}
              variants={{
                hidden: {
                  opacity: 0,
                  y: 20,
                  scale: 0.95, // Initial scale
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1, // Final scale
                  transition: {
                    type: "spring", // Use spring for bounce effect
                    stiffness: 100,
                    damping: 10,
                  },
                },
              }}
              whileHover={{
                scale: 1.05, // Scale up on hover
                boxShadow: "0 0 20px rgba(92, 47, 197, 1)", // More intense glow on hover
                borderColor: "#5C2FC5", // Change border color on hover
              }}
            >
              <Link
                href={`/dashboard/${echo._id}`}
                className="flex flex-col w-full"
              >
                <div className="">
                  <img
                    src={echo.echo_logo || "https://via.placeholder.com/150"} // Fallback image source
                    alt={echo.echo_name} // Image alt text
                    className="w-full h-40 object-cover rounded-md mb-4" // Styling the image
                  />
                  <h2 className="text-3xl font-semibold text-white font-monte">
                    {echo.echo_name}
                  </h2>
                </div>

                <p className="text-lg mt-2 font-light font-poppins">
                  {echo.echo_title}
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  Posted As: {echo.sender_name}
                </p>
              </Link>

              <div className="absolute bottom-24 right-4 flex items-center cursor-pointer">
                <FaExternalLinkAlt
                  onClick={() => handleReviewPageVisit(echo.echo_name)}
                  size={20}
                  className="text-white hover:text-blue-500 hover:scale-110 cursor-pointer transition-transform duration-200"
                />
              </div>

              {/* Delete Button */}
              <button
                onClick={() => deleteEcho(echo._id)}
                className="bg-[#5C2FC5] text-white p-2 rounded mt-4"
              >
                Delete Echo
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default EchoList;
