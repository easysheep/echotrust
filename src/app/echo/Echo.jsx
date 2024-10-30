// "use client";
// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import {
//   GoogleGenerativeAI,
//   HarmCategory,
//   HarmBlockThreshold,
// } from "@google/generative-ai";

// const Echo = () => {
//   const { user } = useUser();
//   const router = useRouter();
//   const MODEL_NAME = "gemini-1.0-pro";
//   const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
//   const [formData, setFormData] = useState({
//     echo_name: "",
//     echo_title: "",
//     echo_details: "",
//     echo_message: "",
//     sender_name: "",
//     attachment: "",
//     echo_logo: "",
//     add_questions: "",
//   });
//   const [description, setDescription] = useState("");
//   const [loadingAI, setLoadingAI] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent default form submission behavior
//     if (!user) {
//       console.error("User is not authenticated.");
//       return;
//     }

//     const updatedFormData = {
//       ...formData,
//       user: user.id, // Clerk userId
//     };

//     try {
//       const response = await fetch("/api/echoes", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(updatedFormData), // Send user along with form data
//       });

//       if (response.ok) {
//         const result = await response.json();
//         console.log("Echo created successfully:", result);

//         // Redirect to the review landing page using the echo_name
//         router.push(`/reviewlandingpage/${formData.echo_name}`);
//       } else {
//         console.error("Failed to create Echo");
//       }
//     } catch (error) {
//       console.error("Error during form submission:", error);
//     }
//   };

//   const runAI = async () => {
//     setLoadingAI(true);
//     try {
//       const genAI = new GoogleGenerativeAI(API_KEY);
//       const model = genAI.getGenerativeModel({ model: MODEL_NAME });

//       const generationConfig = {
//         temperature: 0.9,
//         topK: 1,
//         topP: 1,
//         maxOutputTokens: 2048,
//       };

//       const safetySettings = [
//         {
//           category: HarmCategory.HARM_CATEGORY_HARASSMENT,
//           threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//         },
//         {
//           category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
//           threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//         },
//         {
//           category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
//           threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//         },
//         {
//           category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
//           threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//         },
//       ];

//       const chat = model.startChat({
//         generationConfig,
//         safetySettings,
//         history: [
//           {
//             role: "user",
//             parts: [
//               {
//                 text: `${description}, this  tells us what the echo is about it could be a service, could be a webiste,project,evenet etc what ever comes in this ask 3-4 questions which are meant to be asked to the reviewer about the particular echo, dont make question long and dont make them very techincal, mak ethe questions personal not very hard to answer like dont ask for highest/most/biggest things in questions`,
//               },
//             ],
//           },
//         ],
//       });

//       const result = await chat.sendMessage(description);
//       const questions = result.response
//         .text()
//         .split("\n")
//         .filter(Boolean)
//         .slice(0, 4);

//       setFormData((prevData) => ({
//         ...prevData,
//         add_questions: questions.join("\n"),
//       }));
//     } catch (error) {
//       console.error("Error generating AI questions:", error);
//     } finally {
//       setLoadingAI(false);
//     }
//   };

//   return (
//     // <div className="p-6 max-w-4xl mx-auto">
//     //   <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
//     //     <input
//     //       type="text"
//     //       name="echo_name"
//     //       placeholder="Echo Name"
//     //       value={formData.echo_name}
//     //       onChange={handleChange}
//     //       className="border p-2 rounded"
//     //     />
//     //     <input
//     //       type="text"
//     //       name="echo_title"
//     //       placeholder="Echo Title"
//     //       value={formData.echo_title}
//     //       onChange={handleChange}
//     //       className="border p-2 rounded"
//     //     />
//     //     <input
//     //       type="text"
//     //       name="echo_details"
//     //       placeholder="Echo Details"
//     //       value={formData.echo_details}
//     //       onChange={handleChange}
//     //       className="border p-2 rounded"
//     //     />
//     //     <input
//     //       type="text"
//     //       name="echo_message"
//     //       placeholder="Echo Message"
//     //       value={formData.echo_message}
//     //       onChange={handleChange}
//     //       className="border p-2 rounded"
//     //     />
//     //     <input
//     //       type="text"
//     //       name="sender_name"
//     //       placeholder="Sender Name"
//     //       value={formData.sender_name}
//     //       onChange={handleChange}
//     //       className="border p-2 rounded"
//     //     />
//     //     <input
//     //       type="text"
//     //       name="attachment"
//     //       placeholder="Attachment"
//     //       value={formData.attachment}
//     //       onChange={handleChange}
//     //       className="border p-2 rounded"
//     //     />
//     //     <input
//     //       type="text"
//     //       name="echo_logo"
//     //       placeholder="Echo Logo"
//     //       value={formData.echo_logo}
//     //       onChange={handleChange}
//     //       className="border p-2 rounded"
//     //     />

//     //     {/* Description for AI Question Generation */}
//     //     <div className="flex items-center space-x-2">
//     //       <input
//     //         type="text"
//     //         name="description"
//     //         placeholder="Describe your Echo"
//     //         value={description}
//     //         onChange={(e) => setDescription(e.target.value)}
//     //         className="border p-2 rounded flex-1"
//     //       />
//     //       <Button onClick={runAI} disabled={loadingAI} className="bg-purple-500 text-white p-2 rounded">
//     //         {loadingAI ? "Generating..." : "Auto Fill with AI"}
//     //       </Button>
//     //     </div>

//     //     {/* Add Questions field */}
//     //     <textarea
//     //       name="add_questions"
//     //       placeholder="Add Questions"
//     //       value={formData.add_questions}
//     //       onChange={handleChange}
//     //       className="border p-2 rounded h-32"
//     //     />

//     //     <Button type="submit" className="bg-blue-500 text-white p-2 rounded">
//     //       Create Echo
//     //     </Button>
//     //   </form>
//     // </div>
//     <div className="bg-black min-h-full p-6">
//       <div className="h-full mx-auto flex flex-col md:flex-row items-start">
//         {/* Left Side (Reserved for future content like reviews) */}
//         <div className="hidden md:block w-full md:w-3/6 p-6">
//           {/* Placeholder content */}
//           <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
//             <h2 className="text-2xl font-semibold mb-4 text-gray-900">
//               Reviews or Additional Content
//             </h2>
//             <p className="text-gray-600">
//               This space can be used for future content such as reviews,
//               details, or anything you want to display alongside the form.
//             </p>
//           </div>
//         </div>

//         {/* Right Side (Form Section) */}
//         <div className="w-full md:w-3/6 bg-white p-2 rounded-lg shadow-lg ">
//           <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 ">
//             <div className="flex items-center justify-center text-4xl font-extrabold font-poppins">
//               Create A New Echo
//             </div>
//             <div className="text-center font-light font-poppins text-customGray">
//               Create a dedicated landing page to collect review about your echo
//             </div>
//             {/* <div className="w-full justify-center flex">
//               <div className="w-1/2 flex flex-col gap-6">
//                 <div className="w-full">
//                   <div className="text-purple-500 font-extrabold">
//                     Echo Name
//                   </div>
//                   <input
//                     type="text"
//                     name="echo_name"
//                     placeholder="name your echo...."
//                     value={formData.echo_name}
//                     onChange={handleChange}
//                     className="border p-2 rounded w-full"
//                   />
//                 </div>

//                 <div className="w-full">
//                   <div className="text-purple-500 font-extrabold">
//                     Echo Title
//                   </div>
//                   <input
//                   type="text"
//                   name="echo_title"
//                   placeholder="What do you want to name this echo for reviewing?"
//                   value={formData.echo_title}
//                   onChange={handleChange}
//                   className="border p-2 rounded w-full"
//                 />

//                 </div>

//                 <input
//                   type="text"
//                   name="echo_details"
//                   placeholder="Echo Details"
//                   value={formData.echo_details}
//                   onChange={handleChange}
//                   className="border p-2 rounded"
//                 />
//                 <input
//                   type="text"
//                   name="echo_message"
//                   placeholder="Echo Message"
//                   value={formData.echo_message}
//                   onChange={handleChange}
//                   className="border p-2 rounded"
//                 />
//                 <input
//                   type="text"
//                   name="sender_name"
//                   placeholder="Sender Name"
//                   value={formData.sender_name}
//                   onChange={handleChange}
//                   className="border p-2 rounded"
//                 />
//                 <input
//                   type="text"
//                   name="attachment"
//                   placeholder="Attachment"
//                   value={formData.attachment}
//                   onChange={handleChange}
//                   className="border p-2 rounded"
//                 />
//                 <input
//                   type="text"
//                   name="echo_logo"
//                   placeholder="Echo Logo"
//                   value={formData.echo_logo}
//                   onChange={handleChange}
//                   className="border p-2 rounded"
//                 />
//               </div>
//             </div> */}

//             <div className="w-full justify-center flex">
//               <div className="w-1/2 flex flex-col gap-6">
//                 {/* Echo Name */}
//                 <div className="w-full">
//                   <div className="text-purple-500 font-extrabold">
//                     Echo Name
//                   </div>
//                   <input
//                     type="text"
//                     name="echo_name"
//                     placeholder="name your echo...."
//                     value={formData.echo_name}
//                     onChange={handleChange}
//                     className="border p-2 rounded w-full"
//                   />
//                 </div>

//                 {/* Echo Title */}
//                 <div className="w-full">
//                   <div className="text-purple-500 font-extrabold">
//                     Echo Title
//                   </div>
//                   <input
//                     type="text"
//                     name="echo_title"
//                     placeholder="What do you want to name this echo for reviewing?"
//                     value={formData.echo_title}
//                     onChange={handleChange}
//                     className="border p-2 rounded w-full"
//                   />
//                 </div>

//                 {/* Echo Details */}
//                 <div className="w-full">
//                   <div className="text-purple-500 font-extrabold">
//                     Echo Details
//                   </div>
//                   <input
//                     type="text"
//                     name="echo_details"
//                     placeholder="Provide details about your echo...."
//                     value={formData.echo_details}
//                     onChange={handleChange}
//                     className="border p-2 rounded w-full"
//                   />
//                 </div>

//                 {/* Echo Message */}
//                 <div className="w-full">
//                   <div className="text-purple-500 font-extrabold">
//                     Echo Message
//                   </div>
//                   <input
//                     type="text"
//                     name="echo_message"
//                     placeholder="Provide a message for this echo...."
//                     value={formData.echo_message}
//                     onChange={handleChange}
//                     className="border p-2 rounded w-full"
//                   />
//                 </div>

//                 {/* Sender Name */}
//                 <div className="w-full">
//                   <div className="text-purple-500 font-extrabold">
//                     Sender Name
//                   </div>
//                   <input
//                     type="text"
//                     name="sender_name"
//                     placeholder="Enter your name...."
//                     value={formData.sender_name}
//                     onChange={handleChange}
//                     className="border p-2 rounded w-full"
//                   />
//                 </div>

//                 {/* Attachment */}
//                 <div className="w-full">
//                   <div className="text-purple-500 font-extrabold">
//                     Attachment
//                   </div>
//                   <input
//                     type="text"
//                     name="attachment"
//                     placeholder="Add an attachment link...."
//                     value={formData.attachment}
//                     onChange={handleChange}
//                     className="border p-2 rounded w-full"
//                   />
//                 </div>

//                 {/* Echo Logo */}
//                 <div className="w-full">
//                   <div className="text-purple-500 font-extrabold">
//                     Echo Logo
//                   </div>
//                   <input
//                     type="text"
//                     name="echo_logo"
//                     placeholder="Add the logo URL for this echo...."
//                     value={formData.echo_logo}
//                     onChange={handleChange}
//                     className="border p-2 rounded w-full"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/*
//             <div className="flex items-center space-x-2">
//               <input
//                 type="text"
//                 name="description"
//                 placeholder="Describe your Echo"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 className="border p-2 rounded flex-1"
//               />
//               <Button
//                 onClick={runAI}
//                 disabled={loadingAI}
//                 className="bg-purple-500 text-white p-2 rounded"
//               >
//                 {loadingAI ? "Generating..." : "Auto Fill with AI"}
//               </Button>
//             </div>

//             <textarea
//               name="add_questions"
//               placeholder="Add Questions"
//               value={formData.add_questions}
//               onChange={handleChange}
//               className="border p-2 rounded h-32"
//             /> */}

//             <div className="w-full">
//               <div className="text-purple-500 font-extrabold">
//                 Describe Your Echo
//               </div>
//               <div className="flex items-center space-x-2">
//                 <input
//                   type="text"
//                   name="description"
//                   placeholder="Describe your Echo"
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   className="border p-2 rounded flex-1"
//                 />
//                 <Button
//                   onClick={runAI}
//                   disabled={loadingAI}
//                   className="bg-purple-500 text-white p-2 rounded"
//                 >
//                   {loadingAI ? "Generating..." : "Auto Fill with AI"}
//                 </Button>
//               </div>
//             </div>

//             {/* Dynamic Questions Field */}
//             <div className="w-full">
//               <div className="text-purple-500 font-extrabold">
//                 Add Questions
//               </div>
//               {formData.questions.map((question, index) => (
//                 <div key={index} className="flex items-center mb-2">
//                   <input
//                     type="text"
//                     placeholder={`Question ${index + 1}`}
//                     value={question}
//                     onChange={(event) => handleQuestionChange(index, event)}
//                     className="border p-2 rounded w-full"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeQuestionField(index)}
//                     className="ml-2 text-red-500"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 onClick={addQuestionField}
//                 className="bg-green-500 text-white p-2 rounded"
//               >
//                 Add Another Question
//               </button>
//             </div>

//             <Button
//               type="submit"
//               className="bg-blue-500 text-white p-2 rounded"
//             >
//               Create Echo
//             </Button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Echo;

// "use client";
// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import {
//   GoogleGenerativeAI,
//   HarmCategory,
//   HarmBlockThreshold,
// } from "@google/generative-ai";

// const Echo = () => {
//   const { user } = useUser();
//   const router = useRouter();
//   const MODEL_NAME = "gemini-1.0-pro";
//   const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
//   const [logoPreview, setLogoPreview] = useState(null);
//   const [formData, setFormData] = useState({
//     echo_name: "",
//     echo_title: "",
//     echo_details: "",
//     echo_message: "",
//     sender_name: "",
//     attachment: "",
//     echo_logo: null, // Changed to null for file
//   });
//   const [description, setDescription] = useState("");
//   const [loadingAI, setLoadingAI] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, files } = e.target;

//     if (type === "file") {
//       setFormData({ ...formData, [name]: files[0] }); // Store the file
//       const file = files[0];
//       const reader = new FileReader();

//       reader.onloadend = () => {
//         setLogoPreview(reader.result); // Set the preview state
//       };

//       if (file) {
//         reader.readAsDataURL(file);
//       }
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!user) {
//       console.error("User is not authenticated.");
//       return;
//     }

//     const data = new FormData();
//     data.append("echo_name", formData.echo_name);
//     data.append("echo_title", formData.echo_title);
//     data.append("echo_details", formData.echo_details);
//     data.append("echo_message", formData.echo_message);
//     data.append("sender_name", formData.sender_name);
//     data.append("attachment", formData.attachment);
//     data.append("user", user.id); // Include user data
//     data.append("echo_logo", formData.echo_logo); // File

//     try {
//       const response = await fetch("/api/echoes", {
//         method: "POST",
//         body: data, // Send FormData
//       });

//       if (response.ok) {
//         const result = await response.json();
//         console.log("Echo created successfully:", result);

//         // Redirect to the review landing page
//         router.push(`/reviewlandingpage/${formData.echo_name}`);
//       } else {
//         const errorData = await response.json();
//         console.error("Failed to create Echo:", errorData.message);
//       }
//     } catch (error) {
//       console.error("Error during form submission:", error);
//     }
//   };

//   const runAI = async () => {
//     setLoadingAI(true);
//     try {
//       const genAI = new GoogleGenerativeAI(API_KEY);
//       const model = genAI.getGenerativeModel({ model: MODEL_NAME });

//       const generationConfig = {
//         temperature: 0.9,
//         topK: 1,
//         topP: 1,
//         maxOutputTokens: 2048,
//       };

//       const safetySettings = [
//         {
//           category: HarmCategory.HARM_CATEGORY_HARASSMENT,
//           threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//         },
//         {
//           category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
//           threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//         },
//         {
//           category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
//           threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//         },
//         {
//           category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
//           threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//         },
//       ];

//       const chat = model.startChat({
//         generationConfig,
//         safetySettings,
//         history: [
//           {
//             role: "user",
//             parts: [
//               {
//                 text: `${description}, this tells us what the echo is about it could be a service, could be a website, project, event etc whatever comes in this ask 3-4 questions which are meant to be asked to the reviewer about the particular echo, dont make questions long and dont make them very technical, make the questions personal not very hard to answer like dont ask for highest/most/biggest things in questions`,
//               },
//             ],
//           },
//         ],
//       });

//       const result = await chat.sendMessage(description);
//       const questions = result.response
//         .text()
//         .split("\n")
//         .filter(Boolean)
//         .slice(0, 4);

//       setFormData((prevData) => ({
//         ...prevData,
//         add_questions: questions.join("\n"),
//       }));
//     } catch (error) {
//       console.error("Error generating AI questions:", error);
//     } finally {
//       setLoadingAI(false);
//     }
//   };

//   return (
//     <div className="bg-black min-h-full p-6">
//       <div className="h-full mx-auto flex flex-col md:flex-row items-start">
//         {/* Left Side (Reserved for future content like reviews) */}
//         <div className="hidden md:block w-full md:w-3/6 p-6">
//           {/* Placeholder content */}
//           <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
//             <h2 className="text-2xl font-semibold mb-4 text-gray-900">
//               Reviews or Additional Content
//             </h2>
//             <p className="text-gray-600">
//               This space can be used for future content such as reviews,
//               details, or anything you want to display alongside the form.
//             </p>
//           </div>
//         </div>

//         {/* Right Side (Form Section) */}
//         <div className="w-full md:w-3/6 bg-white p-2 rounded-lg shadow-lg ">
//           <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 ">
//             <div className="flex items-center justify-center text-4xl font-extrabold font-poppins">
//               Create A New Echo
//             </div>
//             <div className="text-center font-light font-poppins text-customGray">
//               Create a dedicated landing page to collect reviews about your echo
//             </div>

//             <div className="w-full justify-center flex">
//               <div className="w-1/2 flex flex-col gap-6">
//                 <div className="w-full">
//                   <div className="text-purple-500 font-extrabold">
//                     Echo Logo
//                   </div>
//                   <div className="imgbox border-4 w-full flex justify-center items-center max-h-52">
//                     {logoPreview ? (
//                       <img
//                         src={logoPreview}
//                         alt="Logo Preview"
//                         className="max-h-full max-w-full object-cover"
//                       />
//                     ) : (
//                       <label
//                         htmlFor="echo_logo_upload"
//                         className="custom-file-upload flex flex-col cursor-pointer"
//                       >
//                         <span className="text-8xl text-gray-400 flex justify-center font-roboto">
//                           +
//                         </span>
//                         <span className="text-xl text-gray-400 font-bold font-roboto">
//                           Add Image
//                         </span>
//                       </label>
//                     )}
//                     <input
//                       id="echo_logo_upload"
//                       type="file"
//                       name="echo_logo"
//                       accept="image/*" // Accept image files only
//                       onChange={handleChange}
//                       style={{ display: "none" }} // Hide the default file input
//                     />
//                   </div>
//                 </div>
//                 {/* Echo Name */}
//                 <div className="w-full">
//                   <div className="text-purple-500 font-extrabold">
//                     Echo Name
//                   </div>
//                   <input
//                     type="text"
//                     name="echo_name"
//                     placeholder="name your echo...."
//                     value={formData.echo_name}
//                     onChange={handleChange}
//                     className="border p-2 rounded w-full"
//                   />
//                 </div>

//                 {/* Echo Title */}
//                 <div className="w-full">
//                   <div className="text-purple-500 font-extrabold">
//                     Echo Title
//                   </div>
//                   <input
//                     type="text"
//                     name="echo_title"
//                     placeholder="What do you want to name this echo for reviewing?"
//                     value={formData.echo_title}
//                     onChange={handleChange}
//                     className="border p-2 rounded w-full"
//                   />
//                 </div>

//                 {/* Echo Details */}
//                 <div className="w-full">
//                   <div className="text-purple-500 font-extrabold">
//                     Echo Details
//                   </div>
//                   <input
//                     type="text"
//                     name="echo_details"
//                     placeholder="Provide details about your echo...."
//                     value={formData.echo_details}
//                     onChange={handleChange}
//                     className="border p-2 rounded w-full"
//                   />
//                 </div>

//                 {/* Echo Message */}
//                 <div className="w-full">
//                   <div className="text-purple-500 font-extrabold">
//                     Echo Message
//                   </div>
//                   <input
//                     type="text"
//                     name="echo_message"
//                     placeholder="Your message for this echo...."
//                     value={formData.echo_message}
//                     onChange={handleChange}
//                     className="border p-2 rounded w-full"
//                   />
//                 </div>

//                 {/* Sender Name */}
//                 <div className="w-full">
//                   <div className="text-purple-500 font-extrabold">
//                     Sender Name
//                   </div>
//                   <input
//                     type="text"
//                     name="sender_name"
//                     placeholder="Your name...."
//                     value={formData.sender_name}
//                     onChange={handleChange}
//                     className="border p-2 rounded w-full"
//                   />
//                 </div>

//                 {/* Attachment */}
//                 <div className="w-full">
//                   <div className="text-purple-500 font-extrabold">
//                     Attachment
//                   </div>
//                   <input
//                     type="text"
//                     name="attachment"
//                     placeholder="Link to any attachments...."
//                     value={formData.attachment}
//                     onChange={handleChange}
//                     className="border p-2 rounded w-full"
//                   />
//                 </div>

//                 <div className="w-full flex justify-center mt-4">
//                   <Button
//                     type="submit"
//                     className="bg-purple-500 text-white rounded px-4 py-2"
//                   >
//                     Create Echo
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Echo;























// src/app/page.js
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

export default function FormPage() {
  const [echo_name, setEchoName] = useState('');
  const [echo_title, setEchoTitle] = useState('');
  const [echo_details, setEchoDetails] = useState('');
  const [echo_message, setEchoMessage] = useState('');
  const [sender_name, setSenderName] = useState('');
  const [attachment, setAttachment] = useState('');
  const [echo_logo, setLogo] = useState(null);  // For the logo file
  const [logoPreview, setLogoPreview] = useState(''); 
  const [message,setMessage]=useState('') // For logo preview
  const { user } = useUser();
  const router = useRouter(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!echo_logo) {
      alert('Please upload an image');
      return;
    }

    try {
      // Convert the image file to a base64 string
      const base64Image = await toBase64(echo_logo);

      const res = await fetch('/api/echoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          echo_name,
          echo_title,
          echo_details,
          echo_message,
          sender_name,
          attachment,
          echo_logo: base64Image,
          user:user.id // Send the base64 string
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit form');
      }

      const data = await res.json();
      setMessage(data.message);
      router.push(`/reviewlandingpage/${echo_name}`); 
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('Error submitting form');
    }
  };

  // Utility function to convert file to base64
  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);  // Convert image to base64
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="bg-black min-h-full p-6">
      <div className="h-full mx-auto flex flex-col md:flex-row items-start">
        {/* Left Side (Reserved for future content like reviews) */}
        <div className="hidden md:block w-full md:w-3/6 p-6">
          {/* Placeholder content */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Reviews or Additional Content
            </h2>
            <p className="text-gray-600">
              This space can be used for future content such as reviews,
              details, or anything you want to display alongside the form.
            </p>
          </div>
        </div>

        {/* Right Side (Form Section) */}
        <div className="w-full md:w-3/6 bg-white p-2 rounded-lg shadow-lg ">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 ">
            <div className="flex items-center justify-center text-4xl font-extrabold font-poppins">
              Create A New Echo
            </div>
            <div className="text-center font-light font-poppins text-customGray">
              Create a dedicated landing page to collect reviews about your echo
            </div>

            <div className="w-full justify-center flex">
              <div className="w-1/2 flex flex-col gap-6">
                <div className="w-full">
                  <div className="text-purple-500 font-extrabold">
                    Echo Logo
                  </div>
                  <div className="imgbox border-4 w-full flex justify-center items-center max-h-52">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="max-h-full max-w-full object-cover"
                      />
                    ) : (
                      <label
                        htmlFor="echo_logo_upload"
                        className="custom-file-upload flex flex-col cursor-pointer"
                      >
                        <span className="text-8xl text-gray-400 flex justify-center font-roboto">
                          +
                        </span>
                        <span className="text-xl text-gray-400 font-bold font-roboto">
                          Add Image
                        </span>
                      </label>
                    )}
                     <input
                    id="echo_logo_upload"
                    type="file"
                    name="echo_logo"
                    onChange={(e) => setLogo(e.target.files[0])}  // Update state with the file
                    accept="image/*"
                    required// Hide the default file input
                  />
                  </div>
                </div>
                {/* Echo Name */}
                <div className="w-full">
                  <div className="text-purple-500 font-extrabold">
                    Echo Name
                  </div>
                  <input
                    type="text"
                    name="echo_name"
                    placeholder="name your echo...."
                    value={echo_name}
                    onChange={(e) => setEchoName(e.target.value)} 
                    className="border p-2 rounded w-full"
                  />
                </div>

                {/* Echo Title */}
                <div className="w-full">
                  <div className="text-purple-500 font-extrabold">
                    Echo Title
                  </div>
                  <input
                    type="text"
                    name="echo_title"
                    placeholder="What do you want to name this echo for reviewing?"
                    value={echo_title}
                    onChange={(e) => setEchoTitle(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </div>

                {/* Echo Details */}
                <div className="w-full">
                  <div className="text-purple-500 font-extrabold">
                    Echo Details
                  </div>
                  <input
                    type="text"
                    name="echo_details"
                    placeholder="Provide details about your echo...."
                    value={echo_details}
                    onChange={(e) => setEchoDetails(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </div>

                {/* Echo Message */}
                <div className="w-full">
                  <div className="text-purple-500 font-extrabold">
                    Echo Message
                  </div>
                  <input
                    type="text"
                    name="echo_message"
                    placeholder="Your message for this echo...."
                    value={echo_message}
                    onChange={(e) => setEchoMessage(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </div>

                {/* Sender Name */}
                <div className="w-full">
                  <div className="text-purple-500 font-extrabold">
                    Sender Name
                  </div>
                  <input
                    type="text"
                    name="sender_name"
                    placeholder="Your name...."
                    value={sender_name}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </div>

                {/* Attachment */}
                <div className="w-full">
                  <div className="text-purple-500 font-extrabold">
                    Attachment
                  </div>
                  <input
                    type="text"
                    name="attachment"
                    placeholder="Link to any attachments...."
                    value={attachment}
                    onChange={(e) => setAttachment(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </div>

                <div className="w-full flex justify-center mt-4">
                  <Button
                    type="submit"
                    className="bg-purple-500 text-white rounded px-4 py-2"
                  >
                    Create Echo
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>


      {message}
    </div>
  );
};

