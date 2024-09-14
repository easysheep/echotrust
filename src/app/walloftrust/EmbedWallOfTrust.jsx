"use client";

import { useState } from "react";

const Embed = () => {
  const [showEmbedCode, setShowEmbedCode] = useState(false);

  const embedCode = `
<iframe 
  src="http://localhost:3000/walloftrust" 
  width="600" 
  height="400" 
  frameBorder="0">
</iframe>`;

  const handleEmbedClick = () => {
    setShowEmbedCode(!showEmbedCode);
  };

  return (
    <div className="p-4">
      
      <h2 className="text-2xl font-bold mb-4">Embed Component</h2>

      <button
        onClick={handleEmbedClick}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
      >
        Get Embed Code
      </button>

      {showEmbedCode && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Embed Code:</h3>
          <textarea
            readOnly
            value={embedCode}
            className="w-full h-32 p-2 mt-2 border border-gray-300 rounded"
          />
        </div>
      )}
    </div>
  );
};

export default Embed;
