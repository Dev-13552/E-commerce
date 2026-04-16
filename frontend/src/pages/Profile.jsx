import React, { useState } from "react";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser } from "@/redux/userSlice";
import userLogo from "../assets/userLogo.png";
import { toast } from "sonner";
import MyOrder from "./MyOrder";

function Profile() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { userId } = useParams();
  const [updateUser, setUpdateUser] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    phoneNo: user?.phoneNo,
    address: user?.address,
    zipCode: user?.zipCode,
    city: user?.city,
    profilePic: user?.profilePic,
    role: user?.role,
  });
  const [error, setError] = useState("")

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name == "phoneNo") {
      const cleaned = value.replace(/[^\d+]/g, "");
      if (cleaned.length > 10) return;
      setUpdateUser((prev) => ({
        ...prev,
        phoneNo: cleaned,
      }));
    } else {
      setUpdateUser({ ...updateUser, [e.target.name]: e.target.value });
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setUpdateUser((updateUser) => ({
      ...updateUser,
      profilePic: URL.createObjectURL(selectedFile),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(updateUser);
    if (!updateUser.phoneNo || !isValidPhoneNumber(updateUser.phoneNo)) {
    toast.error("Enter a valid phone number");
    return;
  }

    const accessToken = localStorage.getItem("accessToken");

    try {
      const formData = new FormData();
      formData.append("firstName", updateUser.firstName || "");
      formData.append("lastName", updateUser.lastName || "");
      formData.append("address", updateUser.address || "");
      formData.append("zipCode", updateUser.zipCode || "");
      formData.append("city", updateUser.city || "");
      formData.append("phoneNo", updateUser.phoneNo || "");
      formData.append("role", updateUser.role);
      formData.append("email", updateUser.email);

      if (file) {
        formData.append("file", file);
      }

      const res = await axios.put(
        `https://e-commerce-backend-60kd.onrender.com/api/v1/user/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser(res.data.user));
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile");
    }
  };
  return (
    <div className="pt-20 min-h-screen bg-gray-100">
      <Tabs defaultValue="profile" className="max-w-7xl mx-auto items-center">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <div>
            <div className="flex flex-col justify-center items-center bg-gray-100">
              <h1 className="font-bold mb-7 text-2xl text-gray-800">
                Update Profile
              </h1>
              <div className="w-full flex gap-10 justify-between items-start px-7 max-w-2xl">
                {/* Profile picture */}
                <div className="flex flex-col items-center">
                  <img
                    src={updateUser.profilePic || userLogo}
                    alt="profileImage"
                    className="w-32 h-32 rounded-full object-cover border-4 border-pink-800"
                  />
                  <Label
                    className={
                      "mt-4 cursor-pointer bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
                    }
                  >
                    Change Picture
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </Label>
                </div>

                {/* profile form  */}
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 shadow-lg p-5 rounded-lg bg-white"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className={"block text-sm font-medium"}>
                        First Name
                      </Label>
                      <Input
                        type="text"
                        name="firstName"
                        placeholder="John"
                        value={updateUser?.firstName}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                      />
                    </div>

                    <div>
                      <Label className={"block text-sm font-medium"}>
                        Last Name
                      </Label>
                      <Input
                        type="text"
                        name="lastName"
                        placeholder="Doe"
                        value={updateUser?.lastName}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className={"block text-sm font-medium"}>Email</Label>
                    <Input
                      type="email"
                      name="email"
                      disabled
                      value={updateUser?.email}
                      className="w-full border rounded-lg px-3 py-2 mt-1
                            bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <Label className={"block text-sm font-medium"}>
                      Phone Number
                    </Label>
                    <PhoneInput
                      international
                      defaultCountry="IN"
                      value={updateUser?.phoneNo}
                      onChange={(value) =>
                        setUpdateUser((prev) => ({
                          ...prev,
                          phoneNo: value,
                        }))
                      }
                      onBlur={() => {
                        if (
                          updateUser.phoneNo &&
                          !isValidPhoneNumber(updateUser.phoneNo)
                        ) {
                          setError("Invalid phone number");
                        } else {
                          setError("");
                        }
                      }}
                    />
                  </div>
                  <div>
                    <Label className={"block text-sm font-medium"}>
                      Address
                    </Label>
                    <Input
                      type="text"
                      name="address"
                      placeholder="Enter your Address"
                      value={updateUser?.address}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                  </div>

                  <div>
                    <Label className={"block text-sm font-medium"}>City</Label>
                    <Input
                      type="text"
                      name="city"
                      placeholder="Enter your City"
                      value={updateUser?.city}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                  </div>

                  <div>
                    <Label className={"block text-sm font-medium"}>
                      Zip Code
                    </Label>
                    <Input
                      type="text"
                      name="zipCode"
                      placeholder="Enter your ZipCode"
                      value={updateUser?.zipCode}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                  </div>
                  <Button
                    type="submit"
                    className={
                      "w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg"
                    }
                  >
                    Update Profile
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="orders">
          <MyOrder />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Profile;
