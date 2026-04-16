import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import userLogo from "../../assets/userLogo.png";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

function UserInfo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const dispatch = useDispatch();
  const userId = params.id;
  const [updateUser, setUpdateUser] = useState(null);

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
      setLoading(true);
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
        // dispatch(setUser(res.data.user));
      }
    } catch (error) {
      console.log(error?.response?.data?.message);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getUserDetails = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/user/get-user/${userId}`,
      );
      if (res.data.success) {
        setUpdateUser(res.data.user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className="pt-5 min-h-screen bg-gray-100 mt-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
          <div className="flex justify-between gap-10">
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft />
            </Button>
            <h1 className="font-bold mb-7 text-2xl text-gray-800">
              Update Profile
            </h1>
          </div>

          <div className="w-full flex gap-10 justify-between items-start px-7 max-w-2xl">
            {/* Profile picture */}
            <div className="flex flex-col items-center">
              <img
                src={updateUser?.profilePic || userLogo}
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
                    placeholder="Enter first Name"
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
                    placeholder="Enter last Name"
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
                <Label className={"block text-sm font-medium"}>Address</Label>
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
                <Label className={"block text-sm font-medium"}>Zip Code</Label>
                <Input
                  type="text"
                  name="zipCode"
                  placeholder="Enter your ZipCode"
                  value={updateUser?.zipCode}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div className="flex gap-3 items-center">
                <Label className={"block text-sm font-medium"}>Role: </Label>
                <RadioGroup
                  value={updateUser?.role}
                  onValueChange={(value) =>
                    setUpdateUser({ ...updateUser, role: value })
                  }
                  className={"flex items-center"}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="user" id="user" />
                    <Label htmlFor="user">User</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin">Admin</Label>
                  </div>
                </RadioGroup>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className={
                  "w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg cursor-pointer"
                }
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Please wait
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
