// "use client";
// import React, { useState } from "react";

// const WallOfTrust = () => {
//   const [showEmbedCode, setShowEmbedCode] = useState(false);

//   const generateEmbedCode = () => {
//     return `<iframe src="http://localhost:3000/walloftrust" width="600" height="400" frameborder="0" allowfullscreen></iframe>`;
//   };
  

//   return (
//     <div className="p-8 bg-gray-100 rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-4">Wall of Trust</h2>
//       {/* Your component content */}
//       <div className="space-y-4 mb-6">
//         <div className="p-4 bg-white rounded-lg shadow-sm">
//           <h3 className="text-xl font-semibold">John Doe</h3>
//           <p className="text-gray-700">"This is a great service! Highly recommend it."</p>
//         </div>
//         <div className="p-4 bg-white rounded-lg shadow-sm">
//           <h3 className="text-xl font-semibold">Jane Smith</h3>
//           <p className="text-gray-700">"Absolutely fantastic experience. Will use again."</p>
//         </div>
//       </div>

//       <button
//         onClick={() => setShowEmbedCode(!showEmbedCode)}
//         className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//       >
//         {showEmbedCode ? "Hide Embed Code" : "Embed Wall"}
//       </button>
//       {showEmbedCode && (
//         <textarea
//           readOnly
//           value={generateEmbedCode()}
//           rows="4"
//           cols="50"
//           className="mt-4 p-2 border border-gray-300 rounded-lg bg-white text-gray-700"
//         />
//       )}
//     </div>
//   );
// };

// export default WallOfTrust;
// /app/walloftrust/WallOfTrust.jsx
"use client"
import React from 'react';

const WallOfTrust = () => {
  return (
    <div>
      <h2>Wall of Trust</h2>
      <p>This is the Wall of Trust component content.</p>
    </div>
  );
};

export default WallOfTrust;
