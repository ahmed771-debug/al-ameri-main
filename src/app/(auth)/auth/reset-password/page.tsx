"use client";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { EyeFilledIcon } from "../../../../components/icon/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../../../../components/icon/EyeSlashFilledIcon";
import { URLS } from "../../../../utils/constants";
import { postApiWithoutAuth } from "../../../../utils/apis";
import { NotificationManager } from "react-notifications";

export default function Login() {
  const router = useRouter();
  const [token, setToken] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [register, setRegister] = useState<any>();
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]); // To store password error messages
  const [passwordsMatch, setPasswordsMatch] = useState(true); // Track password match status
  const [formData, setFormData] = useState<any>({
    password: "",
    confirm_password: "",
    account_type: "USER",
  });
  const [submitted, setSubmitted] = useState(false); // Tracks form submission
  const [emptyFields, setEmptyFields] = useState(false); // To track empty fields

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    setToken(token);
  }, []);

  const validatePasswordSchema = (password: string) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters.");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password does not have an uppercase letter.");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password does not have a lowercase letter.");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password does not have a number.");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password does not have a special character.");
    }
    return errors;
  };

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleVisibility2 = () => setIsVisible2(!isVisible2);

  const ResetPassword = async () => {
    setSubmitted(true); // Mark that the form has been submitted
    setEmptyFields(false); // Reset empty fields flag

    // Check if any fields are empty
    if (!formData.password || !formData.confirm_password) {
      setEmptyFields(true);
      return;
    }

    const passwordErrors = validatePasswordSchema(formData.password);
    setPasswordErrors(passwordErrors);

    if (passwordErrors.length > 0) {
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setPasswordsMatch(false);
      return;
    }

    try {
      const url = URLS.RESET_PASSWORD;
      const res = await postApiWithoutAuth(url, { token: token, ...formData });
      setRegister(res);
      if (res?.data) {
        NotificationManager.success("Password successfully updated.");
        setFormData({
          ...formData,
          password: "",
          confirm_password: "",
        });
        router.push("/auth");
      } else {
        NotificationManager.error("Please try again!");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Reset errors when the user starts typing or clears the field
    if (name === "password" || name === "confirm_password") {
      setPasswordsMatch(true); // Reset the passwordsMatch state
      setPasswordErrors([]); // Clear password errors
      setEmptyFields(false); // Clear empty field warnings
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

      <div className="grid gap-2 col-content ">
        <>
          <p className="font-bold text-xl text-primary">Create New Password</p>
          <small style={{ color: "rgb(91 91 91" }}>
            Your new password must be different from previous used passwords and
            must meet the criteria below:
          </small>

          <div>
            <Input
              isInvalid={
                passwordErrors.length > 0 || (emptyFields && !formData.password)
              }
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
                  {!isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={!isVisible ? "password" : "text"}
            />
            {submitted && emptyFields && !formData.password && (
              <p className="text-red-600 text-sm">Password is required</p>
            )}
          </div>

          <div>
            <Input
              size="lg"
              isInvalid={emptyFields && !formData.confirm_password}
              label="Confirm Password"
              variant="bordered"
              placeholder="Password"
              name="confirm_password"
              value={formData.confirm_password}
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
                  onClick={toggleVisibility2}
                >
                  {!isVisible2 ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={!isVisible2 ? "password" : "text"}
            />
            {submitted && emptyFields && !formData.confirm_password && (
              <p className="text-red-600 text-sm">
                Confirm password is required
              </p>
            )}
            {submitted && !passwordsMatch && (
              <p className="text-red-600 text-sm">Passwords do not match</p>
            )}
          </div>

          <ul className="text-sm text-red-600 mt-2">
            {passwordErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
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
      </div>
    </div>
  );
}
