import connectToMongo from "../../../../../dbs/mongodb";
import Echo from "@/../models/echoCreate";
import logger from "../../../../utils/logger";
export async function GET(req, { params }) {
  await connectToMongo();
  const { userId } = params;

  try {
    if (!userId) {
      logger.warn("GET /echoes - User ID is missing in request");
      return new Response(JSON.stringify({ message: "User ID is required" }), {
        status: 400,
      });
    }

    const echoes = await Echo.find({ user: userId });
    logger.info(`GET /echoes - Fetched echoes for user: ${userId}`);

    return new Response(JSON.stringify(echoes), { status: 200 });
  } catch (error) {
    logger.error("GET /echoes - Error fetching echoes", {
      error: error.message,
    });
    return new Response(JSON.stringify({ message: "Error fetching echoes" }), {
      status: 500,
    });
  }
}


export async function DELETE(req, { params }) {
  await connectToMongo();
  const echoId = req.nextUrl.searchParams.get("echoId");

  try {
    if (!echoId) {
      logger.warn("DELETE /echoes - Echo ID is missing in request");
      return new Response(JSON.stringify({ message: "Echo ID is required" }), {
        status: 400,
      });
    }

    const result = await Echo.findByIdAndDelete(echoId);

    if (!result) {
      logger.warn(`DELETE /echoes - Echo not found (ID: ${echoId})`);
      return new Response(JSON.stringify({ message: "Echo not found" }), {
        status: 404,
      });
    }

    logger.info(`DELETE /echoes - Echo deleted successfully (ID: ${echoId})`);
    return new Response(
      JSON.stringify({ message: "Echo deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    logger.error("DELETE /echoes - Error deleting echo", {
      error: error.message,
    });
    return new Response(JSON.stringify({ message: "Error deleting echo" }), {
      status: 500,
    });
  }
}
