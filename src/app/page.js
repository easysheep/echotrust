"use client";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/effect-fade";
import "swiper/css/effect-flip";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  EffectCoverflow,
  EffectFade,
  EffectFlip,
} from "swiper/modules";
import { ReactTyped } from "react-typed";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.5, type: "spring" },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 1, ease: "easeOut" },
    },
  };
  // Button Container: Staggered animation (starts after H1 animation)
  const buttonContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: 1, // Delay buttons until H1 is done
        staggerChildren: 0.2, // Stagger the button animations
      },
    },
  };

  // Individual Button Animation: Fade in with slight upward motion
  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const { isSignedIn, user } = useUser();
  const [userPlan, setUserPlan] = useState("free");
  const [allowedEchoes, setAllowedEchoes] = useState(10);
  const [currentEchoes, setCurrentEchoes] = useState(0);

  useEffect(() => {
    const fetchUserPlan = async () => {
      if (!user?.id) return;
      console.log("Fetching plan for user ID:", user.id);

      try {
        const response = await fetch(`/api/subscription/${user.id}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch subscription details");
        }

        const data = await response.json();
        setAllowedEchoes(data?.echoLimit || 10);
        setUserPlan(data?.plan || "free");

        // console.log("Plan and limit are " + data?.plan + " and " + data?.echoLimit);
      } catch (error) {
        console.error("Error fetching user plan:", error);
        setUserPlan("free");
      }
    };

    const fetchEchoes = async () => {
      try {
        const response = await fetch(`/api/echolist/${user?.id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setCurrentEchoes(data.length);
        console.log("Response data is:", data);
      } catch (error) {
        console.error("Error fetching echoes:", error);
      }
    };

    fetchEchoes();

    fetchUserPlan();
  }, [user]);

  const handleLinkClick = (event, redirectPath) => {
    if (!isSignedIn) {
      event.preventDefault();
      toast.error("You need to sign in to access echoes.");
      return;
    }

    if (currentEchoes >= allowedEchoes) {
      event.preventDefault();
      toast.error(
        "You have reached the maximum number of echoes allowed for your plan."
      );
    }
  };

  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);

  const pricingRef = useRef(null);
  const featuresRef = useRef(null);
  const customerRef = useRef(null);
  const introRef = useRef(null);

  const isInView1 = useInView(ref1, { once: false });
  const isInView2 = useInView(ref2, { once: false });
  const isInView3 = useInView(ref3, { once: false });
  const isInView4 = useInView(ref4, { once: false });
  const isInView5 = useInView(ref5, { once: false });

  const triggerAnimation = () => {
    if (introRef.current) {
      introRef.current.classList.remove("go");
      void introRef.current.offsetWidth;
      introRef.current.classList.add("go");
    }
  };

  useEffect(() => {
    triggerAnimation();
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (plan) => {
    if (!user) {
      alert("You need to be logged in to make a payment.");
      return;
    }

    const userId = user.id;
    const amount = plan === "pro" ? 1000 : 3400;
    const currency = "INR";

    const res = await fetch("/api/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount, currency }),
    });

    const data = await res.json();

    if (!data.id) {
      alert("Failed to create payment. Please try again.");
      return;
    }

    const isScriptLoaded = await loadRazorpayScript();

    if (!isScriptLoaded) {
      alert("Failed to load Razorpay SDK. Please try again.");
      return;
    }

    const options = {
      key: process.env.RZP_KEY,
      amount: data.amount,
      currency: data.currency,
      name: "EchoTrust",
      description: "Payment for subscription",
      order_id: data.id,
      handler: async function (response) {
        const updateRes = await fetch(`/api/subscription/${user.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, plan }),
        });

        const updateData = await updateRes.json();
        if (updateRes.ok) {
          alert("Payment successful! Subscription updated.");
          console.log("Subscription Details:", updateData);
        } else {
          alert("Payment successful, but failed to update subscription.");
        }
      },
      prefill: {
        name: user.fullName || "Your Name",
        email: user.primaryEmailAddress || "user@example.com",
        contact: user.phoneNumber || "1234567890",
      },
      theme: {
        color: "#800080",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <>
      <main className="bg-moving-gradient bg-[length:200%_200%] animate-gradient-move h-screen w-full flex flex-col ">
        <div className="flex items-center h-20 px-28 justify-between">
          <div className="flex gap-10 font-roboto font-medium ">
            <p className="text-white text-sm font-greek border-b-2 border-transparent hover:border-white transition-all cursor-pointer">
              <button
                onClick={() =>
                  pricingRef.current.scrollIntoView({ behavior: "smooth" })
                }
              >
                Pricing
              </button>
            </p>
            <p className="text-white text-sm  font-greek border-b-2 border-transparent hover:border-white transition-all cursor-pointer">
              <button
                onClick={() =>
                  featuresRef.current.scrollIntoView({ behavior: "smooth" })
                }
              >
                Features
              </button>
            </p>
            <p className="text-white text-sm font-greek border-b-2 border-transparent hover:border-white transition-all cursor-pointer">
              <button
                onClick={() =>
                  customerRef.current.scrollIntoView({ behavior: "smooth" })
                }
              >
                Customers
              </button>
            </p>
          </div>

          <div
            className="flex text-center text-5xl font-protest tracking-tight text-white"
            style={{
              textShadow:
                "0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4)",
            }}
          >
            E c h o T r u s t
          </div>

          <div className="flex gap-4">
            <SignedIn>
              <div className="flex items-center gap-2">
                <UserButton afterSignOutUrl="/" />
                <p className="text-white font-greek text-sm border-b-2 border-transparent hover:border-white transition-all cursor-default"></p>
              </div>
            </SignedIn>

            <SignedOut>
              <div className="flex items-center gap-10">
                <SignInButton className="text-sm  border-b-2 font-greek border-transparent hover:border-white transition-all cursor-pointer text-white" />
                <SignUpButton className="text-sm  border-b-2 font-greek border-transparent hover:border-white transition-all cursor-pointer text-white" />
              </div>
            </SignedOut>
          </div>
        </div>

        <div
          className="flex-grow flex items-center w-full justify-center gap-3 px-10 "
          style={{ height: "calc(100vh - 96px " }}
        >
          <div className="left w-full">
            <div className="text-extrabold text-5xl decoration-8 decoration-solid mb-5 text-white">
              <div className=" font-monte typewriter text-2xl ">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={textVariants}
                  className="font-monte typewriter text-2xl text-white mb-5"
                >
                  <ReactTyped
                    strings={[
                      "Tired of dealing with scattered, disorganized product reviews?",
                      "We’ve got you covered.",
                    ]}
                    typeSpeed={50}
                    backSpeed={0}
                    backDelay={1000}
                    startDelay={500}
                    loop={true}
                    showCursor={true}
                  />
                </motion.div>
              </div>

              <motion.h1
                initial="hidden"
                animate="visible"
                variants={textVariants}
                className="text-white text-6xl font-monte font-extrabold  mb-8"
              >
                Curate and showcase
                <br />
                feedback and testimonials
                <br />
                that elevate your brand,
              </motion.h1>

             
            </div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: { delay: 0.6, duration: 0.5 },
                },
              }}
              className="flex gap-4"
            >
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.8, duration: 0.4 },
                  },
                }}
              >
                <Link
                  href="/echo"
                  className={`bg-black text-white py-2 px-4 rounded-lg font-greek transition-all duration-500 ease-in-out 
                  hover:scale-110 hover:shadow-[0px_0px_15px_rgba(255,255,255,0.6)] ${
                    currentEchoes >= allowedEchoes
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={(e) => handleLinkClick(e, "/echo")}
                >
                  Create Echoes
                </Link>
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { delay: 1, duration: 0.4 },
                  },
                }}
              >
                <Link
                  href="/echolist"
                  className="bg-white text-black py-2 px-4 rounded-lg font-greek transition-all duration-500 ease-in-out 
                 hover:scale-110 hover:shadow-[0px_0px_15px_rgba(0,0,0,0.6)]"
                  onClick={(e) => handleLinkClick(e, "/echolist")}
                >
                  My Echoes
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>
      <div
        ref={featuresRef}
        className="flex-col flex items-center w-full justify-center gap-3 px-10 border-l-[20px] pt-10 border-r-[20px] border-black bg-black text-white"
      >
        <motion.div
          className="flex w-full gap-4 my-12"
          initial="hidden"
          animate={isInView1 ? "visible" : "hidden"}
          variants={containerVariants}
          ref={ref1}
        >
          <div className="w-2/6 flex justify-center bg-[#0A0A0A] h-96 text-7xl font-extrabold p-4 break-words font-monte rounded-lg">
            Gather feedback quick and easy.
          </div>

          <div className="w-4/6 flex justify-center">
            <img
              src="rev.png"
              alt="Image description here"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </motion.div>

        <motion.div
          className="flex-row-reverse w-full gap-4 flex my-12"
          initial="hidden"
          animate={isInView2 ? "visible" : "hidden"}
          variants={containerVariants}
          ref={ref2}
        >
          <div className="w-2/6 flex justify-center bg-[#0A0A0A] h-96 text-7xl font-extrabold p-4 break-words font-monte rounded-lg">
            Assemble reviews from across the web.
          </div>

          <div className="w-4/6 flex justify-center items-center border-2 border-white">
            <img
              src="embd.png"
              alt="Image description"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </motion.div>

        <motion.div
          className="flex w-full gap-4 my-12"
          initial="hidden"
          animate={isInView3 ? "visible" : "hidden"}
          variants={containerVariants}
          ref={ref3}
        >
          <div className="w-2/6 flex justify-center bg-[#0A0A0A] h-96 text-7xl font-extrabold p-4 break-words font-monte rounded-lg">
            Stunning reviewpage with all the necessary details
          </div>

          <div className="w-4/6 flex items-center justify-center">
            <img
              src="echo.png"
              alt="Image description"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </motion.div>

        <motion.div
          className="flex-row-reverse w-full gap-4 flex my-12"
          initial="hidden"
          animate={isInView4 ? "visible" : "hidden"}
          variants={containerVariants}
          ref={ref4}
        >
          <div className="w-2/6 flex justify-center bg-[#0A0A0A] h-96 text-7xl font-extrabold p-4 break-words font-monte rounded-lg">
            Embed the wall of trust.
          </div>

          <div className="w-4/6">
            <img
              src="wall3.png"
              alt="Image description"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </motion.div>

        <motion.div
          className="flex w-full gap-4 my-12"
          initial="hidden"
          animate={isInView5 ? "visible" : "hidden"}
          variants={containerVariants}
          ref={ref5}
        >
          <div className="w-2/6 flex justify-center bg-[#0A0A0A] h-96 text-7xl font-extrabold p-4 break-words font-monte rounded-lg">
            Dedicated feedback page and Dashboard.
          </div>

          <div className="w-4/6 flex justify-center items-center border-2 border-white">
            <img
              src="dash.png"
              alt="Image description"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </motion.div>
      </div>

      <div
        className="bg-[#5C2FC5] h-[calc(100vh-120px)] p-10 flex pt-20"
        ref={customerRef}
      >
        <div className="left w-2/6 text-center justify-center items-center flex-col flex">
          <h2 className="text-6xl font-extrabold mb-2 text-white font-monte break-words inline-flex items-center">
            Why Our Customers Love Us!
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="150"
              height="150"
              viewBox="0 0 24 24"
              fill="red"
              className="ml-2 inline-block"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </h2>
          <p className="text-lg text-black mt-6  font-protest">
            Explore the significant impact our product has had on our users'
            experiences. Delve into their testimonials to understand how we've
            transformed their lives for the better.
          </p>
        </div>

        <div className="right w-4/6 flex justify-center items-center relative ">
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y, EffectFlip]}
            spaceBetween={40}
            slidesPerView={1}
            centeredSlides={true}
            loop={true}
            navigation
            pagination={{ clickable: true }}
            effect="flip"
            flipEffect={{
              slideShadows: false,
            }}
            className="w-3/4 h-80 flex items-center justify-center"
          >
            {/* Example Aggregated Review Cards */}
            <SwiperSlide>
              <div className="flex items-center h-full w-full">
                <div className="cards h-4/6 w-5/6 bg-white text-black flex flex-col items-center justify-center rounded-lg shadow-lg mx-auto p-4">
                  <p className="text-lg font-semibold text-center">
                    "Outstanding service and quality!"
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    - Alex T., Sunrise Café
                  </p>
                  <p className="text-xs text-gray-500">Chicago, IL</p>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="flex items-center h-full w-full">
                <div className="cards h-4/6 w-5/6 bg-white text-black flex flex-col items-center justify-center rounded-lg shadow-lg mx-auto p-4">
                  <p className="text-lg font-semibold text-center">
                    "A perfect platform to grow my business online!"
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    - Jamie B., Tech Solutions
                  </p>
                  <p className="text-xs text-gray-500">San Diego, CA</p>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="flex items-center h-full w-full">
                <div className="cards h-4/6 w-5/6 bg-white text-black flex flex-col items-center justify-center rounded-lg shadow-lg mx-auto p-4">
                  <p className="text-lg font-semibold text-center">
                    "Highly recommend for boosting online presence!"
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    - Laura S., Blossom Florist
                  </p>
                  <p className="text-xs text-gray-500">Denver, CO</p>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="flex items-center h-full w-full">
                <div className="cards h-4/6 w-5/6 bg-white text-black flex flex-col items-center justify-center rounded-lg shadow-lg mx-auto p-4">
                  <p className="text-lg font-semibold text-center">
                    "Helped us attract more customers through online reviews!"
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    - Raj P., Ocean View Hotel
                  </p>
                  <p className="text-xs text-gray-500">Miami Beach, FL</p>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>

      <div className="bg-black h-[calc(100vh-20px)] flex p-10">
        <div className="w-4/6 flex h-full w-full gap-10 items-center">
          <div
            className={`w-1/3 bg-gray-100 rounded-lg h-5/6 p-6 flex flex-col items-center shadow-lg ${
              userPlan === "pro" || userPlan === "premium"
                ? "opacity-50 pointer-events-none"
                : ""
            }`}
          >
            <h3 className="text-2xl font-bold mb-4">Free Plan</h3>
            <p className="text-3xl font-extrabold mb-4">
              ₹0<span className="text-base font-normal">/month</span>
            </p>
            <ul className="text-left mb-6">
              <li className="mb-2">✔️ Basic Testimonials</li>
              <li className="mb-2">✔️ Limited Features</li>
              <li className="mb-2">✔️ 10 Testimonial Slots</li>
              <li className="text-gray-400">❌ Customizable Design</li>
              <li className="text-gray-400">❌ Priority Support</li>
              <li className="text-gray-400">❌ Analytics</li>
            </ul>
            <button
              className={`bg-purple-600 text-white px-4 py-2 rounded-lg ${
                userPlan === "free" ? "pointer-events-none opacity-50" : ""
              }`}
              onClick={() => handlePayment("free")}
            >
              {userPlan === "free" ? "Enrolled" : "Sign Up for Free"}
            </button>
          </div>

          <div
            className={`w-1/3 bg-gray-100 rounded-lg h-5/6 p-6 flex flex-col items-center shadow-lg border-4 relative ${
              userPlan === "premium"
                ? "opacity-50 pointer-events-none"
                : "border-purple-600"
            }`}
          >
            {userPlan === "premium" && (
              <div className="absolute top-0 right-0 transform -translate-y-3 translate-x-3 bg-purple-600 text-white text-xs font-bold py-2 px-6 rounded-full shadow-md">
                Popular
              </div>
            )}
            <h3 className="text-2xl font-bold mb-4">Pro Plan</h3>
            <p className="text-3xl font-extrabold mb-4">
              ₹1000<span className="text-base font-normal">/month</span>
            </p>
            <ul className="text-left mb-6">
              <li className="mb-2">✔️ Everything in Free Plan</li>
              <li className="mb-2">✔️ 50 Testimonial Slots</li>
              <li className="mb-2">✔️ Customizable Design</li>
              <li className="mb-2">✔️ Analytics Dashboard</li>
              <li className="text-gray-400">❌ Team Collaboration</li>
              <li className="text-gray-400">❌ Dedicated Support</li>
            </ul>
            <button
              className={`bg-purple-600 text-white px-4 py-2 rounded-lg ${
                userPlan === "pro" ? "pointer-events-none opacity-50" : ""
              }`}
              onClick={() => handlePayment("pro")}
            >
              {userPlan === "pro" ? "Enrolled" : "Get Pro"}
            </button>
          </div>

          <div
            className={`w-1/3 bg-gray-100 rounded-lg h-5/6 p-6 flex flex-col items-center shadow-lg ${
              userPlan === "premium" ? "" : ""
            }`}
          >
            <h3 className="text-2xl font-bold mb-4">Premium Plan</h3>
            <p className="text-3xl font-extrabold mb-4">
              ₹3400<span className="text-base font-normal">/year</span>
            </p>
            <ul className="text-left mb-6">
              <li className="mb-2">✔️ Everything in Pro Plan</li>
              <li className="mb-2">✔️ Unlimited Testimonials</li>
              <li className="mb-2">✔️ Team Collaboration</li>
              <li className="mb-2">✔️ Dedicated Support</li>
              <li className="mb-2">✔️ Advanced Analytics</li>
              <li className="mb-2">✔️ Premium Customization</li>
            </ul>
            <button
              className={`bg-purple-600 text-white px-4 py-2 rounded-lg ${
                userPlan === "premium" ? "pointer-events-none opacity-50" : ""
              }`}
              onClick={() => handlePayment("premium")}
            >
              {userPlan === "premium" ? "Enrolled" : "Get Premium"}
            </button>
          </div>
        </div>

        <div ref={pricingRef} className="w-2/6 text-white p-10 h-full">
          <div className="text-7xl font-extrabold font-monte">Pricing,</div>
          <div className="text-xl font-light mt-4 font-poppins">
            Affordable plans that fit your needs. Unlock premium features
            without breaking the bank.
          </div>
        </div>
      </div>

      <div className="w-full text-center p-4 bg-black text-white ">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} EchoTrust. All rights reserved.
        </p>
      </div>
    </>
  );
}










// <main className="bg-moving-gradient bg-[length:200%_200%] animate-gradient-move h-screen w-full flex flex-col ">
//         <div className="flex items-center h-20 px-28 justify-between">
//           <div className="flex gap-10 font-roboto font-medium ">
//             <p className="text-white text-sm font-greek border-b-2 border-transparent hover:border-white transition-all cursor-pointer">
//               <button
//                 onClick={() =>
//                   pricingRef.current.scrollIntoView({ behavior: "smooth" })
//                 }
//               >
//                 Pricing
//               </button>
//             </p>
//             <p className="text-white text-sm  font-greek border-b-2 border-transparent hover:border-white transition-all cursor-pointer">
//               <button
//                 onClick={() =>
//                   featuresRef.current.scrollIntoView({ behavior: "smooth" })
//                 }
//               >
//                 Features
//               </button>
//             </p>
//             <p className="text-white text-sm font-greek border-b-2 border-transparent hover:border-white transition-all cursor-pointer">
//               <button
//                 onClick={() =>
//                   customerRef.current.scrollIntoView({ behavior: "smooth" })
//                 }
//               >
//                 Customers
//               </button>
//             </p>
//           </div>

//           <div
//             className="flex text-center text-5xl font-protest tracking-tight text-white"
//             style={{
//               textShadow:
//                 "0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4)",
//             }}
//           >
//             E c h o T r u s t
//           </div>

//           <div className="flex gap-4">
//             <SignedIn>
//               <div className="flex items-center gap-2">
//                 <UserButton afterSignOutUrl="/" />
//                 <p className="text-white font-greek text-sm border-b-2 border-transparent hover:border-white transition-all cursor-default"></p>
//               </div>
//             </SignedIn>

//             <SignedOut>
//               <div className="flex items-center gap-10">
//                 <SignInButton className="text-sm  border-b-2 font-greek border-transparent hover:border-white transition-all cursor-pointer text-white" />
//                 <SignUpButton className="text-sm  border-b-2 font-greek border-transparent hover:border-white transition-all cursor-pointer text-white" />
//               </div>
//             </SignedOut>
//           </div>
//         </div>

//         <div
//           className="flex-grow flex items-center w-full justify-center gap-3 px-10 "
//           style={{ height: "calc(100vh - 96px " }}
//         >
//           <div className="left w-full">
//             <div className="text-extrabold text-5xl decoration-8 decoration-solid mb-5 text-white">
//               <div className=" font-monte typewriter text-2xl ">
//                 <motion.div
//                   initial="hidden"
//                   animate="visible"
//                   variants={textVariants}
//                   className="font-monte typewriter text-2xl text-white mb-5"
//                 >
//                   <ReactTyped
//                     strings={[
//                       "Tired of dealing with scattered, disorganized product reviews?",
//                       "We’ve got you covered.",
//                     ]}
//                     typeSpeed={50}
//                     backSpeed={0}
//                     backDelay={1000}
//                     startDelay={500}
//                     loop={true}
//                     showCursor={true}
//                   />
//                 </motion.div>
//               </div>

//               <motion.h1
//                 initial="hidden"
//                 animate="visible"
//                 variants={textVariants}
//                 className="text-white text-6xl font-monte font-extrabold  mb-8"
//               >
//                 Curate and showcase
//                 <br />
//                 feedback and testimonials
//                 <br />
//                 that elevate your brand,
//               </motion.h1>

             
//             </div>

//             <motion.div
//               initial="hidden"
//               animate="visible"
//               variants={{
//                 hidden: { opacity: 0, scale: 0.8 },
//                 visible: {
//                   opacity: 1,
//                   scale: 1,
//                   transition: { delay: 0.6, duration: 0.5 },
//                 },
//               }}
//               className="flex gap-4"
//             >
//               <motion.div
//                 variants={{
//                   hidden: { opacity: 0, y: 20 },
//                   visible: {
//                     opacity: 1,
//                     y: 0,
//                     transition: { delay: 0.8, duration: 0.4 },
//                   },
//                 }}
//               >
//                 <Link
//                   href="/echo"
//                   className={`bg-black text-white py-2 px-4 rounded-lg font-greek transition-all duration-500 ease-in-out 
//                   hover:scale-110 hover:shadow-[0px_0px_15px_rgba(255,255,255,0.6)] ${
//                     currentEchoes >= allowedEchoes
//                       ? "opacity-50 cursor-not-allowed"
//                       : ""
//                   }`}
//                   onClick={(e) => handleLinkClick(e, "/echo")}
//                 >
//                   Create Echoes
//                 </Link>
//               </motion.div>

//               <motion.div
//                 variants={{
//                   hidden: { opacity: 0, y: 20 },
//                   visible: {
//                     opacity: 1,
//                     y: 0,
//                     transition: { delay: 1, duration: 0.4 },
//                   },
//                 }}
//               >
//                 <Link
//                   href="/echolist"
//                   className="bg-white text-black py-2 px-4 rounded-lg font-greek transition-all duration-500 ease-in-out 
//                  hover:scale-110 hover:shadow-[0px_0px_15px_rgba(0,0,0,0.6)]"
//                   onClick={(e) => handleLinkClick(e, "/echolist")}
//                 >
//                   My Echoes
//                 </Link>
//               </motion.div>
//             </motion.div>
//           </div>
//         </div>
//       </main>
