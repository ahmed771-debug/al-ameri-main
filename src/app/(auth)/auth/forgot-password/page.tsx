"use client";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { URLS } from "../../../../utils/constants";
import { postApiWithoutAuth } from "../../../../utils/apis";
import { NotificationManager } from "react-notifications";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState<any>({
    email: "",
  });
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isEmailEmpty, setIsEmailEmpty] = useState(false);

  const validateEmail = (value: string) => {
    const emailPattern =
      /^(?!.*[_.-]{2})[A-Za-z0-9]+([._-]?[A-Za-z0-9]+)*@[A-Za-z0-9]+([.-]?[A-Za-z0-9]+)*\.[A-Za-z]{2,}$/;
    const trimmedValue = value.trim();
    return (
      trimmedValue.length > 0 &&
      !trimmedValue.startsWith(".") &&
      !trimmedValue.startsWith("-") &&
      !trimmedValue.endsWith(".") &&
      !trimmedValue.endsWith("-") &&
      emailPattern.test(trimmedValue)
    );
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    setIsEmailEmpty(false);
    if (name === "email") {
      setIsEmailValid(validateEmail(value));
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const remainingSeconds = timeInSeconds % 60;
    return `${minutes} minutes and ${remainingSeconds} seconds`;
  };

  const startTimer = (seconds: number) => {
    setTimer(seconds);
    setIsTimerActive(true);
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0) {
          clearInterval(countdown);
          setIsTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const ForgotPassword = async () => {
    const trimmedEmail = formData.email.trim();

    if (trimmedEmail === "") {
      setIsEmailEmpty(true);
      return;
    }

    if (!isEmailValid) {
      NotificationManager.error("Please enter a valid email address.");
      return;
    }

    const url = URLS.FORGOT_PASSWORD;

    try {
      const res = await postApiWithoutAuth(url, formData);
      console.log(res, "resss");
      if (res?.data) {
        NotificationManager.success(
          "Reset password email was successfully sent."
        );
      } else if (res?.message?.includes("No User matches the given query.")) {
        NotificationManager.error("Invalid email, please try again.");
      } else if (res?.message?.includes("Please try again after")) {
        const secondsMatch = res.message.match(/(\d+)\sseconds?/);
        if (secondsMatch) {
          let seconds = parseInt(secondsMatch[1], 10);
          NotificationManager.error(
            `Please try again after: ${formatTime(seconds)}`
          );
          startTimer(seconds); // Start the countdown timer
        } else {
          NotificationManager.error(res.message);
        }
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error("An error occurred:", error);
      NotificationManager.error("Please try again.");
    }
  };

  return (
    <div className={`h-full grid items-baseline lg:gap-y-16`}>
      <div>
        <Image
          src="/logo.svg"
          width={250}
          height={100}
          alt="logo"
          className="cursor-pointer"
          onClick={() => router.push("/home")}
        />
      </div>

      <div className="grid gap-2 col-content">
        <p className="font-bold text-xl" style={{ color: "#674960" }}>
          Reset Your Password
        </p>
        <small>Enter the email address associated with your account</small>

        <div>
          <Input
            isInvalid={!isEmailValid || isEmailEmpty}
            color={!isEmailValid || isEmailEmpty ? "default" : "default"}
            type="email"
            label="Email"
            size="lg"
            radius="full"
            placeholder="Email"
            variant="bordered"
            labelPlacement="outside"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            startContent={
              <Image src="/lock.png" width={15} height={15} alt="logo" />
            }
          />
          {isEmailEmpty && (
            <p className="text-red-600 text-sm">Email address required</p>
          )}
          {!isEmailValid && !isEmailEmpty && (
            <p className="text-red-600 text-sm">
              Please enter a valid email address
            </p>
          )}
        </div>

        <div>
          <Button
            style={{
              width: "100%",
              padding: "1.5rem",
              backgroundColor: "#674960",
              color: "white",
            }}
            size="lg"
            className="py-3"
            radius="full"
            onClick={ForgotPassword}
          >
            CONTINUE
          </Button>
        </div>

        <div>
          <Button
            style={{
              width: "100%",
              padding: "1.5rem",
              border: "1px solid #674960",
              backgroundColor: "transparent",
              color: "#674960",
            }}
            size="lg"
            className="py-3"
            radius="full"
            onClick={() => router.push("/auth")}
          >
            BACK TO LOGIN
          </Button>
        </div>

        {/* Move the timer display below the buttons */}
        {/* {isTimerActive && (
          <div className="timer-display text-small text-red-500 mt-4">
            Time Remaining: {formatTime(timer)}
          </div>
        )} */}
      </div>
    </div>
  );
}
