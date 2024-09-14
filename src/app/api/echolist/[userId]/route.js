import connectToMongo from "../../../../../dbs/mongodb";
import Echo from "@/../models/echoCreate"; 

export async function GET(req, { params }) {
  await connectToMongo();

  const { userId } = params; // Extract userId from params

  try {
    if (!userId) {
      return new Response(JSON.stringify({ message: 'User ID is required' }), { status: 400 });
    }

    const echoes = await Echo.find({ user: userId });
    return new Response(JSON.stringify(echoes), { status: 200 });
  } catch (error) {
    console.error("Error fetching echoes:", error);
    return new Response(JSON.stringify({ message: 'Error fetching echoes' }), { status: 500 });
  }
}
