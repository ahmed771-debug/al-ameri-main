"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input, Button, Checkbox } from "@nextui-org/react"; // Adjust the import based on your UI library
import Image from "next/image"; // Assuming you're using Next.js
import { NotificationManager } from "react-notifications"; // Make sure to install react-notifications
import { URLS } from "@/utils/constants";
import { postApiWithoutAuth } from "@/utils/apis";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { EyeFilledIcon } from "../../components/icon/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../../components/icon/EyeSlashFilledIcon";

// Define the props type for the LoginForm component
interface LoginFormProps {
  selectedButton: string;
  isVisible: boolean;
  toggleVisibility: any;
  handleForgotPasswordClick: () => void;
}

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LoginForm: React.FC<LoginFormProps> = ({
  selectedButton,
  handleForgotPasswordClick,
  isVisible,
  toggleVisibility,
}) => {
  const router = useRouter();
  const handleSubmit = async (values: { email: string; password: string }) => {
    const url =
      selectedButton === "login"
        ? URLS.LOGIN
        : selectedButton === "register"
        ? URLS.REGISTER
        : selectedButton === "forgot"
        ? URLS.FORGOT_PASSWORD
        : "/api/reset";

    try {
      const res = await postApiWithoutAuth(url, values);
      if ((res && res.message) || (res && res?.data)) {
        if (selectedButton === "login") {
          if (res?.data) {
            // Assuming 'res.success' indicates a successful login
            NotificationManager.success("You've successfully logged in");

            setCookie("access_token", res?.data?.access);
            // Store the token in local storage as well

            router.push("/home");
          } else {
            NotificationManager.error("Invalid email or password.");
          }
        } else {
          // Handle responses for register, forgot, and reset
          NotificationManager.success(
            "Your account has been created successfully."
          );
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
      NotificationManager.error(
        "An error occurred while processing your request."
      );
    } finally {
    }
  };
  return (
    <div>
      {selectedButton === "login" && (
        <>
          <p style={{ color: "rgb(91 91 91)" }}>
            Fill your email address and password to sign in to your account.
          </p>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-10 mt-10">
                  <Field name="email">
                    {({ field, form }: { field: any; form: any }) => (
                      <Input
                        {...field}
                        isInvalid={
                          form.touched.email && Boolean(form.errors.email)
                        }
                        errorMessage={form.errors.email}
                        type="email"
                        label="Email"
                        size="lg"
                        radius="full"
                        placeholder="Email"
                        variant="bordered"
                        labelPlacement="outside"
                        startContent={
                          <Image
                            src="/lock.png"
                            width={15}
                            height={15}
                            alt="logo"
                          />
                        }
                      />
                    )}
                  </Field>
                  {/* <ErrorMessage
                    name="email"
                    component="small"
                    className="text-red-600"
                  /> */}
                </div>

                <div className="mb-3">
                  <Field name="password">
                    {({ field, form }: { field: any; form: any }) => (
                      <Input
                        {...field}
                        isInvalid={
                          form.touched.password && Boolean(form.errors.password)
                        }
                        errorMessage={form.errors.password}
                        size="lg"
                        label="Password"
                        variant="bordered"
                        placeholder="Password"
                        radius="full"
                        labelPlacement="outside"
                        // type="password"
                        startContent={
                          <Image
                            src="/lockPassword.svg"
                            width={17}
                            height={17}
                            alt="username icon"
                          />
                        }
                        endContent={
                          <button
                            className="focus:outline-none"
                            type="button"
                            onClick={toggleVisibility}
                          >
                            {!isVisible ? (
                              <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            ) : (
                              <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            )}
                          </button>
                        }
                        type={!isVisible ? "password" : "text"}
                      />
                    )}
                  </Field>
                  {/* <ErrorMessage
                    name="password"
                    component="small"
                    className="text-red-600"
                  /> */}
                </div>

                <div className="flex justify-between mb-2">
                  <Checkbox size="sm" className="items-start" name="checkbox">
                    Remember me
                  </Checkbox>
                  <small
                    className="cursor-pointer"
                    onClick={handleForgotPasswordClick}
                  >
                    Forgot Password?
                  </small>
                </div>

                <div>
                  <Button
                    style={{
                      width: "100%",
                      padding: "1.5rem",
                      backgroundColor: isSubmitting ? "#DDDDE0" : "#674960",
                      color: "white",
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                    }}
                    type="submit"
                    disabled={isSubmitting}
                    size="lg"
                    className="py-3"
                    radius="full"
                  >
                    {isSubmitting ? "Logging in..." : "Login"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </>
      )}
    </div>
  );
};

export default LoginForm;
