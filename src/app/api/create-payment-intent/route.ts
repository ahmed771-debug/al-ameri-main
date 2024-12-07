import { NextRequest, NextResponse } from "next/server";

// const stripe = require("stripe")(
//   "sk_test_51NuWKSKBzMAx9YSUUc2xNSZ5RGN4MLInthrRgoEbPN4slREFEI2BYB4MajLyqwj40oeFjZQXQuqZWkUW6Uhx8OSf00cquMRCJn"
// );
const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });
    return NextResponse.json({ clientSceret: paymentIntent.client_secret });
  } catch (error) {
    return NextResponse.json(
      {
        error: `INternal server : ${error}`,
      },
      { status: 500 }
    );
  }
}
