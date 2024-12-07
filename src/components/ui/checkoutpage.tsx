"use client";

import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Button from "./Button";
import { NotificationManager } from "react-notifications";
import { BeatLoader } from "react-spinners";
import { Input } from "@nextui-org/react";

export default function CheckoutPage({
  amount,
  promoCode,
  setPromoCode,
  message,
  loading,
}: {
  amount: any;
  promoCode: any;
  setPromoCode: any;
  message: any;
  loading: any;
}) {
  const [promotionMessage, setPromotionMessage] = useState<any>(null);

  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,

      confirmParams: {
        return_url: "https://staging.globalretrieversolutions.com/success",
      },
    });

    if (error && error.message && error.decline_code) {
      NotificationManager.error(error?.message);
    } else {
      // setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions: any = {
    layout: "tabs",
  };
  useEffect(() => {
    const url = new URL(window.location.href);
    const promo = url.searchParams.get("promoCode");
    setPromotionMessage(message);
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPromoCode(e.target.value); // Update promo code state
  };
  return (
    <>
      <form
        id="payment-form"
        onSubmit={handleSubmit}
        style={{
          // border: "1px solid black",
          boxShadow: " rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset",
          padding: "1rem",
          color: "white",
          // background: "#674960",
          textAlign: "center",
          marginBottom: "2rem",
        }}
      >
        <PaymentElement id="payment-element" options={paymentElementOptions} />
        <div className="">
          <div className="w-full">
            <Input
              type="text"
              size="sm"
              label="Promo Code"
              value={promoCode} // Use promoCode for input value
              onChange={handleInputChange}
              className="mt-3 mb-3 rounded-full text-black"
              color="warning"
              variant="underlined"
              // labelPlacement="outside-left"
            />
          </div>
        </div>
        <button disabled={isLoading || !stripe || !elements} id="submit">
          <span id="button-text">
            {/* {promotionMessage && (
              <div
                style={{
                  marginTop: "1rem",
                  marginBottom: "1rem",
                  fontWeight: "bold",
                  color: "#28a745", // Green color for applied promo message
                }}
              >
                Promo Applied!
              </div>
            )} */}
            {!loading ? ( // Show loading message when loading is true
              <div className="text-green-500">{message}</div>
            ) : (
              <BeatLoader color="#674960" size={15} className="mt-2" />
            )}
            <br />
            {/* {loading && <div className="text-primary ">{message}</div>} */}
            {isLoading ? (
              <BeatLoader color="#674960" size={15} className="mt-2" />
            ) : (
              <Button
                type="submit"
                className="md:w-[24rem] sm:w-full  text-cyan-50 mt-1 bg-[#674960]"
              >
                Pay Now
              </Button>
            )}
          </span>
        </button>
        {/* Show any error or success messages */}
      </form>
    </>
  );
}
