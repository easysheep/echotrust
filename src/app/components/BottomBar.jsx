import React from "react";

const BottomBar = () => {
  return (
    <div className="flex text-white h-24">
      <div className="h-24 w-5/12 flex items-end">
        <div className="bg-black w-full h-5"></div>
      </div>

      <div className="relative w-2/12">
        {/* Triangle shape from bottom left to top right */}
        <div
          className="bg-black h-24 w-full"
          style={{
            clipPath: "polygon(0 100%, 100% 100%, 100% 0)",
          }}
        ></div>

        {/* Black line at the bottom */}
        <div className="absolute bottom-0 left-0 w-full h-5 bg-black"></div>
      </div>

      <div className="bg-black text-white w-5/12 h-24 border-0"></div>
    </div>
  );
};

export default BottomBar;

// import React from "react";

// const BottomBar = () => {
//   return (
//     <div className="flex text-white h-24">
//       <div className="h-24 w-5/12 flex items-end">
//         <div className="bg-black w-full h-5"></div>
//       </div>

//       {/* Triangle shape from bottom left to top right */}
//       <div
//         className="relative h-24 w-2/12"
//         style={{
//           clipPath: "polygon(0 100%, 100% 100%, 100% 0)",
//         }}
//       >
//         {/* Position the inner div below the triangle */}
//         <div className="bg-black w-full h-5 absolute bottom-0 left-0"></div>
//       </div>

//       <div className="bg-black text-white w-5/12 h-24 border-0"></div>
//     </div>
//   );
// };

// export default BottomBar;
