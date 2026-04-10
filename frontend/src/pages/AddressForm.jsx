import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  addAddress,
  deleteAddresses,
  setCart,
  setSelectedAddress,
} from "@/redux/productSlice";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function AddressForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart, addresses, selectedAddress } = useSelector(
    (state) => state.product,
  );
  const [showForm, setShowForm] = useState(addresses.length > 0 ? false : true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    dispatch(addAddress(formData));
    setShowForm(false);
  };

  const subTotal = cart.totalPrice;
  const shipping = subTotal > 50 ? 0 : 10;
  const tax = parseFloat((subTotal * 0.05).toFixed(2));
  const total = subTotal + shipping + tax;

  const handlePayment = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/orders/create-order`,
        {
          products: cart?.items?.map((item) => ({
            productId: item.productId._id,
            quantity: item.quantity,
          })),
          tax,
          shipping,
          amount: total,
          currency: "INR",
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!data.success) return toast.error("Something went wrong");
 
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        order_id:data.order.id,
        name: "E-commerce",
        description: "Order payment",
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
              response,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              },
            );
            
            if(verifyRes.data.success){
              toast.success("✅Payment Successfull?")
              dispatch(setCart({items: [], totalPrice: 0}))
              navigate("/order-success")
            } else {
              toast.error("❌Payment Verification Failed!")
            }

          } catch (error) {
            console.log(error.message);
            toast.error("Error verifying payment")
          }
        },
        modal: {
          ondismiss: async function (){
            await axios.post(`${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`, {
              razorpay_order_id: data.order.id,
              paymentFailed: true,
            }, {
              headers:{
                Authorization: `Bearer ${accessToken}`
              }
            })
            toast.error("Payment Cancelled or Failed")
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {color: "#F47286"}
      };

      const rzp = new window.Razorpay(options)

      // Listen for payment failures
      rzp.on("payment.failed", async function (response){
        await axios.post(`${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`, {
              razorpay_order_id: data.order.id,
              paymentFailed: true,
            },
            {headers: {Authorization: `Bearer ${accessToken}`}})
        toast.error("Payment Failed. Please try again")
      })

      rzp.open()

    } catch (error) {
      console.error(error)
      toast.error("Something went wrong while processing payment")
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid place-items-center p-10">
      <div className="grid grid-cols-2 items-start gap-20 mt-10 max-w-7xl mx-auto">
        <div className="space-y-4 p-6 bg-white">
          {showForm ? (
            <>
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  required
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  required
                  placeholder="+91 9999999999"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  required
                  placeholder="example123@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  required
                  placeholder="123 Street, Area"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    required
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    required
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zip">Zip Code</Label>
                  <Input
                    id="zip"
                    name="zip"
                    required
                    placeholder="000111"
                    value={formData.zip}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    required
                    placeholder="India"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <Button onClick={handleSave} className={"w-full"}>
                Save & Continue
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Saved Addresses</h2>
              {addresses.map((address, index) => (
                <div
                  onClick={() => dispatch(setSelectedAddress(index))}
                  key={index}
                  className={`border p-4 rounded-md cursor-pointer relative ${selectedAddress === index ? "border-pink-600 bg-pink-50" : "border-gray-300"}`}
                >
                  <p className="font-medium">{address.fullName}</p>
                  <p>{address.phone}</p>
                  <p>{address.email}</p>
                  <p>
                    {address.address}, {address.city}, {address.state},{" "}
                    {address.zip}, {address.country}
                  </p>
                  <button
                    onClick={(e) => dispatch(deleteAddresses(index))}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowForm(true)}
              >
                + Add New Address
              </Button>
              <Button
                disabled={selectedAddress === null}
                className={"w-full bg-pink-600"}
                onClick = {handlePayment}
              >
                Proceed To Checkout
              </Button>
            </div>
          )}
        </div>
        {/* Right Side order Summary */}
        <div>
          <Card className={"w-400px"}>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className={"space-y-4"}>
              <div className="flex justify-between">
                <span>Subtotal ({cart.items.length}) items</span>
                <span>₹{subTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shipping}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{tax}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-black text-lg">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
              <div className="text-sm text-muted-foreground pt-4">
                <p>* Free shipping on orders above 299</p>
                <p>* 7-days return policy</p>
                <p>* Secure checkout with SSL encryption</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AddressForm;
