import React from "react";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCart } from "@/redux/productSlice";
import { Skeleton } from "./ui/skeleton";

function ProductCard({ product, loading }) {
  const { productImg, productPrice, productName } = product;
  const accessToken = localStorage.getItem("accessToken");
  const {user} = useSelector((state) => state.user)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addToCart = async (productId) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/cart/add",
        { productId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        toast.success("Product added to cart");
        dispatch(setCart(res.data.cart));
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message)
      console.log(error);
    }
  };
  return (
    <div className="shadow-lg rounded-lg overflow-hidden h-max">
      <div className="w-full h-full aspect-square overflow-hidden">
        {loading ? (
          <Skeleton className={`w-full h-full rounded-lg`} />
        ) : (
          <img
            onClick={() => navigate(`/products/${product._id}`)}
            src={productImg[0]?.url}
            alt="productImage"
            className="w-full h-full transition-transform duration-300 hover:scale-105 object-contain"
          />
        )}
      </div>
      <div className="px-2 space-y-1">
        <h1 className="font-semibold h-12 line-clamp-2">{productName}</h1>
        <h2 className="font-bold">₹{productPrice}</h2>
        <Button
          onClick={() => {if(!user){toast.error("Login first")}else{addToCart(product._id)}}}
          className={"bg-pink-600 mb-3 w-full"}
        >
          <ShoppingCart />
          Add To Cart
        </Button>
      </div>
    </div>
  );
}

export default ProductCard;
