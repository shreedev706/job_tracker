import React, { useState } from "react";
import { Button, FormInput, FormLabel } from "../shared";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../http/http"; // Adjusted path to target your client utility direct
import { isValidEmail } from "../../utils/utils";
import { enqueueSnackbar } from "notistack";

const Signup: React.FC = () => {
  // ✨ Initialized states as explicit empty strings to guarantee controlled fields
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Field Verification Validation
    if (!name || !email || !password) {
      enqueueSnackbar("Please fill all the fields!", {
        variant: "warning",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      return;
    }

    // Email Pattern Validation
    if (!isValidEmail(email)) {
      enqueueSnackbar("Please enter a valid email-id!", {
        variant: "warning",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      return;
    }

    try {
      setLoading(true);
      const { data } = await register({ name, email, password });
      
      enqueueSnackbar(data?.message || "Account created successfully!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      
      // Navigate cleanly back to your login home interface
      navigate("/");
    } catch (error: any) {
      console.error("Signup validation failure exception context:", error);
      
      const errorMessage = error?.response?.data?.message || "An unexpected error occurred during signup.";
      enqueueSnackbar(errorMessage, {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
    } {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm p-4 rounded-lg sm:p-6 md:p-8 bg-neutral-900 w-[100%] border border-neutral-800 shadow-md">
      <form className="space-y-4" onSubmit={handleSignup}>
        <h5 className="text-xl font-medium text-white text-center">
          Create an Account
        </h5>
        
        <div>
          <FormLabel htmlFor="name" labelHeading="Your name" />
          <FormInput
            type="text"
            name="name"
            id="name"
            value={name}
            setState={setName}
            placeholder="John Doe"
          />
        </div>
        
        <div>
          <FormLabel htmlFor="email" labelHeading="Your email" />
          <FormInput
            type="email"
            name="email"
            id="email"
            value={email}
            setState={setEmail}
            placeholder="name@company.com"
          />
        </div>
        
        <div>
          <FormLabel htmlFor="password" labelHeading="Your password" />
          <FormInput
            type="password"
            name="password"
            id="password"
            value={password}
            setState={setPassword}
            placeholder="••••••••"
          />
        </div>

        <Button
          content="Create your account"
          handleInput={handleSignup}
          isloading={loading}
        />
        
        <div className="text-sm font-medium text-neutral-400 text-center pt-2">
          Already registered?
          <Link to="/" className="hover:underline text-indigo-400 ml-1 font-semibold">
            Signin
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;