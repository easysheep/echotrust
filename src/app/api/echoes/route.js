// import fs from 'fs';
// import formidable from 'formidable';
// import connectToMongo from "../../../../dbs/mongodb"; // Ensure this path is correct
// import Image from "@/../models/imageCreate"; // Adjust path as necessary
// import Echo from "@/../models/echoCreate"; // Adjust path as necessary

// // Disable the body parser for this route
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export async function POST(request) {
//   try {
//     // Connect to MongoDB
//     await connectToMongo();

//     // Parse the form-data request using formidable
//     const form = formidable({ multiples: true });
//     const { fields, files } = await new Promise((resolve, reject) => {
//       form.parse(request, (err, fields, files) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve({ fields, files });
//         }
//       });
//     });

//     const {
//       echo_name,
//       echo_title,
//       echo_details,
//       echo_message,
//       sender_name,
//       attachment,
//       user,
//     } = fields;

//     // Check if required fields are provided
//     if (!echo_name || !echo_title || !echo_details || !echo_message || !sender_name || !user) {
//       return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
//     }

//     // Handle the uploaded image
//     const imageFile = files.echo_logo;
//     const newImage = new Image({
//       data: fs.readFileSync(imageFile.filepath),
//       contentType: imageFile.mimetype,
//     });

//     // Save the image to MongoDB
//     const savedImage = await newImage.save();

//     // Create a new Echo document
//     const newEcho = new Echo({
//       echo_name,
//       echo_title,
//       echo_details,
//       echo_message,
//       sender_name,
//       attachment,
//       user,
//       echo_logo: savedImage._id,
//     });

//     // Save the Echo document
//     await newEcho.save();

//     // Success response
//     return new Response(JSON.stringify({
//       message: "Echo created successfully",
//       echo: newEcho,
//     }), { status: 200 });
//   } catch (error) {
//     console.error("Error creating Echo:", error);
//     return new Response(JSON.stringify(
//       { message: "Failed to create Echo", error: error.message }
//     ), { status: 500 });
//   }
// }

// src/app/api/users/route.js
import { NextResponse } from "next/server";
import connectToMongo from "../../../../dbs/mongodb"; // Ensure the path is correct
import Echo from "@/../models/echoCreate"; // MongoDB model for storing the form data

export async function POST(req, res) {
  try {
    // Connect to MongoDB
    await connectToMongo();

    // Parse the JSON body of the request
    const body = await req.json();
    const {
      echo_name,
      echo_title,
      echo_details,
      echo_message,
      sender_name,
      attachment,
      echo_logo,
      user,
    } = body; // Destructure the fields

    // Create a new Echo instance with the data
    const newEcho = new Echo({
      echo_name,
      echo_title,
      echo_details,
      echo_message,
      sender_name,
      attachment,
      user,
      echo_logo,
    });

    // Save the new instance to the database
    await newEcho.save();

    // Respond with success
    return NextResponse.json({ message: "User saved successfully!" });
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json(
      { message: "Error saving user data", error: error.message },
      { status: 500 }
    );
  }
}
