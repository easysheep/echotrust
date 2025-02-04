import Razorpay from 'razorpay';

import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { amount, currency } = await req.json();

    const razorpay = new Razorpay({
      key_id: process.env.RZP_KEY, // Add this in your .env.local file
      key_secret: process.env.RZP_SECRET, // Add this in your .env.local file
    });

    // Create a new order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert amount to smallest currency unit
      currency,
    });

    // Return the order details as a JSON response
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { message: "Failed to create Razorpay order", error: error.message },
      { status: 500 }
    );
  }
}
