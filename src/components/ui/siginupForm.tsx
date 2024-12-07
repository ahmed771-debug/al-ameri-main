"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input, Checkbox, Button } from "@nextui-org/react";
import { NotificationManager } from "react-notifications";
import { URLS } from "@/utils/constants";
import { postApiWithoutAuth, postAuth } from "@/utils/apis";

// Define types for form values and props
interface FormValues {
  username: string;
  email: string;
  password: string;
  checkbox: boolean;
}

interface SignUpFormProps {
  selectedButton: string;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ selectedButton }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [reg, setReg] = useState<any>();

  // Initial form values
  const initialValues: FormValues = {
    username: "",
    email: "",
    password: "",
    checkbox: false,
  };

  // Validation Schema using Yup
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .matches(
        /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/,
        "Username must be 3-20 characters, start with a letter, and contain no special characters other than underscore."
      )
      .required("Username is required"),
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[@$!%*?&]/,
        "Password must contain at least one special character (@$!%*?&)"
      )
      .required("Password is required"),
    checkbox: Yup.bool().oneOf(
      [true],
      "You must accept the terms and conditions"
    ),
  });

  // Form submission handler
  // const handleSubmit = async (
  //   values: FormValues,
  //   { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  // ) => {
  //   setLoading(true);
  //   const url =
  //     selectedButton === "login"
  //       ? URLS.LOGIN
  //       : selectedButton === "register"
  //       ? URLS.REGISTER
  //       : selectedButton === "forgot"
  //       ? URLS.FORGOT_PASSWORD
  //       : "/api/reset";

  //   try {
  //     setLoading(true);

  //     const payload = {
  //       ...values,
  //       account_type: "USER",
  //     };

  //     // Send API request
  //     const res = await postAuth(url, payload);

  //     // Check if the response status is not 200 or 201
  //     if (res?.status !== 200 && res?.status !== 201) {
  //       setReg(res);
  //       throw new Error(
  //         `Request failed with status code ${res?.status}: ${
  //           res?.data?.message || res?.statusText || "Unknown error"
  //         }`
  //       );
  //     }

  //     // Success notification
  //     NotificationManager.success(
  //       "Your account has been created successfully."
  //     );
  //   } catch (error: any) {
  //     // Log the error for debugging
  //     console.error("Error during signup:", error);

  //     // Error notification
  //     // NotificationManager.error(
  //     //   error?.message || "An error occurred while processing your request."
  //     // );
  //   } finally {
  //     setLoading(false);
  //     setSubmitting(false);
  //   }
  // };
  // const handleSubmit = async () => {
  //   // // Check if email and password are provided
  //   if (selectedButton === "forgot" && formData.email === "") {
  //     NotificationManager.error("Email cannot be empty.");
  //     return;
  //   } else if (selectedButton === "register") {
  //     const emptyFields = [];
  //     const checkboxFileds = [];

  //     if (formData.username === "") {
  //       emptyFields.push("Username");
  //     }
  //     if (formData.email === "") {
  //       emptyFields.push("Email");
  //     }
  //     if (formData.password === "") {
  //       emptyFields.push("Password");
  //     }
  //     if (formData.checkbox === "") {
  //       checkboxFileds.push("Checkbox");
  //     }

  //     if (emptyFields.length > 0) {
  //       const message = `${emptyFields.join(", ")} ${
  //         emptyFields.length === 1 ? "cannot be" : "cannot be"
  //       } empty.`;
  //       NotificationManager.error(message);
  //       return;
  //     }
  //     if (checkboxFileds.length > 0) {
  //       const message = `${checkboxFileds.join(", ")} ${
  //         checkboxFileds.length === 1 ? "should be " : "should be"
  //       } checked.`;
  //       NotificationManager.error(message);
  //       return;
  //     }
  //   }

  //   const url =
  //     selectedButton === "login"
  //       ? URLS.LOGIN
  //       : selectedButton === "register"
  //       ? URLS.REGISTER
  //       : selectedButton === "forgot"
  //       ? URLS.FORGOT_PASSWORD
  //       : "/api/reset";

  //   try {
  //     setLoading(true); // Disable the button by setting loading to true
  //     const res = await postApiWithoutAuth(url, formData);
  //     setRegister(res);
  //     if ((res && res.message) || (res && res?.data)) {
  //       if (selectedButton === "login") {
  //         if (res?.data) {
  //           // Assuming 'res.success' indicates a successful login
  //           NotificationManager.success("You've successfully logged in");
  //           setFormData({
  //             ...formData,
  //             email: "",
  //             password: "",
  //           });
  //           setCookie("access_token", res?.data?.access);
  //           // Store the token in local storage as well
  //           localStorage.setItem("access_token", res?.data?.access);

  //           router.push("/home");
  //         } else {
  //           NotificationManager.error("Invalid email or password.");
  //         }
  //       } else {
  //         // Handle responses for register, forgot, and reset
  //         NotificationManager.success(
  //           "Your account has been created successfully."
  //         );

  //         setSelectedButton("login");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("An error occurred:", error);
  //     NotificationManager.error(
  //       "An error occurred while processing your request."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  return (
    // <Formik
    //   initialValues={initialValues}
    //   validationSchema={validationSchema}
    //   onSubmit={handleSubmit}
    // >
    //   {({ values, handleChange, touched, errors, isValid, isSubmitting }) => (
    //     <Form>
    //       <div>
    //         <p className="text-[#5B5B5B]">
    //           Quickly register and access expert-led training programs and
    //           resources for dogs.
    //         </p>

    //         {/* Username Field */}
    //         <div>
    //           <Input
    //             isInvalid={!!(touched.username && errors.username)}
    //             type="text"
    //             label="User name"
    //             size="lg"
    //             placeholder="User name"
    //             radius="full"
    //             variant="bordered"
    //             labelPlacement="outside"
    //             name="username"
    //             value={values.username}
    //             onChange={handleChange}
    //             startContent={
    //               <img
    //                 src="/username.png"
    //                 width={17}
    //                 height={17}
    //                 alt="username icon"
    //               />
    //             }
    //           />
    //           <ErrorMessage
    //             name="username"
    //             component="small"
    //             className="text-danger"
    //           />
    //         </div>

    //         {/* Email Field */}
    //         <div>
    //           <Input
    //             isInvalid={!!(touched.email && errors.email)}
    //             type="email"
    //             label="Email"
    //             size="lg"
    //             placeholder="Email"
    //             radius="full"
    //             name="email"
    //             value={values.email}
    //             onChange={handleChange}
    //             variant="bordered"
    //             labelPlacement="outside"
    //             startContent={
    //               <img
    //                 src="/lock.png"
    //                 width={17}
    //                 height={17}
    //                 alt="email icon"
    //               />
    //             }
    //           />
    //           <ErrorMessage
    //             name="email"
    //             component="small"
    //             className="text-danger"
    //           />
    //         </div>

    //         {/* Password Field */}
    //         <div>
    //           <Input
    //             isInvalid={!!(touched.password && errors.password)}
    //             type="password"
    //             label="Password"
    //             size="lg"
    //             placeholder="Password"
    //             radius="full"
    //             variant="bordered"
    //             labelPlacement="outside"
    //             name="password"
    //             value={values.password}
    //             onChange={handleChange}
    //             startContent={
    //               <img
    //                 src="/password.png"
    //                 width={17}
    //                 height={17}
    //                 alt="password icon"
    //               />
    //             }
    //           />
    //           <ErrorMessage
    //             name="password"
    //             component="small"
    //             className="text-danger"
    //           />
    //         </div>

    //         {/* Checkbox for Terms and Conditions */}
    //         <div className="flex justify-between">
    //           <Checkbox
    //             size="sm"
    //             className="items-start"
    //             name="checkbox"
    //             onChange={handleChange}
    //             isSelected={values.checkbox}
    //           >
    //             By creating an account, you accept our terms & conditions and
    //             our privacy policies.
    //           </Checkbox>
    //           <ErrorMessage
    //             name="checkbox"
    //             component="small"
    //             className="text-danger"
    //           />
    //         </div>

    //         {/* Submit Button */}
    //         <div>
    //           <Button
    //             style={{
    //               width: "100%",
    //               padding: "1.5rem",
    //               backgroundColor: loading ? "#DDDDE0" : "#674960",
    //               color: "white",
    //               cursor:
    //                 loading || !isValid || isSubmitting
    //                   ? "not-allowed"
    //                   : "pointer",
    //             }}
    //             type="submit"
    //             disabled={loading || !isValid || isSubmitting}
    //             size="lg"
    //             className="py-3"
    //             radius="full"
    //           >
    //             {loading ? "Registering..." : "SIGN UP"}
    //           </Button>
    //         </div>
    //       </div>
    //     </Form>
    //   )}
    // </Formik>
    <div>sss</div>
  );
};

export default SignUpForm;
