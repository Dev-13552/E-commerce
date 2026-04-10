import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Label } from "radix-ui";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

function ForgotPassword() {
  const [formData, setFormData] = useState({ email: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/user/forgot-password`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if(res.data.success){
        toast.success("✅Link Sent to email Successfully")
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
        toast.error("Something Went Wrong")
        console.log(error?.response?.data?.message)
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-pink-100">
      <Card className={"w-full max-w-sm"}>
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>Enter your registered email</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <Button
              onClick={submitHandler}
              type="submit"
              className="w-full cursor-pointer bg-pink-600 hover:bg-pink-500"
            >
              Send Link
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
        <p className="text-gray-700 text-sm flex justify-end">
            <Link
              to={"/login"}
              className="hover:underline cursor-pointer text-pink-800"
            >
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ForgotPassword;
