"use client";
import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import { setCookie } from "cookies-next";
import { Checkbox, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { EyeFilledIcon } from "../../../components/icon/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../../../components/icon/EyeSlashFilledIcon";
import { URLS } from "../../../utils/constants";
import { postApiWithoutAuth } from "../../../utils/apis";
import { NotificationManager } from "react-notifications";
import * as Yup from "yup";
import LoginForm from "@/components/ui/loginForm";
import { FaRegCircleCheck } from "react-icons/fa6";

export default function Login() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [register, setRegister] = useState<any>();
  const [usernameError, setUsernameError] = useState<any>("");
  const [emailError, setEmailError] = useState<any>("");
  const [passwordError, setPasswordError] = useState<any>("");
  const [checkboxError, setCheckboxError] = useState<any>("");
  const [selected, setSelected] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [selectedButton, setSelectedButton] = useState<string>("login");
  const [formData, setFormData] = useState<any>({
    email: "",
    password: "",
    username: "",
    createpassword: "",
    account_type: "USER",
    checkbox: false,
  });
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .min(8, "Password is too short - should be 8 chars minimum.")
      .required("Required"),
  });
  const validateEmail = (value: any) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const validatePassword = (value: any) => value.length >= 8;
  const validateUser = (value: string) => {
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{2,19}$/;
    return usernameRegex.test(value);
  };

  const isInvalid = useMemo(() => {
    if (formData.email === "") return false;

    return validateEmail(formData.email) ? false : true;
  }, [formData.email]);
  const isUsernameInvalid = useMemo(() => {
    if (formData.username === "") return false;
    return !validateUser(formData.username);
  }, [formData.username]);
  const isPasswordInvalid = useMemo(() => {
    if (formData.password === "") return false;
    return validatePassword(formData.password) ? false : true;
  }, [formData.password]);
  const isCreatePasswordInvalid = useMemo(() => {
    if (formData.createpassword === "") return false;
    return validatePassword(formData.createpassword) ? false : true;
  }, [formData.createpassword]);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLoginClick = () => {
    setSelectedButton("login");
    setFormData({
      ...formData,
      email: "",
      password: "",
      username: "",
      createpassword: "",
    });
    // window.location.reload();
  };

  const handleRegisterClick = () => {
    setSelectedButton("register");
    setFormData({
      ...formData,
      email: "",
      password: "",
      username: "",
      createpassword: "",
    });
  };
  const handleForgotPasswordClick = () => {
    router.push("/auth/forgot-password");
    setSelectedButton("forgot");
    setFormData({
      ...formData,
      email: "",
      password: "",
      username: "",
      createpassword: "",
    });
  };

  const ForgotPassword = async () => {
    if (formData.email === "") {
      NotificationManager.error("Email Field cannot be empty.");
    }

    const url =
      selectedButton === "login"
        ? URLS.LOGIN
        : selectedButton === "register"
        ? URLS.REGISTER
        : selectedButton === "forgot"
        ? URLS.FORGOT_PASSWORD
        : "/api/reset";

    try {
      const res = await postApiWithoutAuth(url, formData);
      if (res?.message === "No User matches the given query.") {
        NotificationManager.error("No user found");
      }
      setRegister(res);

      if (res?.data) {
        NotificationManager.success(
          "Reset password email was successfully sent."
        );
        setSelectedButton("create");
      } else {
        NotificationManager.error("Field is empty");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const ResetPassword = async () => {
    const url = selectedButton === "login" ? URLS.RESET_PASSWORD : "";
    if (formData.password === "" && formData.createpassword === "") {
      NotificationManager.error("Fields are empty");
    }
    try {
      const res = await postApiWithoutAuth(url, formData);
      setRegister(res);
      if (res?.data) {
        NotificationManager.success(
          "Reset password email was successfully sent."
        );
        // setSelectedButton("create");
      } else {
        NotificationManager.error("Field is empty");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  console.log(formData.checkbox);
  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    // Clear the corresponding error message based on the input field
    if (name === "username") {
      setUsernameError("");
      setRegister("");
      // Clear username error on input
    } else if (name === "email") {
      setEmailError("");
      setRegister("");
    } else if (name === "password") {
      setRegister("");
      setPasswordError(""); // Clear password error on input
    }
    console.log(checked, "sss");
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  const handleSubmit = async () => {
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setCheckboxError("");
    // Check if email and password are provided
    if (selectedButton === "forgot" && formData.email === "") {
      NotificationManager.error("Email cannot be empty.");
      return;
    } else if (selectedButton === "register") {
      const emptyFields = [];
      const checkboxFileds = [];

      if (formData.username === "") {
        emptyFields.push("Username");
        setUsernameError("Username cannot be empty.");
      }
      if (formData.email === "") {
        emptyFields.push("Email");
        setEmailError("Email cannot be empty.");
      }
      if (formData.password === "") {
        emptyFields.push("Password");
        setPasswordError("Password cannot be empty.");
      }
      if (!formData.checkbox) {
        // Check if checkbox is false
        checkboxFileds.push("Checkbox");
        setCheckboxError("Checkbox should be checked.");
      }

      if (emptyFields.length > 0) {
        const message = `${emptyFields.join(", ")} ${
          emptyFields.length === 1 ? "cannot be" : "cannot be"
        } empty.`;
        // NotificationManager.error(message);
        return;
      }
      // Return early if checkbox is unchecked
      if (checkboxFileds.length > 0) {
        return; // Do not proceed to API call
      }
    }

    const url =
      selectedButton === "login"
        ? URLS.LOGIN
        : selectedButton === "register"
        ? URLS.REGISTER
        : selectedButton === "forgot"
        ? URLS.FORGOT_PASSWORD
        : "/api/reset";

    try {
      setLoading(true); // Disable the button by setting loading to true
      const res = await postApiWithoutAuth(url, formData);
      setRegister(res);
      if ((res && res.message) || (res && res?.data)) {
        if (selectedButton === "login") {
          if (res?.data) {
            // Assuming 'res.success' indicates a successful login
            NotificationManager.success("You've successfully logged in");
            setFormData({
              ...formData,
              email: "",
              password: "",
            });
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
          setFormData({
            ...formData,
            email: "",
            password: "",
            username: "",
          });

          setSelectedButton("login");
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
      NotificationManager.error(
        "An error occurred while processing your request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`h-full grid items-baseline lg:gap-y-16`}>
      <div>
        <Image
          src="/newlogo.svg"
          width={180}
          height={100}
          alt="logo"
          className="cursor-pointer"
          onClick={() => router.push("/home")}
        />
      </div>

      <div className="grid gap-2 col-content ">
        {selectedButton === "login" ? (
          <p className="font-bold text-xl " style={{ color: "#674960" }}>
            Hey, welcome back! 👋🏻
          </p>
        ) : selectedButton === "register" ? (
          <p className="font-bold text-xl text-primary">
            Create your free account
          </p>
        ) : (
          ""
        )}
        {selectedButton === "forgot" || selectedButton === "create" ? (
          ""
        ) : (
          <div className="border-solid border-2 rounded-full grid grid-cols-2 gap-4 p-1 ">
            <div>
              <Button
                onClick={handleLoginClick}
                style={{
                  width: "100%",
                  backgroundColor:
                    selectedButton === "login" ? "#674960" : "transparent",
                  color: selectedButton === "login" ? "white" : "",
                }}
                radius="full"
              >
                {selectedButton === "login" ? (
                  <>
                    <FaRegCircleCheck />
                    Login{" "}
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </div>
            <div>
              <Button
                onClick={handleRegisterClick}
                style={{
                  width: "100%",
                  backgroundColor:
                    selectedButton === "register" ? "#674960" : "transparent",
                  color: selectedButton === "register" ? "white" : "",
                }}
                radius="full"
                color="primary"
                variant="light"
              >
                {selectedButton === "register" ? (
                  <>
                    <FaRegCircleCheck />
                    Register{" "}
                  </>
                ) : (
                  "Register"
                )}
              </Button>
            </div>
          </div>
        )}

        {selectedButton === "login" ? (
          <LoginForm
            selectedButton={selectedButton}
            handleForgotPasswordClick={handleForgotPasswordClick}
            isVisible={isVisible}
            toggleVisibility={toggleVisibility}
            // handleSubmit={handleSubmit}
          />
        ) : selectedButton === "register" ? (
          <>
            <p className="text-[#5B5B5B]">
              Quickly register and access expert-led training programs and
              resources for dogs.
            </p>
            <div>
              <Input
                isInvalid={isUsernameInvalid}
                // color={isUsernameInvalid ? "danger" : "default"}
                errorMessage="Username must be 3-20 characters, start with a letter, and contain no special characters."
                type="text"
                label="User name"
                isRequired
                size="lg"
                placeholder="User name"
                radius="full"
                variant="bordered"
                labelPlacement="outside"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                startContent={
                  <Image
                    src="/username.png"
                    width={17}
                    height={17}
                    alt="username icon"
                  />
                }
              />

              {usernameError && (
                <small className="text-danger">{usernameError}</small>
              )}
              {register?.username && (
                <ul className="text-danger text-small">
                  {register.username.map((error: string, index: number) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <Input
                isInvalid={isInvalid}
                // color={isInvalid ? "danger" : "default"}
                errorMessage="Please enter a valid email"
                type="email"
                label="Email"
                isRequired
                size="lg"
                placeholder="Email"
                radius="full"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                variant="bordered"
                labelPlacement="outside"
                startContent={
                  <Image
                    src="/lock.png"
                    width={17}
                    height={17}
                    alt="username icon"
                  />
                }
              />

              {emailError && (
                <small className="text-danger">{emailError}</small>
              )}
              {register?.email && (
                <ul className="text-danger text-small">
                  {register.email.map((error: string, index: number) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <Input
                isInvalid={isPasswordInvalid}
                // color={isPasswordInvalid ? "danger" : "default"}
                errorMessage="Password is less than 8 characters"
                size="lg"
                isRequired
                label="Password"
                variant="bordered"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                radius="full"
                labelPlacement="outside"
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

              {passwordError && (
                <small className="text-danger">{passwordError}</small>
              )}
              {register?.password && (
                <ul className="text-danger text-small">
                  {register.password.map((error: string, index: number) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex justify-between ">
              <Checkbox
                size="sm"
                className="items-start"
                name="checkbox"
                onChange={handleInputChange}
                value={formData.checkbox}
              >
                {" "}
                By creating an account you accept our terms & conditions and our
                privacy policies.
              </Checkbox>
            </div>
            {checkboxError && (
              <small className="text-danger">{checkboxError}</small>
            )}
            <div>
              <Button
                style={{
                  width: "100%",
                  padding: "1.5rem",

                  backgroundColor: loading ? "#DDDDE0" : "#674960",
                  color: "white",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
                onClick={handleSubmit}
                disabled={loading} // Disable button when loading
                size="lg"
                className="py-3"
                radius="full"
              >
                {loading ? "Resgistering..." : "SIGN UP"}
              </Button>
            </div>
          </>
        ) : selectedButton === "forgot" ? (
          <>
            <p className="font-bold text-xl " style={{ color: "#674960" }}>
              Reset Your Password
            </p>
            <small>
              Enter the email addresses associated with your account
            </small>
            <div></div>
            <div>
              <Input
                isInvalid={isInvalid}
                color={isInvalid ? "default" : "default"}
                errorMessage="Please enter a valid email"
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
                onClick={() => window.location.reload()}
              >
                BACK TO LOGIN
              </Button>
            </div>
          </>
        ) : selectedButton === "create" ? (
          <>
            <p className="font-bold text-xl text-primary">
              Create New Password
            </p>
            <small>
              Your new password must be different from previous used password.
            </small>

            <div>
              <Input
                isInvalid={isPasswordInvalid}
                color={isPasswordInvalid ? "default" : "default"}
                errorMessage="Password is less than 8 characters"
                size="lg"
                label="New Password"
                variant="bordered"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                radius="full"
                labelPlacement="outside"
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
                    {isVisible ? (
                      <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
                type={isVisible ? "text" : "password"}
              />
            </div>
            <div>
              {/* <Input
                isRequired
                size="lg"
                label="Confrim New Password"
                variant="bordered"
                placeholder="Password"
                labelPlacement="outside"
                className="max-w-xl"
                startContent={
                  <Image
                    src="/password.png"
                    width={15}
                    height={15}
                    alt="logo"
                  />
                }
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
                type={isVisible ? "text" : "password"}
              /> */}
              <Input
                isInvalid={isCreatePasswordInvalid}
                color={isCreatePasswordInvalid ? "default" : "default"}
                errorMessage="Password is less than 8 characters"
                size="lg"
                label="Create Password"
                variant="bordered"
                placeholder="Password"
                name="password"
                value={formData.createpassword}
                onChange={handleInputChange}
                radius="full"
                labelPlacement="outside"
                startContent={
                  <Image
                    src="/username.png"
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
                    {isVisible ? (
                      <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
                type={isVisible ? "text" : "password"}
              />
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
                onClick={ResetPassword}
              >
                Update Password
              </Button>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
