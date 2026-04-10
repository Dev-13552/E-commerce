import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

function ChangePassword() {
  const navigate = useNavigate();
  const {email} = useParams()
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

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
        `${import.meta.env.VITE_URL}/api/v1/user/change-password/${email}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (res.data.success) {
        toast.success("✅Password Changed Successfully");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
        console.log(error?.response?.data?.message)
      toast.error("Something Went Wrong while changing Password");
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
                name="newPassword"
                type="password"
                placeholder="Enter new Password"
                required
                value={formData.newPassword}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Input
                id="email"
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <Button
              onClick={submitHandler}
              type="submit"
              className="w-full cursor-pointer bg-pink-600 hover:bg-pink-500"
            >
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ChangePassword;
