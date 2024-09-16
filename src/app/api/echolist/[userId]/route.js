import connectToMongo from "../../../../../dbs/mongodb";
import Echo from "@/../models/echoCreate";

export async function GET(req, { params }) {
  await connectToMongo();

  const { userId } = params; // Extract userId from params

  try {
    if (!userId) {
      return new Response(JSON.stringify({ message: "User ID is required" }), {
        status: 400,
      });
    }

    const echoes = await Echo.find({ user: userId });
    return new Response(JSON.stringify(echoes), { status: 200 });
  } catch (error) {
    console.error("Error fetching echoes:", error);
    return new Response(JSON.stringify({ message: "Error fetching echoes" }), {
      status: 500,
    });
  }
}

export async function DELETE(req, { params }) {
  await connectToMongo();

  const echoId = req.nextUrl.searchParams.get("echoId"); // Extract echo ID from query params

  try {
    if (!echoId) {
      return new Response(JSON.stringify({ message: "Echo ID is required" }), {
        status: 400,
      });
    }

    const result = await Echo.findByIdAndDelete(echoId);

    if (!result) {
      return new Response(JSON.stringify({ message: "Echo not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Echo deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting echo:", error);
    return new Response(JSON.stringify({ message: "Error deleting echo" }), {
      status: 500,
    });
  }
}
