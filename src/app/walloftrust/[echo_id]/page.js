// pages/walloftrust/[echoId].jsx
"use client"
import React from "react";
import WallOfTrust from "../../../components/WallOfTrust"; // Adjust the path as necessary

const WallOfTrustEmbed = ({ params }) => {
  const { echo_id } = params; // Extract echoId from the URL parameters

  return (
    <div>
      <WallOfTrust echoId={echo_id} isEmbed={true} />
    </div>
  );
};

export default WallOfTrustEmbed;
